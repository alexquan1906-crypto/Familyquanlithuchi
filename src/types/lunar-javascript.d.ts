declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }
  export class Lunar {
    static fromSolar(solar: Solar): Lunar;
    static fromYmd(lunarYear: number, lunarMonth: number, lunarDay: number): Lunar;
    
    getDay(): number;
    getMonth(): number;
    getYear(): number;
    getYearInGanZhi(): string;
    getYearShengXiao(): string;
    
    next(days: number): Lunar;
    getSolar(): Solar;
    getMonthInMag(): number;
  }
}
