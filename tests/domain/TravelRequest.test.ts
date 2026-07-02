import { describe, it, expect } from "vitest";
import { TravelRequest } from "../../src/domain/TravelRequest.js";

describe("TravelRequest Domain Entity", () => {
  it("should create a valid travel request and calculate correct values for a student", () => {
    const request = TravelRequest.validateAndCreate({
      requestId: "req-123",
      requesterName: "John Doe",
      requesterType: "student",
      destination: "New York",
      departureDate: "2026-07-01",
      returnDate: "2026-07-03", // 3 days inclusive
      reason: "Academic Conference Attendance",
      transportCostInCents: 5000,
    });

    expect(request.status).toBe("approved");
    expect(request.travelDays).toBe(3);
    expect(request.dailyAmountInCents).toBe(9000);
    expect(request.subtotalInCents).toBe(27000);
    expect(request.totalAmountInCents).toBe(32000);
    expect(request.errors).toHaveLength(0);
  });

  it("should reject and accumulate errors when required fields are missing", () => {
    const request = TravelRequest.validateAndCreate({
      requestId: "",
      requesterName: "",
    });

    expect(request.status).toBe("rejected");
    expect(request.errors).toContain("requestId is required");
    expect(request.errors).toContain("requesterName is required");
  });

  it("should return pending-review if total amount exceeds R$ 2.000,00", () => {
    const request = TravelRequest.validateAndCreate({
      requestId: "req-124",
      requesterName: "Jane Doe",
      requesterType: "manager", // 30000 per day
      destination: "London",
      departureDate: "2026-07-01",
      returnDate: "2026-07-07", // 7 days -> subtotal = 210000 (> 200000)
      reason: "Executive management meetings and planning",
      transportCostInCents: 0,
    });

    expect(request.status).toBe("pending-review");
  });

  it("should add a warning if travel is long and reason is too short", () => {
    const request = TravelRequest.validateAndCreate({
      requestId: "req-125",
      requesterName: "Alice Smith",
      requesterType: "professor",
      destination: "Paris",
      departureDate: "2026-07-01",
      returnDate: "2026-07-07", // 7 days
      reason: "Short reason", // < 30 chars
      transportCostInCents: 1000,
    });

    expect(request.warnings).toContain("long travel requests should include a detailed reason");
  });
});