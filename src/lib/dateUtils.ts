import { Lunar, Solar } from 'lunar-javascript';

export type FilterPeriodMode = 
  | 'this_solar_month' 
  | 'last_solar_month'
  | 'this_lunar_month' 
  | 'last_lunar_month'
  | 'this_week' 
  | 'last_week'
  | 'this_quarter' 
  | 'this_half_year' 
  | 'this_year' 
  | 'custom'
  | 'specific_solar_month'
  | 'specific_lunar_month';

/**
 * Get start and end date (in ISO string) for a given predefined period
 */
export function getDateRangeForPeriod(mode: FilterPeriodMode, specificYear?: number, specificMonth?: number): { start: string, end: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const toIso = (d: Date) => d.toISOString();
  
  // Set start to 00:00:00 and end to 23:59:59
  const getBounds = (startD: Date, endD: Date) => {
    startD.setHours(0, 0, 0, 0);
    endD.setHours(23, 59, 59, 999);
    return { start: toIso(startD), end: toIso(endD) };
  };

  switch (mode) {
    case 'this_solar_month': {
      return getBounds(new Date(year, month, 1), new Date(year, month + 1, 0));
    }
    case 'last_solar_month': {
      return getBounds(new Date(year, month - 1, 1), new Date(year, month, 0));
    }
    case 'specific_solar_month': {
      if (!specificYear || specificMonth === undefined) return getBounds(new Date(year, month, 1), new Date(year, month + 1, 0));
      return getBounds(new Date(specificYear, specificMonth - 1, 1), new Date(specificYear, specificMonth, 0));
    }
    case 'this_lunar_month': {
      const todaySolar = Solar.fromDate(now);
      const todayLunar = Lunar.fromSolar(todaySolar);
      const lYear = todayLunar.getYear();
      const lMonth = todayLunar.getMonth(); // negative if leap month
      
      const lunarStart = Lunar.fromYmd(lYear, lMonth, 1);
      
      let loopL = lunarStart;
      let daysCount = 0;
      while(loopL.getMonth() === lMonth && daysCount < 31) {
          loopL = loopL.next(1);
          daysCount++;
      }
      
      const solarStart = Lunar.fromYmd(lYear, lMonth, 1).getSolar();
      const solarEnd = Lunar.fromYmd(lYear, lMonth, daysCount).getSolar();
      return getBounds(new Date(solarStart.getYear(), solarStart.getMonth() - 1, solarStart.getDay()), new Date(solarEnd.getYear(), solarEnd.getMonth() - 1, solarEnd.getDay()));
    }
    case 'specific_lunar_month': {
        if (!specificYear || specificMonth === undefined) return getBounds(new Date(year, month, 1), new Date(year, month + 1, 0));
        
        let daysCount = 0;
        let loopL = Lunar.fromYmd(specificYear, specificMonth, 1);
        while(loopL.getMonth() === specificMonth && daysCount < 31) {
            loopL = loopL.next(1);
            daysCount++;
        }
        
        const solarStart = Lunar.fromYmd(specificYear, specificMonth, 1).getSolar();
        const solarEnd = Lunar.fromYmd(specificYear, specificMonth, daysCount).getSolar();
        return getBounds(new Date(solarStart.getYear(), solarStart.getMonth() - 1, solarStart.getDay()), new Date(solarEnd.getYear(), solarEnd.getMonth() - 1, solarEnd.getDay()));
    }
    case 'this_week': {
      const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Monday start
      const start = new Date(now.setDate(diff));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return getBounds(start, end);
    }
    case 'this_quarter': {
      const quarter = Math.floor(month / 3);
      const start = new Date(year, quarter * 3, 1);
      const end = new Date(year, quarter * 3 + 3, 0);
      return getBounds(start, end);
    }
    case 'this_half_year': {
      const isSecondHalf = month >= 6;
      const start = new Date(year, isSecondHalf ? 6 : 0, 1);
      const end = new Date(year, isSecondHalf ? 12 : 6, 0);
      return getBounds(start, end);
    }
    case 'this_year': {
      return getBounds(new Date(year, 0, 1), new Date(year, 11, 31));
    }
    default:
      return getBounds(new Date(year, month, 1), new Date(year, month + 1, 0));
  }
}
