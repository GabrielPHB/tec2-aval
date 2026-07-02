import { TravelRequestRepository } from "../application/TravelRequestRepository.js";
import { TravelRequest } from "../domain/TravelRequest.js";
import { pool } from "./DatabaseConnection.js";

export class TravelRequestDatabaseRepository implements TravelRequestRepository {
  async save(travelRequest: TravelRequest): Promise<void> {
    const query = `
      INSERT INTO travel_requests (
        id, requester_name, requester_type, destination, departure_date, 
        return_date, reason, status, travel_days, daily_amount_in_cents, 
        subtotal_in_cents, transport_cost_in_cents, total_amount_in_cents, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO UPDATE SET
        requester_name = EXCLUDED.requester_name,
        requester_type = EXCLUDED.requester_type,
        destination = EXCLUDED.destination,
        departure_date = EXCLUDED.departure_date,
        return_date = EXCLUDED.return_date,
        reason = EXCLUDED.reason,
        status = EXCLUDED.status,
        travel_days = EXCLUDED.travel_days,
        daily_amount_in_cents = EXCLUDED.daily_amount_in_cents,
        subtotal_in_cents = EXCLUDED.subtotal_in_cents,
        transport_cost_in_cents = EXCLUDED.transport_cost_in_cents,
        total_amount_in_cents = EXCLUDED.total_amount_in_cents,
        created_at = EXCLUDED.created_at;
    `;

    const values = [
      travelRequest.props.requestId,
      travelRequest.props.requesterName,
      travelRequest.props.requesterType,
      travelRequest.props.destination,
      travelRequest.props.departureDate,
      travelRequest.props.returnDate,
      travelRequest.props.reason || "",
      travelRequest.status,
      travelRequest.travelDays,
      travelRequest.dailyAmountInCents,
      travelRequest.subtotalInCents,
      travelRequest.props.transportCostInCents || 0,
      travelRequest.totalAmountInCents,
      new Date().toISOString()
    ];

    await pool.query(query, values);
  }
}