export class DateVO {
  private constructor(readonly value: string) {}

  static isValid(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }

  static create(value: string): DateVO {
    if (!this.isValid(value)) {
      throw new Error(`Invalid date format: ${value}`);
    }
    return new DateVO(value);
  }

  static calculateInclusiveDays(start: DateVO, end: DateVO): number {
    const [startYear, startMonth, startDay] = start.value.split("-").map(Number);
    const [endYear, endMonth, endDay] = end.value.split("-").map(Number);

    const timeA = Date.UTC(startYear, startMonth - 1, startDay);
    const timeB = Date.UTC(endYear, endMonth - 1, endDay);

    if (timeB < timeA) {
      throw new Error("returnDate cannot be before departureDate");
    }

    return Math.floor((timeB - timeA) / 86400000) + 1;
  }
}