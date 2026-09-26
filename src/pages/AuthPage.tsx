import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, Eye, EyeOff, Sparkles, Users, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { session, signInOrSignUp } = useAuth();
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
    setLoading(true);

    const cleanAccount = account.trim();

    if (!cleanAccount) {
      setErrorMessage('Vui lòng nhập tên tài khoản hoặc email gia đình!');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 ký tự!');
      setLoading(false);
      return;
    }

    try {
      const { isNewAccount } = await signInOrSignUp(cleanAccount, password);
      
      if (isNewAccount) {
        toast.success('Đã kích hoạt tài khoản gia đình thành công! Cả nhà có thể dùng thông tin này để đăng nhập.');
      } else {
        toast.success('Đăng nhập thành công! Đang vào không gian gia đình...');
      }
      navigate('/');
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
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            Không gian tài chính & sổ thu chi dùng chung cho cả gia đình
          </p>
        </div>

        {/* Thông báo hướng dẫn tài khoản dùng chung */}
        <div className="mb-5 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
          <Users size={18} className="text-emerald-600 shrink-0" />
          <span>Tất cả các thành viên (Bố, Mẹ, Con cái) chỉ cần nhập cùng Tên tài khoản & Mật khẩu này trên điện thoại để vào chung.</span>
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
              Tên Tài Khoản Hoặc Email
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
                className="w-full min-h-[50px] text-sm pl-11 pr-4 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                placeholder="Ví dụ: giadinh hoặc baquan@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider mb-1.5 ml-1">
              Mật Khẩu Dùng Chung
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
                className="w-full min-h-[50px] text-sm pl-11 pr-11 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                placeholder="Nhập tối thiểu 6 ký tự..."
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
                <span>Đang kiểm tra & vào app...</span>
              </>
            ) : (
              <span>Vào Không Gian Gia Đình</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Đồng bộ tức thời trên tất cả điện thoại của gia đình</span>
        </div>
      </div>
    </div>
  );
}
