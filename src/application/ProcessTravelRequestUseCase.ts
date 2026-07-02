import { TravelRequest } from "../domain/TravelRequest.js";
import { TravelRequestRepository } from "./TravelRequestRepository.js";
import type { TravelRequestInput, TravelRequestOutput } from "../main.js";

export class ProcessTravelRequestUseCase {
  constructor(private readonly travelRequestRepository: TravelRequestRepository) {}

  async execute(input: TravelRequestInput): Promise<TravelRequestOutput> {
    // 1. Delegates business rules and calculations to the Domain Entity
    const travelRequest = TravelRequest.validateAndCreate(input);

    // 2. Persists the result using the repository interface (if no critical creation/validation errors that prevent mapping, or as per architecture needs)
    // For this activity, we always persist the processed analysis state
    await this.travelRequestRepository.save(travelRequest);

    // 3. Returns the clean output expected by the public contract
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
}