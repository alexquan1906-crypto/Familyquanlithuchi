import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (accountInput: string, password: string) => Promise<void>;
  signUp: (accountInput: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInOrSignUp: (accountInput: string, password: string) => Promise<{ isNewAccount: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Chuẩn hóa input: nếu người dùng nhập email thì giữ nguyên,
 * nếu nhập tên tài khoản không có '@', tự động gán đuôi '@app.com' để Supabase Auth xử lý hợp lệ.
 */
export const normalizeEmail = (input: string) => {
  const clean = input.trim().toLowerCase();
  if (clean.includes('@')) return clean;
  return `${clean}@app.com`;
};

// Giữ lại alias để tương thích ngược nếu có chỗ import formatAuthEmail
export const formatAuthEmail = normalizeEmail;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Timeout dự phòng 2.5s tránh màn hình bị treo loading trên điện thoại mạng yếu
    const timer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 2500);

    // 1. Lắng nghe thay đổi trạng thái xác thực
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setUser(newSession ? newSession.user : null);
        setLoading(false);
        clearTimeout(timer);
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

  // ĐĂNG NHẬP
  const signIn = async (accountInput: string, password: string) => {
    const email = normalizeEmail(accountInput);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác!');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Email chưa được kích hoạt trong Supabase!');
      }
      throw new Error(error.message || 'Đăng nhập không thành công.');
    }

    if (data.session) {
      setSession(data.session);
      setUser(data.user);
    }
  };

  // ĐĂNG KÝ
  const signUp = async (accountInput: string, password: string) => {
    const email = normalizeEmail(accountInput);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        throw new Error('Tài khoản này đã tồn tại! Vui lòng chuyển sang tab Đăng Nhập.');
      }
      throw new Error(error.message || 'Không thể tạo tài khoản mới.');
    }

    if (data.session) {
      setSession(data.session);
      setUser(data.user);
    } else {
      // Nếu Supabase chưa trả về session ngay, thử đăng nhập luôn
      const { data: loginData } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginData?.session) {
        setSession(loginData.session);
        setUser(loginData.user);
      }
    }
  };

  // Hàm tương thích ngược nếu cần
  const signInOrSignUp = async (accountInput: string, password: string) => {
    try {
      await signIn(accountInput, password);
      return { isNewAccount: false };
    } catch {
      await signUp(accountInput, password);
      return { isNewAccount: true };
    }
  };

  // ĐĂNG XUẤT
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, signInOrSignUp }}>
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
