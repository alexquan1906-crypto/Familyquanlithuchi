import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Đăng ký thành công!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <Wallet size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 text-center">
            Quản Lý Thu Chi Gia Đình
          </h1>
          <p className="text-slate-500 text-center mt-2">
            {isLogin ? 'Đăng nhập để vào không gian của gia đình bạn' : 'Tạo tài khoản gia đình mới'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full min-h-[56px] text-lg px-4 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="nhadep@gmail.com"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full min-h-[56px] text-lg px-4 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full min-h-[56px] mt-4 font-bold text-lg rounded-2xl text-white transition-colors ${
              loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-600">
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-bold text-green-600 hover:underline"
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}
