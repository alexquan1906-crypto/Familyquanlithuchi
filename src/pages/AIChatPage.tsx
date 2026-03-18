import { useState, useRef, useEffect } from 'react';
import { Send, UserCircle, Bot, Sparkles, Loader2 } from 'lucide-react';
import { askGemini, ChatMessage } from '../lib/gemini';
import { toast } from 'sonner';

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Chào Cô/Chú! Cháu là trợ lý ảo giúp quản lý chi tiêu gia đình. Cô/Chú cần cháu tư vấn hay ghi chép gì hôm nay ạ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const QUICK_PROMPTS = [
    "Tháng này nấu ăn hết 6 triệu có nhiều không?",
    "Làm sao để tiết kiệm tiền điện mùa hè?",
    "Nhắc tôi đi khám sức khỏe định kỳ"
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const newUserMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pssing the chat history WITHOUT the new message (it's added inside askGemini)
      const replyText = await askGemini(messages, text);
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
          <p className="text-blue-100 text-[11px]">Sẵn sàng trả lời mọi câu hỏi</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-slate-50 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
              msg.role === 'user' ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600'
            }`}>
              {msg.role === 'user' ? <UserCircle size={28} /> : <Bot size={28} />}
            </div>
            
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 md:gap-4 flex-row">
            <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Bot size={28} />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="animate-spin text-blue-600" size={20} />
              <span className="text-slate-500">Đang suy nghĩ...</span>
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
