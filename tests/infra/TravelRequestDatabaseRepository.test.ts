import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { TravelRequestDatabaseRepository } from "../../src/infra/TravelRequestDatabaseRepository.js";
import { TravelRequest } from "../../src/domain/TravelRequest.js";
import { pool } from "../../src/infra/DatabaseConnection.js";

describe("TravelRequestDatabaseRepository Integration", () => {
  // Optional cleanup: clear test rows after running if needed, 
  // or rely on ON CONFLICT updates during continuous test execution
  afterAll(async () => {
    // Close the pool connection so Vitest can exit cleanly
    await pool.end();
  });

  it("should successfully persist or update a travel request in the database", async () => {
    const repository = new TravelRequestDatabaseRepository();
    
    const travelRequest = TravelRequest.validateAndCreate({
      requestId: "test-db-id-999",
      requesterName: "Professor Test",
      requesterType: "professor",
      destination: "State University",
      departureDate: "2026-08-10",
      returnDate: "2026-08-15",
      reason: "Institutional audit and campus evaluation process",
      transportCostInCents: 15000,
    });

    // Act & Assert
    // If the database query is wrong or fields mismatch, this promise will reject and fail the test
    await expect(repository.save(travelRequest)).resolves.not.toThrow();
  });
});