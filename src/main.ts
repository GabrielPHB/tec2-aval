import { TravelRequest } from "./domain/TravelRequest.js";
import { TravelRequestDatabaseRepository } from "./infra/TravelRequestDatabaseRepository.js";

// 1. Exporting the public types required by the contract and tests
export type RequesterType = "student" | "employee" | "professor" | "manager";
export type TravelRequestStatus = "approved" | "pending-review" | "rejected";

export type TravelRequestInput = {
  requestId: string;
  requesterName: string;
  requesterType: RequesterType;
  destination: string;
  departureDate: string;
  returnDate: string;
  reason: string;
  transportCostInCents: number;
};

export type TravelRequestOutput = {
  requestId: string;
  status: TravelRequestStatus;
  travelDays: number;
  dailyAmountInCents: number;
  subtotalInCents: number;
  totalAmountInCents: number;
  errors: string[];
  warnings: string[];
};

// 2. Instantiating infrastructure
const travelRequestRepository = new TravelRequestDatabaseRepository();

// 3. Main public function (The entry point for the professor's tests)
export function processTravelRequest(input: TravelRequestInput): TravelRequestOutput {
  // Delegates business rules and calculations to the Domain Entity synchronously
  const travelRequest = TravelRequest.validateAndCreate(input);

  // Background persistence to prevent blocking the required synchronous return contract
  travelRequestRepository.save(travelRequest).catch((err) => {
    console.error("Failed to persist travel request to database:", err);
  });

  return {
    requestId: travelRequest.props.requestId || input.requestId,
    status: travelRequest.status,
    travelDays: travelRequest.travelDays,
    dailyAmountInCents: travelRequest.dailyAmountInCents,
    subtotalInCents: travelRequest.subtotalInCents,
    totalAmountInCents: travelRequest.totalAmountInCents,
    errors: travelRequest.errors,
    warnings: travelRequest.warnings,
  };
}