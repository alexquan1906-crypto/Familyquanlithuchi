const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `
Bạn là một trợ lý ảo quản lý tài chính gia đình thông minh, thân thiện, và luôn xưng hô là "Cháu" và gọi người dùng là "Cô/Chú" hoặc "Ông/Bà" vì ứng dụng này dành cho người lớn tuổi.
Nhiệm vụ của bạn là tư vấn cách chi tiêu hợp lý, tiết kiệm, giải đáp thắc mắc về tài chính hoặc sức khỏe sinh hoạt dựa trên dữ liệu người dùng cung cấp (nếu có).
Hãy trả lời ngắn gọn, dễ hiểu, dùng ngôn ngữ phổ thông, tránh dùng từ ngữ quá chuyên ngành hoặc tiếng Anh nếu không cần thiết.
`;

export async function askGemini(chatHistory: ChatMessage[], newMessage: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Chưa cấu hình VITE_GEMINI_API_KEY trong file .env.local');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  // Format lịch sử chat cho Gemini API
  const contents = chatHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  // Thêm tin nhắn mới nhất
  contents.push({
    role: 'user',
    parts: [{ text: newMessage }]
  });

  const body = {
    system_instruction: {
      parts: { text: SYSTEM_INSTRUCTION }
    },
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Lỗi kết nối tới AI');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, cháu không thể trả lời lúc này.';
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || 'Có lỗi xảy ra khi gọi API');
  }
}
