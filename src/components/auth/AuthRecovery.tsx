import { clearStoredAuthSession } from '../../lib/supabase';

export default function AuthRecovery({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-center text-white">
      <p>{message}</p>
      <button
        type="button"
        className="rounded-xl bg-emerald-600 px-5 py-2 font-bold"
        onClick={() => window.location.reload()}
      >
        Thử lại
      </button>
      <button
        type="button"
        className="text-sm font-semibold text-emerald-300 underline"
        onClick={() => {
          clearStoredAuthSession();
          window.location.assign('/auth');
        }}
      >
        Đăng nhập lại
      </button>
    </div>
  );
}
