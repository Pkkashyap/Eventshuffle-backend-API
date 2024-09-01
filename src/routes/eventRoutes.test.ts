import request from "supertest";
import express from "express";
import { createEventRouter } from "./EventRoutes";
import { EventService } from "../services/EventService";
import mongoose from "mongoose";
// import app from "../app";
jest.mock("../services/EventService");

const app = express();

describe("Event Routes", () => {
  let mockEventService: jest.Mocked<EventService>;
  mockEventService = new EventService() as jest.Mocked<EventService>;
  app.use(express.json());
  app.use("/api/v1/event", createEventRouter(mockEventService));

  it("POST /api/v1/event should create a new event", async () => {
    mockEventService.createEvent.mockResolvedValue({ _id: "123" } as any);

    const response = await request(app)
      .post("/api/v1/event")
      .send({ name: "Test Event", dates: ["2024-12-01"] });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: "123" });
    expect(mockEventService.createEvent).toHaveBeenCalledWith("Test Event", [
      "2024-12-01",
    ]);
  });

  it("GET /api/v1/event/list should return a list of events", async () => {
    const events = [
      {
        id: "66d40fc1a3917fa7f77e50d2" as any as mongoose.Types.ObjectId,
        name: "Test Event",
      },
    ];
    mockEventService.listEvents.mockResolvedValue(events);

    const response = await request(app).get("/api/v1/event/list");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ events });
    expect(mockEventService.listEvents).toHaveBeenCalled();
  });

  it("GET /api/v1/event/:id should return an event", async () => {
    const event = {
      id: "66d40fc1a3917fa7f77e50d2",
      name: "Test Event",
      votes: [],
    };
    mockEventService.getEventWithVotes.mockResolvedValue(event as any);

    const response = await request(app).get(
      "/api/v1/event/66d40fc1a3917fa7f77e50d2"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(event);
    expect(mockEventService.getEventWithVotes).toHaveBeenCalledWith(
      "66d40fc1a3917fa7f77e50d2"
    );
  });

  it("GET /api/v1/event/:id should return 404 if event not found", async () => {
    mockEventService.getEventWithVotes.mockResolvedValue(null);

    const response = await request(app).get(
      "/api/v1/event/66d40fc1a3917fa7f77e50d2"
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Event not found" });
  });

  it("POST /api/v1/event/:id/vote should add a vote", async () => {
    const event = {
      id: "66d40fc1a3917fa7f77e50d2",
      name: "Test Event",
      votes: [],
    };
    mockEventService.addVoteToEventById.mockResolvedValue(event as any);

    const response = await request(app)
      .post("/api/v1/event/66d40fc1a3917fa7f77e50d2/vote")
      .send({ name: "John", votes: ["2024-12-01"] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(event);
    expect(mockEventService.addVoteToEventById).toHaveBeenCalledWith(
      "66d40fc1a3917fa7f77e50d2",
      "John",
      ["2024-12-01"]
    );
  });

  it("GET /api/v1/event/:id/results should return event results", async () => {
    const results = { id: "66d40fc1a3917fa7f77e50d2", suitableDates: [] };
    mockEventService.getResults.mockResolvedValue(results as any);

    const response = await request(app).get(
      "/api/v1/event/66d40fc1a3917fa7f77e50d2/results"
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(results);
    expect(mockEventService.getResults).toHaveBeenCalledWith(
      "66d40fc1a3917fa7f77e50d2"
    );
  });

  it("should handle errors and call the error handler middleware", async () => {
    const error = new Error("Internal Server Error");
    mockEventService.createEvent.mockRejectedValue(error);

    const response = await request(app)
      .post("/api/v1/event")
      .send({ name: "Test Event", dates: ["2024-12-01"] });

    expect(response.status).toBe(500);
  });
});
