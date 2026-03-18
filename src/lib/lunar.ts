/**
 * Mock file để chuyển đổi ngày Âm Lịch giả lập
 * Để chính xác cần sử dụng một thư viện convert dương <-> âm uy tín (như lunar-javascript)
 * Ở đây dùng logic đơn giản (ngày âm thường trễ hơn dương khoảng 30-45 ngày tùy năm nhuận).
 */

export function getLunarDateMock(d: Date): { day: number; month: number; year: number; canChi: string } {
  // Lấy năm hiện tại
  const year = d.getFullYear();
  
  // Tạm tính số ngày khác biệt tương đối (Không chính xác, chỉ dùng cho frontend Demo)
  const offset = 30; 
  const lunarTime = d.getTime() - offset * 24 * 60 * 60 * 1000;
  const lunar = new Date(lunarTime);
  
  const can = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
  const chi = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
  
  const canStr = can[year % 10];
  const chiStr = chi[year % 12];

  return {
    day: lunar.getDate(),
    month: lunar.getMonth() + 1,
    year: lunar.getFullYear(),
    canChi: `${canStr} ${chiStr}`
  };
}
