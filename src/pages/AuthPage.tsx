import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { session, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Nếu thiết bị đã có phiên đăng nhập trước đó, tự động vào thẳng app
  useEffect(() => {
    if (session) {
      navigate('/', { replace: true });
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanAccount = account.trim();

    if (!cleanAccount) {
      setErrorMessage('Vui lòng nhập Email hoặc Tên tài khoản!');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 ký tự!');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // ĐĂNG NHẬP
        await signIn(cleanAccount, password);
        toast.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        // ĐĂNG KÝ
        await signUp(cleanAccount, password);
        toast.success('Đăng ký tài khoản thành công! Đang vào ứng dụng...');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Lỗi xác thực:', error);
      const msg = error.message || 'Có lỗi xảy ra, vui lòng thử lại!';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-y-auto bg-slate-900">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 relative z-10 animate-in-scale">
        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3 group">
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="w-18 h-18 md:w-20 md:h-20 rounded-2xl shadow-xl shadow-emerald-500/20 object-cover border-2 border-white ring-4 ring-emerald-500/10 transition-transform group-hover:scale-105 duration-200" 
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white">
              <Sparkles size={12} />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Quản Lý Thu Chi
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            {isLogin ? 'Đăng nhập để theo dõi và quản lý tài chính' : 'Đăng ký tài khoản mới để bắt đầu sử dụng'}
          </p>
        </div>

        {/* Tab chuyển đổi Đăng Nhập / Đăng Ký */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 cursor-pointer ${
              isLogin 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
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
              !isLogin 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs md:text-sm font-semibold flex items-start gap-2.5 animate-in-fade">
            <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-1.5 ml-1">
              Email hoặc Tên tài khoản
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="username"
                spellCheck={false}
                enterKeyHint="next"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
                className="w-full min-h-[50px] text-base pl-11 pr-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-slate-800"
                placeholder="ví dụ: admin@gmail.com hoặc baquan"
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
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                spellCheck={false}
                enterKeyHint={isLogin ? 'go' : 'next'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full min-h-[50px] text-base pl-11 pr-11 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-slate-800"
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

          {/* Ô xác nhận mật khẩu khi đăng ký */}
          {!isLogin && (
            <div className="animate-in-fade">
              <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-1.5 ml-1">
                Xác Nhận Mật Khẩu
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="new-password"
                  spellCheck={false}
                  enterKeyHint="go"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full min-h-[50px] text-base pl-11 pr-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-slate-800"
                  placeholder="Nhập lại mật khẩu..."
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[50px] mt-4 font-black text-sm md:text-base rounded-2xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin text-white" />
                <span>{isLogin ? 'Đang đăng nhập...' : 'Đang tạo tài khoản...'}</span>
              </>
            ) : isLogin ? (
              <span>Đăng Nhập</span>
            ) : (
              <span>Tạo Tài Khoản Mới</span>
            )}
          </button>
        </form>

        {/* Nút chuyển đổi nhanh dưới đáy */}
        <div className="mt-5 text-center">
          {isLogin ? (
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setErrorMessage(null);
                }}
                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </p>
          ) : (
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setErrorMessage(null);
                }}
                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                Đăng nhập ngay
              </button>
            </p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
          <CheckCircle2 size={15} className="text-emerald-500" />
          <span>Hỗ trợ mọi thiết bị: Điện thoại Android, iPhone & Máy tính</span>
        </div>
      </div>
    </div>
  );
}
