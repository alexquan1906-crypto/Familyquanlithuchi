import { Lunar, Solar } from 'lunar-javascript';

export function getLunarDateMock(d: Date): { day: number; month: number; year: number; canChi: string } {
  const solar = Solar.fromDate(d);
  const lunar = Lunar.fromSolar(solar);
  
  const lunarYear = lunar.getYear();
  
  const can = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
  const chi = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
  
  const canStr = can[lunarYear % 10];
  const chiStr = chi[lunarYear % 12];

  return {
    day: lunar.getDay(),
    month: Math.abs(lunar.getMonth()), // handle leap months gracefully 
    year: lunarYear,
    canChi: `${canStr} ${chiStr}`
  };
}
