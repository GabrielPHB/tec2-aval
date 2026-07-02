import { DateVO } from "./DateVO.js";
import { RequesterCategory, RequesterType } from "./RequesterCategory.js";

export type TravelRequestProps = {
  requestId: string;
  requesterName: string;
  requesterType: RequesterType;
  destination: string;
  departureDate: string;
  returnDate: string;
  reason: string;
  transportCostInCents: number;
};

export class TravelRequest {
  private constructor(
    readonly props: TravelRequestProps,
    readonly travelDays: number,
    readonly dailyAmountInCents: number,
    readonly subtotalInCents: number,
    readonly totalAmountInCents: number,
    readonly status: "approved" | "pending-review" | "rejected",
    readonly errors: string[],
    readonly warnings: string[]
  ) {}

  static validateAndCreate(input: Partial<TravelRequestProps>): TravelRequest {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Basic presence validations
    const fields: Array<keyof TravelRequestProps> = [
      "requestId", "requesterName", "requesterType", 
      "destination", "departureDate", "returnDate"
    ];
    fields.forEach(field => {
      if (!input[field]) errors.push(`${field} is required`);
    });

    let travelDays = 0;
    let badStart = !input.departureDate || !DateVO.isValid(input.departureDate);
    let badEnd = !input.returnDate || !DateVO.isValid(input.returnDate);

    if (input.departureDate && !DateVO.isValid(input.departureDate)) {
      errors.push("departureDate must be a valid YYYY-MM-DD date");
    }
    if (input.returnDate && !DateVO.isValid(input.returnDate)) {
      errors.push("returnDate must be a valid YYYY-MM-DD date");
    }

    // 2. Logical date validations
    if (!badStart && !badEnd) {
      try {
        const start = DateVO.create(input.departureDate!);
        const end = DateVO.create(input.returnDate!);
        travelDays = DateVO.calculateInclusiveDays(start, end);
      } catch (err: any) {
        errors.push(err.message);
      }
    }

    // 3. Financial calculations
    const dailyAmountInCents = input.requesterType ? RequesterCategory.getDailyAmount(input.requesterType) : 0;
    const subtotalInCents = travelDays * dailyAmountInCents;
    const transportCost = input.transportCostInCents || 0;
    const totalAmountInCents = subtotalInCents + transportCost;

    // 4. Warnings
    if (travelDays > 5 && (!input.reason || input.reason.length < 30)) {
      warnings.push("long travel requests should include a detailed reason");
    }

    // 5. Status definition
    let status: "approved" | "pending-review" | "rejected" = "approved";
    if (errors.length > 0) {
      status = "rejected";
    } else if (travelDays > 5 || totalAmountInCents > 200000) {
      status = "pending-review";
    }

    return new TravelRequest(
      input as TravelRequestProps,
      travelDays,
      dailyAmountInCents,
      subtotalInCents,
      totalAmountInCents,
      status,
      errors,
      warnings
    );
  }
}