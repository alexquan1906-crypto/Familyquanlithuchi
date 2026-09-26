import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInOrSignUp: (accountInput: string, password: string) => Promise<{ isNewAccount: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const formatAuthEmail = (input: string) => {
  const clean = input.trim().toLowerCase();
  if (clean.includes('@')) return clean;
  return `${clean}@family.local`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Timeout dự phòng: Không để giao diện bị kẹt loading quá 4s nếu mạng chậm
    const timer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 4000);

    // 1. Lắng nghe thay đổi trạng thái xác thực
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!isMounted) return;
        console.log('[Auth] onAuthStateChange:', event, !!newSession);

        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          setLoading(false);
          clearTimeout(timer);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setLoading(false);
          clearTimeout(timer);
        }
        // Lưu ý: Nếu event là INITIAL_SESSION mà newSession = null,
        // TUYỆT ĐỐI KHÔNG set loading = false ở đây, để getSession() đọc từ storage xong.
      }
    );

    // 2. Phục hồi phiên đăng nhập từ localStorage khi reload trang
    supabase.auth.getSession()
      .then(({ data: { session: currentSession }, error }) => {
        if (!isMounted) return;
        if (error) {
          console.warn('[Auth] getSession error:', error.message);
        }
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        }
        setLoading(false);
        clearTimeout(timer);
      })
      .catch((err) => {
        console.warn('[Auth] getSession exception:', err);
        if (isMounted) setLoading(false);
        clearTimeout(timer);
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const signInOrSignUp = async (accountInput: string, password: string) => {
    const email = formatAuthEmail(accountInput);

    // 1. Thử đăng nhập với tài khoản có sẵn
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!signInError && signInData.session) {
      setSession(signInData.session);
      setUser(signInData.user);
      return { isNewAccount: false };
    }

    // 2. Nếu đăng nhập thất bại do tài khoản chưa tồn tại hoặc sai mật khẩu:
    if (signInError && signInError.message.includes('Invalid login credentials')) {
      // Tự động tạo/kích hoạt tài khoản mới cho thành viên gia đình
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!signUpError && signUpData.session) {
        setSession(signUpData.session);
        setUser(signUpData.user);
        return { isNewAccount: true };
      }

      // Nếu tài khoản đã tồn tại sẵn trong hệ thống nhưng người dùng nhập sai mật khẩu
      if (signUpError && signUpError.message.toLowerCase().includes('already registered')) {
        throw new Error('Sai mật khẩu của tài khoản gia đình này! Vui lòng kiểm tra lại mật khẩu.');
      }

      if (signUpError) {
        throw new Error(signUpError.message || 'Không thể tạo hoặc đăng nhập tài khoản gia đình.');
      }
    }

    if (signInError) {
      if (signInError.message.includes('Email not confirmed')) {
        throw new Error('Email chưa được xác thực! Vui lòng vào hộp thư email để bấm link kích hoạt, hoặc tắt "Confirm email" trong cài đặt Supabase.');
      }
      throw signInError;
    }

    return { isNewAccount: false };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, signInOrSignUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
