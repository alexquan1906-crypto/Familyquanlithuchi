import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart, 
  Calendar as CalendarIcon, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  BarChart3, 
  Zap,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleStart = () => {
    if (session) {
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: <Wallet className="text-emerald-500" size={26} />,
      title: 'Quản Lý Thu Chi Siêu Tốc',
      desc: 'Ghi lại mọi khoản thu nhập và chi tiêu chỉ trong vài giây. Hỗ trợ đa dạng danh mục thiết yếu như ăn uống, tiền điện nước, mua sắm, xăng xe, nhà ở.',
      badge: 'Nhanh chóng'
    },
    {
      icon: <PieChart className="text-sky-500" size={26} />,
      title: 'Biểu Đồ Phân Tích Đa Chiều',
      desc: 'Trực quan hóa cấu trúc chi tiêu qua biểu đồ tròn, biểu đồ cột so sánh và đường xu hướng dòng tiền tích lũy theo từng mốc thời gian.',
      badge: 'Trực quan'
    },
    {
      icon: <CalendarIcon className="text-amber-500" size={26} />,
      title: 'Lịch Âm Dương & Lễ Tiết',
      desc: 'Tích hợp tra cứu lịch âm, ngày tốt xấu, ngày hoàng đạo và ghi chú các sự kiện giỗ chạp, ngày rằm, mùng 1 truyền thống gia đình.',
      badge: 'Truyền thống'
    },
    {
      icon: <Smartphone className="text-purple-500" size={26} />,
      title: 'Tối Ưu 100% Cho Mobile',
      desc: 'Giao diện thân thiện, mượt mà trên điện thoại Android và iPhone. Hỗ trợ cài đặt PWA dùng như app native mà không tốn bộ nhớ máy.',
      badge: 'Mobile-first'
    },
    {
      icon: <BarChart3 className="text-rose-500" size={26} />,
      title: 'Bộ Lọc Thời Gian Linh Hoạt',
      desc: 'Dễ dàng lọc và xem báo cáo tài chính theo Hôm nay, Tuần này, Tháng này, Năm nay hoặc tự do chọn khoảng ngày tùy ý.',
      badge: 'Tiện lợi'
    },
    {
      icon: <ShieldCheck className="text-teal-500" size={26} />,
      title: 'Đồng Bộ Đám Mây An Toàn',
      desc: 'Dữ liệu được lưu trữ trực tuyến an toàn trên nền tảng Supabase Cloud. Tự động đồng bộ tức thì, không bao giờ lo mất dữ liệu khi đổi máy.',
      badge: 'Bảo mật'
    }
  ];

  const faqs = [
    {
      q: 'Ứng dụng Quản Lý Thu Chi này có mất phí không?',
      a: 'Hoàn toàn miễn phí 100%! Bạn có thể đăng ký tài khoản, ghi chép thu chi và sử dụng tất cả tính năng biểu đồ, lịch âm mà không phải trả bất kỳ khoản phí nào.'
    },
    {
      q: 'Tôi có thể sử dụng trên điện thoại Android và iPhone không?',
      a: 'Hoàn toàn được! Ứng dụng được thiết kế tối ưu riêng cho màn hình điện thoại. Bạn có thể mở trực tiếp trên trình duyệt Chrome, Safari hoặc bấm "Thêm vào màn hình chính" (PWA) để dùng như một ứng dụng độc lập mượt mà.'
    },
    {
      q: 'Dữ liệu của tôi có bị mất khi tôi đổi điện thoại mới không?',
      a: 'Không bao giờ! Dữ liệu của bạn được lưu an toàn trên máy chủ điện toán đám mây. Khi đổi điện thoại hoặc dùng trên máy tính, bạn chỉ cần đăng nhập tài khoản là toàn bộ lịch sử thu chi sẽ xuất hiện đầy đủ.'
    },
    {
      q: 'Tài khoản của tôi có bị giới hạn số lượng giao dịch không?',
      a: 'Không giới hạn! Bạn có thể thêm hàng nghìn khoản thu chi mỗi năm, tạo ghi chú lịch hẹn và xem thống kê dòng tiền mọi lúc mọi nơi.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Ambient glowing gradient background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-600/15 via-teal-600/10 to-transparent blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-1/3 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* HEADER / NAVIGATION */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <img 
                src="/logo.jpg" 
                alt="Logo Family Finance" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/20"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
            </div>
            <div>
              <span className="font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                Family Finance
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 block -mt-0.5">
                Sổ Thu Chi Thông Minh
              </span>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-300">
            <a href="#tinh-nang" className="hover:text-emerald-400 transition-colors">Tính Năng</a>
            <a href="#giao-dien" className="hover:text-emerald-400 transition-colors">Giao Diện</a>
            <a href="#mobile" className="hover:text-emerald-400 transition-colors">Mobile PWA</a>
            <a href="#hoi-dap" className="hover:text-emerald-400 transition-colors">Hỏi Đáp</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {session ? (
              <button
                onClick={() => navigate('/')}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Vào Sổ Thu Chi</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <span>Bắt Đầu Ngay</span>
                  <ArrowRight size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-6 animate-in-fade">
            <Sparkles size={14} className="text-emerald-400" />
            <span>Phiên Bản Mới 2026 · Quản Lý Dòng Tiền Toàn Diện</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-5">
            Kiểm Soát Tài Chính Gia Đình{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              Rõ Ràng & Bền Vững
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-400 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Ghi chép thu chi chỉ trong 3 giây, tự động vẽ biểu đồ phân tích tỷ trọng chi tiêu, kết hợp tra cứu lịch âm dương và đồng bộ mượt mà trên mọi điện thoại Android, iPhone.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto min-h-[52px] px-8 rounded-2xl font-black text-base text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-98 transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>{session ? 'Vào Ứng Dụng Ngay' : 'Tạo Tài Khoản & Bắt Đầu (Miễn Phí)'}</span>
              <ArrowRight size={18} />
            </button>
            <a
              href="#giao-dien"
              className="w-full sm:w-auto min-h-[52px] px-6 rounded-2xl font-bold text-sm text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <span>Xem Giao Diện Mẫu</span>
              <ChevronDown size={16} />
            </a>
          </div>

          {/* Highlights Mini Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>100% Miễn phí trọn đời</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Không quảng cáo phiền toái</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Bảo mật đám mây an toàn</span>
            </div>
          </div>
        </div>

        {/* HERO MOCKUP: Live Dashboard Preview Card */}
        <div id="giao-dien" className="mt-14 sm:mt-20 max-w-5xl mx-auto relative group">
          {/* Card glow background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500 pointer-events-none"></div>

          <div className="relative rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl p-5 sm:p-8 backdrop-blur-xl">
            {/* Top Bar of the Mockup */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="text-xs font-mono text-slate-500 ml-2 hidden sm:inline">family-finance-app.local · Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/20">
                  <Zap size={13} /> Đồng bộ thời gian thực
                </span>
              </div>
            </div>

            {/* Dashboard Mock Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Card 1: Balance */}
              <div className="bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-700/60 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Số Dư</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Wallet size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  +45.280.000 <span className="text-sm font-semibold text-emerald-400">₫</span>
                </div>
                <div className="text-xs font-medium text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp size={13} /> +14.8% so với tháng trước
                </div>
              </div>

              {/* Card 2: Income */}
              <div className="bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Thu Nhập</span>
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-sky-400 tracking-tight">
                  +62.500.000 <span className="text-sm font-semibold text-sky-300">₫</span>
                </div>
                <div className="text-xs font-medium text-slate-400 mt-2">
                  👨 Bố: 35.000.000 ₫ · 👩 Mẹ: 27.500.000 ₫
                </div>
              </div>

              {/* Card 3: Expense */}
              <div className="bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Chi Tiêu</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <TrendingDown size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
                  -17.220.000 <span className="text-sm font-semibold text-rose-300">₫</span>
                </div>
                <div className="text-xs font-medium text-slate-400 mt-2">
                  Tỷ lệ tích lũy đạt 72.4% thu nhập
                </div>
              </div>
            </div>

            {/* Split row: Category breakdown and recent list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Category bars */}
              <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/40">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3.5 flex items-center justify-between">
                  <span>Cơ Cấu Chi Tiêu Tháng Này</span>
                  <span className="text-slate-500 text-[11px] lowercase">tổng 6 danh mục</span>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-300">🍲 Ăn uống & thực phẩm</span>
                      <span className="font-bold text-white">7.500.000 ₫ (43%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[43%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-300">⚡ Tiền điện, nước & internet</span>
                      <span className="font-bold text-white">3.200.000 ₫ (18%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full w-[18%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-300">🛵 Xăng xe & đi lại</span>
                      <span className="font-bold text-white">2.100.000 ₫ (12%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[12%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent transactions */}
              <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/40">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Giao Dịch Gần Nhất</span>
                  <span className="text-emerald-400 text-xs font-semibold">Tự động cập nhật</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/70 border border-slate-700/50 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                        Thu
                      </div>
                      <div>
                        <div className="font-semibold text-white">Lương chuyển khoản tháng này</div>
                        <div className="text-[11px] text-slate-400">👨 Bố · Hôm nay</div>
                      </div>
                    </div>
                    <span className="font-bold text-sky-400">+25.000.000 ₫</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/70 border border-slate-700/50 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                        Chi
                      </div>
                      <div>
                        <div className="font-semibold text-white">Siêu thị thực phẩm tuần 4</div>
                        <div className="text-[11px] text-slate-400">Ăn uống · Hôm qua</div>
                      </div>
                    </div>
                    <span className="font-bold text-rose-400">-1.450.000 ₫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-4xl font-black text-emerald-400">3 Giây</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Để thêm một khoản thu/chi</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-sky-400">100%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Miễn phí & không quảng cáo</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-purple-400">Đa Nền Tảng</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Android, iPhone, Web, PC</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-amber-400">Âm Dương</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Tích hợp xem lịch tốt xấu</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="tinh-nang" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Mọi Công Cụ Bạn Cần Để Quản Lý Dòng Tiền Hoàn Hảo
          </p>
          <p className="text-sm sm:text-base text-slate-400 font-normal mt-3">
            Thiết kế khoa học, trực quan, loại bỏ các thủ tục phức tạp của các phần mềm kế toán cũ kỹ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div 
              key={index}
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-700/60">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MOBILE PWA SHOWCASE */}
      <section id="mobile" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
                <Smartphone size={14} />
                <span>Trải Nghiệm Mobile Chuẩn App</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug mb-4">
                Mở Trên Điện Thoại Android Hoặc iPhone Dễ Dàng
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-6">
                Không cần phải tải file cài đặt phức tạp. Chỉ cần mở link ứng dụng trên trình duyệt điện thoại, bấm menu và chọn <strong className="text-emerald-400">"Thêm vào màn hình chính" (Add to Home screen)</strong> là bạn đã có một icon ứng dụng riêng biệt mở toàn màn hình, mượt mà như app gốc!
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-300">Không bị phóng to giao diện bàn phím ngoài ý muốn</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-300">Thanh điều hướng dưới đáy (Bottom Navigation) thuận tiện thao tác một tay</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-300">Bộ chọn ngày native mở nhanh, không giật lag</span>
                </div>
              </div>

              <button
                onClick={handleStart}
                className="px-6 py-3 rounded-2xl font-bold text-sm bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-xl flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Trải Nghiệm Trên Điện Thoại Ngay</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Visual Phone Frame Simulation */}
            <div className="flex justify-center">
              <div className="w-full max-w-[280px] sm:max-w-[320px] bg-slate-950 rounded-[40px] p-3.5 border-4 border-slate-700 shadow-2xl shadow-emerald-500/10">
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3"></div>
                <div className="rounded-[28px] bg-slate-900 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Tổng quan</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Mobile PWA</span>
                  </div>
                  <div className="bg-emerald-600/20 rounded-xl p-3 border border-emerald-500/30">
                    <div className="text-[10px] text-slate-300 uppercase font-bold">Số Dư Khả Dụng</div>
                    <div className="text-lg font-black text-white mt-0.5">+45.280.000 ₫</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-lg bg-slate-800/80">
                      <div className="text-slate-400">Thu nhập</div>
                      <div className="font-bold text-sky-400">+62.5M</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80">
                      <div className="text-slate-400">Chi tiêu</div>
                      <div className="font-bold text-rose-400">-17.2M</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-around text-slate-500">
                    <span className="text-emerald-400 font-bold text-[10px]">🏠 Trang chủ</span>
                    <span className="text-[10px]">📒 Sổ thu</span>
                    <span className="text-[10px]">📊 Thống kê</span>
                    <span className="text-[10px]">📅 Lịch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="hoi-dap" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
            Giải Đáp Thắc Mắc
          </h2>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Những Câu Hỏi Thường Gặp
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 sm:px-6 sm:py-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-200 hover:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} 
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal border-t border-slate-800/60 pt-3 animate-in-fade">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION (CTA) BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 p-8 sm:p-12 text-center text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
              Bắt Đầu Quản Lý Thu Chi Ngay Hôm Nay
            </h2>
            <p className="text-sm sm:text-base text-emerald-50 font-normal mb-8">
              Chỉ mất 30 giây để tạo tài khoản và ghi nhận những khoản chi tiêu đầu tiên. Hoàn toàn miễn phí!
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-white text-slate-900 hover:bg-slate-100 shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{session ? 'Vào Ứng Dụng Ngay' : 'Đăng Ký Tài Khoản Miễn Phí'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-lg object-cover" />
            <span className="font-bold text-slate-400">Family Finance · Quản Lý Thu Chi</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#tinh-nang" className="hover:text-slate-400 transition-colors">Tính năng</a>
            <a href="#giao-dien" className="hover:text-slate-400 transition-colors">Giao diện</a>
            <a href="#hoi-dap" className="hover:text-slate-400 transition-colors">Hỏi đáp</a>
            <button onClick={() => navigate('/auth')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Đăng nhập
            </button>
          </div>

          <div>
            © 2026 Family Finance. Phát triển với React & Supabase.
          </div>
        </div>
      </footer>
    </div>
  );
}
