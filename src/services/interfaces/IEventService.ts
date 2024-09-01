import { IEvent } from "../../models/eventModel";
import mongoose from "mongoose";

export interface IEventService {
  createEvent(name: string, dates: string[]): Promise<IEvent>;
  listEvents(): Promise<{ id: mongoose.Types.ObjectId; name: String }[]>;
  addVoteToEventById(eventId: string, personName: string, votes: string[]);
  getResults(eventId: string): Promise<{ id: string; suitableDates: [] }>;
  getEventWithVotes(eventId: string);
}
