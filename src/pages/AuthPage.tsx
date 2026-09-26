import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Sparkles, HeartHandshake, Loader2 } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setSsoLoading(true);
    try {
      await signInWithGoogle();
      // Supabase sẽ chuyển hướng người dùng sang trang Google OAuth
    } catch (error: any) {
      console.error('Lỗi đăng nhập Google SSO:', error);
      toast.error(error.message || 'Không thể đăng nhập bằng Google. Vui lòng thử lại!');
      setSsoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Đăng nhập thành công! Chào mừng bạn quay lại.');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Đăng ký tài khoản thành công!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      {/* Ambient background glowing orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-9 relative z-10 animate-in-scale">
        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3 group">
            <img 
              src="/logo.jpg" 
              alt="Family Finance Logo" 
              className="w-20 h-20 md:w-24 md:h-24 rounded-3xl shadow-xl shadow-emerald-500/20 object-cover border-2 border-white ring-4 ring-emerald-500/10 transition-transform group-hover:scale-105 duration-200" 
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white">
              <Sparkles size={12} />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Family Finance
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">
            Không gian tài chính & thu chi dành riêng cho gia đình
          </p>
        </div>

        {/* Google SSO Button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={ssoLoading || loading}
            className="w-full min-h-[50px] px-4 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold text-sm rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer group"
          >
            {ssoLoading ? (
              <>
                <Loader2 size={18} className="animate-spin text-emerald-600" />
                <span>Đang kết nối Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                <span className="group-hover:text-slate-900 transition-colors">Tiếp tục với tài khoản Google</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white/95 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Hoặc tiếp tục bằng Email
          </span>
          <div className="border-t border-slate-200 w-full"></div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${
              isLogin ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${
              !isLogin ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-1.5 ml-1">
              Email Tài Khoản
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full min-h-[50px] text-sm pl-11 pr-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                placeholder="nhadep@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-1.5 ml-1">
              Mật Khẩu
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full min-h-[50px] text-sm pl-11 pr-11 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                placeholder="Tối thiểu 6 ký tự..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[50px] mt-4 font-black text-sm md:text-base rounded-2xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Đang xử lý...</span>
            ) : isLogin ? (
              <span>Đăng Nhập Vào Không Gian Gia Đình</span>
            ) : (
              <span>Tạo Không Gian Gia Đình Mới</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
          <HeartHandshake size={15} className="text-emerald-500" />
          <span>Bảo mật dữ liệu tài chính gia đình tuyệt đối</span>
        </div>
      </div>
    </div>
  );
}
