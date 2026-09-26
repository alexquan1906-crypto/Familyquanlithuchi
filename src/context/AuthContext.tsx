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

    // Safety timeout: 3.5s
    const timer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3500);

    // Initial session check
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Lỗi lấy phiên đăng nhập Supabase:', err);
        if (isMounted) setLoading(false);
      })
      .finally(() => {
        clearTimeout(timer);
      });

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
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
      // Tự động kích hoạt tài khoản mới cho gia đình
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!signUpError && signUpData.session) {
        setSession(signUpData.session);
        setUser(signUpData.user);
        return { isNewAccount: true };
      }

      // Nếu đã có người tạo tài khoản này rồi nhưng người sau nhập sai mật khẩu
      if (signUpError && signUpError.message.toLowerCase().includes('already registered')) {
        throw new Error('Sai mật khẩu của tài khoản gia đình này! Vui lòng hỏi lại người thân để nhập đúng mật khẩu.');
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
