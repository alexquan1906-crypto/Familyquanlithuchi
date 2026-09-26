import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Sparkles, HeartHandshake, Loader2, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    // Chuẩn hóa email: xóa khoảng trắng 2 đầu và chuyển về chữ thường
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ!');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 ký tự!');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: cleanEmail, 
          password 
        });

        if (error) {
          console.error('Lỗi đăng nhập:', error);
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại.');
          }
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Email chưa được xác thực! Vui lòng vào hộp thư email để bấm link kích hoạt, hoặc tắt "Confirm email" trong cài đặt Supabase.');
          }
          throw error;
        }

        toast.success('Đăng nhập thành công! Đang chuyển hướng...');
        navigate('/');
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email: cleanEmail, 
          password 
        });

        if (error) {
          console.error('Lỗi đăng ký:', error);
          throw error;
        }

        if (!data.session) {
          toast.success('Đăng ký thành công! Hãy kiểm tra hộp thư email để kích hoạt tài khoản.');
          setErrorMessage('Tài khoản đã tạo! Nếu Supabase yêu cầu xác thực email, bạn cần bấm link kích hoạt trong hộp thư trước khi đăng nhập.');
        } else {
          toast.success('Đăng ký tài khoản thành công!');
          navigate('/');
        }
      }
    } catch (error: any) {
      const msg = error.message || 'Có lỗi xảy ra, vui lòng thử lại!';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-9 relative z-10 animate-in-scale">
        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3 group">
            <img 
              src="/logo.jpg" 
              alt="Family Finance Logo" 
              className="w-20 h-20 md:w-22 md:h-22 rounded-3xl shadow-xl shadow-emerald-500/20 object-cover border-2 border-white ring-4 ring-emerald-500/10 transition-transform group-hover:scale-105 duration-200" 
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

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 cursor-pointer ${
              isLogin ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 cursor-pointer ${
              !isLogin ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Inline Error Alert if any */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs md:text-sm font-semibold flex items-start gap-2.5 animate-in-fade">
            <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-1.5 ml-1">
              Email Tài Khoản
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                type="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full min-h-[50px] text-sm pl-11 pr-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                placeholder="vidu@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-1.5 ml-1">
              Mật Khẩu
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="w-full min-h-[50px] text-sm pl-11 pr-11 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                placeholder="Tối thiểu 6 ký tự..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[50px] mt-4 font-black text-sm md:text-base rounded-2xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin text-white" />
                <span>Đang xử lý...</span>
              </>
            ) : isLogin ? (
              <span>Đăng Nhập Vào Gia Đình</span>
            ) : (
              <span>Đăng Ký Tài Khoản Mới</span>
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
