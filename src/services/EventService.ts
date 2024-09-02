import { IEventService } from "./interfaces/IEventService";
import { Event } from "../models/eventModel";
import IEvent from "../schemas/interface/IEvent";
import IPerson from "../schemas/interface/IPerson";
import { Person } from "../models/personModel";
import { Vote } from "../models/voteModel";
import IVote from "../schemas/interface/IVote";
import mongoose from "mongoose";

export class EventService implements IEventService {
  public async createEvent(name: string, dates: string[]): Promise<IEvent> {
    const eventExists = await Event.findOne({ name });
    if (eventExists) {
      throw new Error("Event with this name already exists");
    }

    const event = new Event({ name, dates });
    return await event.save();
  }

  public async listEvents(): Promise<
    { id: mongoose.Types.ObjectId; name: String }[]
  > {
    const events = await Event.find({}, { _id: 1, name: 1 });
    return events.map((event) => ({
      id: event._id,
      name: event.name,
    }));
  }

  private async getOrCreatePerson(name: string): Promise<IPerson> {
    let person = await Person.findOne({ name });

    if (!person) {
      person = await new Person({ name }).save();
    }
    return person;
  }

  private async addVote(
    eventId: string,
    personId: mongoose.Types.ObjectId,
    date: string
  ): Promise<IVote> {
    const event = await Event.findById(eventId);
    if (!event || !event.dates.includes(date)) {
      throw new Error("Invalid date for this event");
    }

    const existingVote = await Vote.findOne({ eventId, personId, date });

    if (!existingVote) {
      const vote = new Vote({ eventId, personId, date });
      return await vote.save();
    }

    return existingVote;
  }

  public async addVoteToEventById(
    eventId: string,
    personName: string,
    votes: string[]
  ) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const person = await this.getOrCreatePerson(personName);

    for (const date of votes) {
      await this.addVote(event._id.toString(), person._id, date);
    }
    return await this.getEventWithVotes(eventId);
  }

  public async getEventWithVotes(eventId: string) {
    const eventDetails = await Event.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(eventId) },
      },
      {
        $lookup: {
          from: "votes",
          localField: "_id",
          foreignField: "eventId",
          as: "votes",
        },
      },
      {
        $unwind: {
          path: "$votes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "people",
          localField: "votes.personId",
          foreignField: "_id",
          as: "votePeople",
        },
      },
      {
        $unwind: {
          path: "$votePeople",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            eventId: "$_id",
            date: "$votes.date",
          },
          name: { $first: "$name" },
          dates: { $first: "$dates" },
          people: { $addToSet: "$votePeople.name" },
        },
      },
      {
        $group: {
          _id: "$_id.eventId",
          name: { $first: "$name" },
          dates: { $first: "$dates" },
          votes: {
            $push: {
              date: "$_id.date",
              people: "$people",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          dates: 1,
          votes: 1,
        },
      },
    ]);

    if (!eventDetails.length) return null;

    return {
      id: eventDetails[0]._id,
      name: eventDetails[0].name,
      dates: eventDetails[0].dates,
      votes: eventDetails[0].votes,
    };
  }

  public async getResults(
    eventId: string
  ): Promise<{ id: string; suitableDates: [] }> {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    const eventDetails = await Event.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(eventId) },
      },
      {
        $lookup: {
          from: "votes",
          localField: "_id",
          foreignField: "eventId",
          as: "votes",
        },
      },
      {
        $unwind: {
          path: "$votes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "people",
          localField: "votes.personId",
          foreignField: "_id",
          as: "votePeople",
        },
      },
      {
        $unwind: {
          path: "$votePeople",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$votes.date",
          people: { $addToSet: "$votePeople.name" },
          totalVotes: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "votes",
          pipeline: [
            { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
            { $group: { _id: "$personId" } },
          ],
          as: "totalParticipants",
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          people: 1,
          suitable: {
            $cond: {
              if: {
                $eq: [{ $size: "$people" }, { $size: "$totalParticipants" }],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $match: { suitable: true },
      },
      {
        $group: {
          _id: null,
          suitableDates: {
            $push: {
              date: "$date",
              people: "$people",
            },
          },
        },
      },
    ]);

    if (!eventDetails.length || !eventDetails[0].suitableDates.length) {
      return { id: eventId, suitableDates: [] };
    }

    return {
      id: eventId,
      suitableDates: eventDetails[0].suitableDates,
    };
  }
}
