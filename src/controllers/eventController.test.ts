import { EventController } from "./EventController";
import { IEventService } from "../services/interfaces/IEventService";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
describe("EventController", () => {
  let eventController: EventController;
  let mockEventService: jest.Mocked<IEventService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockEventService = {
      createEvent: jest.fn(),
      listEvents: jest.fn(),
      getEventWithVotes: jest.fn(),
      addVoteToEventById: jest.fn(),
      getResults: jest.fn(),
    } as jest.Mocked<IEventService>;

    eventController = new EventController(mockEventService);

    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should create a new event and return the event ID", async () => {
    mockEventService.createEvent.mockResolvedValue({ _id: "123" } as any);

    req.body = { name: "Test Event", dates: ["2024-12-01"] };
    await eventController.createEvent(req as Request, res as Response, next);

    expect(mockEventService.createEvent).toHaveBeenCalledWith("Test Event", [
      "2024-12-01",
    ]);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: "123" });
  });

  it("should handle errors in createEvent and call next with the error", async () => {
    const error = new Error("Event already exists");
    mockEventService.createEvent.mockRejectedValue(error);

    await eventController.createEvent(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should list events and return them", async () => {
    const events = [
      {
        id: "66d40fc1a3917fa7f77e50d2" as any as mongoose.Types.ObjectId,
        name: "Test Event",
      },
    ];
    mockEventService.listEvents.mockResolvedValue(events);

    await eventController.listEvents(req as Request, res as Response, next);

    expect(mockEventService.listEvents).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ events });
  });

  it("should handle errors in listEvents and call next with the error", async () => {
    const error = new Error("Failed to list events");
    mockEventService.listEvents.mockRejectedValue(error);

    await eventController.listEvents(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should show an event by ID", async () => {
    const event = { id: "123", name: "Test Event", votes: [] };
    mockEventService.getEventWithVotes.mockResolvedValue(event as any);

    req.params = { id: "123" };
    await eventController.showEvent(req as Request, res as Response, next);

    expect(mockEventService.getEventWithVotes).toHaveBeenCalledWith("123");
    expect(res.json).toHaveBeenCalledWith(event);
  });

  it("should return 404 if event is not found in showEvent", async () => {
    mockEventService.getEventWithVotes.mockResolvedValue(null);

    req.params = { id: "123" };
    await eventController.showEvent(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Event not found" });
  });

  it("should handle errors in showEvent and call next with the error", async () => {
    const error = new Error("Failed to retrieve event");
    mockEventService.getEventWithVotes.mockRejectedValue(error);

    req.params = { id: "123" };
    await eventController.showEvent(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should add a vote to an event", async () => {
    const event = { id: "123", name: "Test Event", votes: [] };
    mockEventService.addVoteToEventById.mockResolvedValue(event as any);

    req.params = { id: "123" };
    req.body = { name: "John", votes: ["2024-12-01"] };
    await eventController.addVote(req as Request, res as Response, next);

    expect(mockEventService.addVoteToEventById).toHaveBeenCalledWith(
      "123",
      "John",
      ["2024-12-01"]
    );
    expect(res.json).toHaveBeenCalledWith(event);
  });

  it("should handle errors in addVote and call next with the error", async () => {
    const error = new Error("Failed to add vote");
    mockEventService.addVoteToEventById.mockRejectedValue(error);

    req.params = { id: "123" };
    await eventController.addVote(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should get results for an event", async () => {
    const results = { id: "66d40f49a3917fa7f77e50a9", suitableDates: [] };
    mockEventService.getResults.mockResolvedValue(results as any);

    req.params = { id: "66d40f49a3917fa7f77e50a9" };
    await eventController.getResults(req as Request, res as Response, next);

    expect(mockEventService.getResults).toHaveBeenCalledWith(
      "66d40f49a3917fa7f77e50a9"
    );
    expect(res.json).toHaveBeenCalledWith(results);
  });

  it("should handle errors in getResults and call next with the error", async () => {
    const error = new Error("Failed to get results");
    mockEventService.getResults.mockRejectedValue(error);

    req.params = { id: "123" };
    await eventController.getResults(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
