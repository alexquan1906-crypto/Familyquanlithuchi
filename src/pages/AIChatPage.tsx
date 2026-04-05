import { useState, useRef, useEffect } from 'react';
import { Send, UserCircle, Bot, Sparkles, Loader2 } from 'lucide-react';
import { askGemini, ChatMessage } from '../lib/gemini';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../lib/supabase';

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Chào Cô/Chú! Cháu là trợ lý ảo giúp quản lý chi tiêu gia đình. Cô/Chú cần cháu thống kê, vẽ bảng phân tích hay tư vấn gì hôm nay ạ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [financeContext, setFinanceContext] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  // Lấy bối cảnh dữ liệu (100 giao dịch gần nhất)
  useEffect(() => {
    async function fetchUserContext() {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          supabase.from('income').select('amount, person, date, note').order('date', { ascending: false }).limit(100),
          supabase.from('expense').select('amount, category, date, note').order('date', { ascending: false }).limit(100)
        ]);
        if (incomeRes.data || expenseRes.data) {
          const contextObj = {
            "Lưu ý cho AI": "Dưới đây là danh sách tối đa 100 giao dịch Thu/Chi gần nhất của gia đình cô chú. Khi lên bảng, hãy gom nhóm lại nếu cần thiết, tính tổng rõ ràng và format bằng Table.",
            "Thu_Nhap": incomeRes.data,
            "Chi_Tieu": expenseRes.data
          };
          setFinanceContext(JSON.stringify(contextObj));
        }
      } catch (e) {
        console.error("Lấy dữ liệu ngữ cảnh AI thất bại", e);
      }
    }
    fetchUserContext();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const QUICK_PROMPTS = [
    "Tổng hợp chi tiết khoản thu nhập và chi tiêu của tôi tháng này ra bảng nhé",
    "Phân tích thu nhập và thu chi để dự đoán xu hướng tài sản trong tháng tới",
    "Tôi đã tiêu những gì cho tháng vừa rồi"
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const newUserMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pssing the chat history WITHOUT the new message (it's added inside askGemini)
      const replyText = await askGemini(messages, text, financeContext);
      const newModelMsg: ChatMessage = { role: 'model', text: replyText };
      setMessages(prev => [...prev, newModelMsg]);
    } catch (error: any) {
      toast.error('Lỗi khi gọi AI: ' + error.message);
      // Remove latest user message if failed or show error message
      setMessages(prev => [...prev, { role: 'model', text: `❌ Lỗi: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100dvh-8.5rem)] md:h-[calc(100dvh-7rem)] flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          <Sparkles className="text-yellow-300" size={18} />
        </div>
        <div>
          <h2 className="text-base font-bold">Trợ Lý Ảo Tài Chính</h2>
          <p className="text-blue-100 text-[11px]">Đã kết nối với dữ liệu Thu Chi của Gia đình</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-slate-50 scrollbar-hide">
        {messages.map((msg, idx) => {
          const lines = msg.text.split('\n');
          const mainText = lines.filter(l => !l.trim().startsWith('[SUGGESTION]')).join('\n');
          const suggestions = lines.filter(l => l.trim().startsWith('[SUGGESTION]')).map(l => l.replace('[SUGGESTION]', '').trim());

          return (
            <div key={idx} className="flex flex-col gap-2">
              <div className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                  {msg.role === 'user' ? <UserCircle size={28} /> : <Bot size={28} />}
                </div>

                <div className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-2xl text-sm md:text-base ${msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  ) : (
                    <div className="
                       [&_p]:mb-3 [&_p]:leading-relaxed
                       [&_strong]:text-slate-900 [&_strong]:font-bold
                       [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-sm [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:shadow-sm [&_table]:border-hidden
                       [&_th]:bg-blue-600 [&_th]:text-white [&_th]:p-3 [&_th]:border [&_th]:border-slate-200 [&_th]:font-bold [&_th]:text-left
                       [&_td]:p-3 [&_td]:border [&_td]:border-slate-200 
                       [&_tr:nth-child(even)]:bg-blue-50/50
                       [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
                       [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1
                       [&_li]:text-slate-700
                       [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-blue-800 [&_h3]:mt-6 [&_h3]:mb-3
                       [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-slate-800 [&_h4]:mt-4 [&_h4]:mb-2
                    ">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {mainText}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && msg.role === 'model' && (
                <div className="ml-14 md:ml-16 mt-1 mb-2 flex flex-col gap-2 items-start">
                  <p className="text-xs text-slate-500 font-medium">✨ Cháu có thể giúp gì thêm cho cô chú:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(s)}
                        className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-xl text-sm transition-colors text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 md:gap-4 flex-row">
            <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Bot size={28} />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
              <Loader2 className="animate-spin text-blue-600" size={20} />
              <span className="text-slate-500">Đang phân tích dữ liệu và vẽ bảng...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {/* Input Area */}
      <div className="px-3 py-2 bg-white border-t border-slate-200">

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="shrink-0 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex gap-2 md:gap-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Hỏi trợ lý điều gì đó..."
            className="flex-1 min-h-[48px] px-4 text-sm border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-[48px] h-[48px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white rounded-full flex items-center justify-center transition-colors shadow-sm shrink-0"
          >
            <Send size={20} />
            <span className="hidden md:inline font-bold text-lg">Gửi</span>
          </button>
        </form>
      </div>

    </div>
  );
}
