const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const BASE_SYSTEM_INSTRUCTION = `Bạn là một trợ lý ảo quản lý tài chính gia đình thông minh, thân thiện. 
Luôn xưng hô là "Cháu" và gọi người dùng là "Cô/Chú" hoặc "Ông/Bà".
HÔM NAY LÀ: ${new Date().toLocaleDateString('vi-VN')}
LUẬT CƠ BẢN BẮT BUỘC (NẾU VI PHẠM SẼ BỊ PHẠT):
1. TUYỆT ĐỐI KHÔNG BỊA ĐẶT SỐ LIỆU (NO HALLUCINATION): Chỉ sử dụng dữ liệu CÓ THẬT được cung cấp trong phần [DỮ LIỆU TÀI CHÍNH THỰC TẾ]. Nếu nhận biểu đồ rỗng ([]), hoặc không có giao dịch nào khớp với "Tháng này", HÃY TRẢ LỜI CHÍNH XÁC LÀ: "Cháu không tìm thấy giao dịch nào", tuyệt đối không tự bịa ra số tiền ảo!
2. XUẤT DỮ LIỆU ĐÚNG TRỌNG TÂM: Mặc định luôn phân tích các số liệu thuộc "Tháng Này" (so với ngày hôm nay) trừ khi người dùng chỉ định tháng khác. Không lan man.
3. TRÌNH BÀY ĐẸP: Ưu tiên dùng Markdown để vẽ BẢNG (Table) thay vì liệt kê. Dùng chữ IN ĐẬM (Bold) cho tất cả các con số, tổng tiền.
4. CÂU HỎI LÀM RÕ DẠNG VĂN BẢN (SELECT): Bạn PHẢI tạo ra 2-3 câu gợi ý đi kèm ở cuối.
   - MỖI CÂU GỢI Ý PHẢI NẰM CÁCH NHAU TRÊN 1 DÒNG MỚI và BẮT ĐẦU BẰNG TIỀN TỐ "[SUGGESTION]" 
     (Chỉ dùng cho gợi ý, không dùng cho nội dung bình thường).
     Ví dụ:
     [SUGGESTION] Thống kê chi tiết riêng mục ăn uống tháng này
     [SUGGESTION] Cho chú xem dữ liệu thu chi tháng trước`;

export async function askGemini(chatHistory: ChatMessage[], newMessage: string, contextData: string = ""): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Chưa cấu hình VITE_GEMINI_API_KEY trong file .env.local');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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

  const finalSystemInstruction = contextData 
    ? `${BASE_SYSTEM_INSTRUCTION}\n\n[DỮ LIỆU TÀI CHÍNH THỰC TẾ CỦA GIA ĐÌNH ĐỂ AI THAM KHẢO VÀ PHÂN TÍCH]\n${contextData}`
    : BASE_SYSTEM_INSTRUCTION;

  const body = {
    systemInstruction: {
      parts: [{ text: finalSystemInstruction }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2000,
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
