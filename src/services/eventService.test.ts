import { EventService } from "./EventService";
import { Event } from "../models/eventModel";
import { Person } from "../models/personModel";
import { Vote } from "../models/voteModel";

jest.mock("../models/eventModel");
jest.mock("../models/personModel");
jest.mock("../models/voteModel");

describe("EventService", () => {
  let eventService: EventService;

  beforeEach(() => {
    eventService = new EventService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new event", async () => {
    (Event.findOne as jest.Mock).mockResolvedValue(null);
    (Event.prototype.save as jest.Mock).mockResolvedValue({
      _id: "123",
      name: "Test Event",
      dates: ["2024-12-01"],
    });

    const event = await eventService.createEvent("Test Event", ["2024-12-01"]);
    expect(Event.findOne).toHaveBeenCalledWith({ name: "Test Event" });
    expect(Event.prototype.save).toHaveBeenCalled();
    expect(event).toEqual({
      _id: "123",
      name: "Test Event",
      dates: ["2024-12-01"],
    });
  });

  it("should throw an error if the event already exists", async () => {
    (Event.findOne as jest.Mock).mockResolvedValue({ name: "Test Event" });

    await expect(
      eventService.createEvent("Test Event", ["2024-12-01"])
    ).rejects.toThrow("Event with this name already exists");
  });

  it("should list all events", async () => {
    (Event.find as jest.Mock).mockResolvedValue([
      { _id: "123", name: "Test Event" },
    ]);

    const events = await eventService.listEvents();
    expect(Event.find).toHaveBeenCalledWith({}, { _id: 1, name: 1 });
    expect(events).toEqual([{ id: "123", name: "Test Event" }]);
  });

  it("should add a vote to an event", async () => {
    (Event.findById as jest.Mock).mockResolvedValue({
      _id: "66d40fc1a3917fa7f77e50d2",
      dates: ["2024-12-01"],
    });
    (Event.aggregate as jest.Mock).mockResolvedValue([
      {
        _id: "66d431a1ad7da98d53e3942f",
        name: "John",
        dates: ["2024-12-01"],
        votes: [],
      },
    ]);
    (Person.findOne as jest.Mock).mockResolvedValue({
      _id: "66d40fa4a3917fa7f77e50cd",
      name: "John",
    });
    (Vote.findOne as jest.Mock).mockResolvedValue(null);
    (Vote.prototype.save as jest.Mock).mockResolvedValue({});

    const event = await eventService.addVoteToEventById(
      "66d431a1ad7da98d53e3942f",
      "John",
      ["2024-12-01"]
    );
    expect(event).not.toBeNull();
    expect(Person.findOne).toHaveBeenCalledWith({ name: "John" });
    expect(Vote.prototype.save).toHaveBeenCalled();
  });

  it("should throw an error if event not found for adding vote", async () => {
    (Event.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      eventService.addVoteToEventById("invalidId", "John", ["2024-12-01"])
    ).rejects.toThrow("Event not found");
  });

  it("should get event results with suitable dates", async () => {
    const eventId = "66d40ff490541ea8ffd9193d";
    (Event.findById as jest.Mock).mockResolvedValue({ _id: eventId });
    (Event.aggregate as jest.Mock).mockResolvedValue([
      { _id: null, suitableDates: [{ date: "2024-12-01", people: ["John"] }] },
    ]);

    const results = await eventService.getResults(eventId);
    expect(results).toEqual({
      id: eventId,
      suitableDates: [{ date: "2024-12-01", people: ["John"] }],
    });
  });

  it("should return empty results if no suitable dates found", async () => {
    const eventId = "66d42b3b6018e73723ad63f6";
    (Event.findById as jest.Mock).mockResolvedValue({ _id: eventId });
    (Event.aggregate as jest.Mock).mockResolvedValue([]);

    const results = await eventService.getResults(eventId);
    expect(results).toEqual({ id: eventId, suitableDates: [] });
  });

  it("should throw an error if event not found when getting results", async () => {
    (Event.findById as jest.Mock).mockResolvedValue(null);

    await expect(eventService.getResults("invalidId")).rejects.toThrow(
      "Event not found"
    );
  });
});
