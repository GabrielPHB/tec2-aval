export type RequesterType = "student" | "employee" | "professor" | "manager";

export class RequesterCategory {
  private static readonly RATES: Record<RequesterType, number> = {
    student: 9000,
    employee: 18000,
    professor: 25000,
    manager: 30000,
  };

  static getDailyAmount(type: RequesterType): number {
    return this.RATES[type] || 0;
  }
}