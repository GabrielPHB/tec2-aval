import { TravelRequest } from "../domain/TravelRequest.js";

export interface TravelRequestRepository {
  save(travelRequest: TravelRequest): Promise<void>;
}