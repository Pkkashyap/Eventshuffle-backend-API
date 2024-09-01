import { Request, Response, NextFunction } from "express";
import { IEventService } from "../services/interfaces/IEventService";

export class EventController {
  constructor(private eventService: IEventService) {
    this.eventService = eventService;
  }

  public async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, dates } = req.body;

      const event = await this.eventService.createEvent(name, dates);
      res.status(201).json({ id: event._id });
    } catch (error) {
      next(error);
    }
  }

  public async listEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await this.eventService.listEvents();
      res.json({ events });
    } catch (error) {
      next(error);
    }
  }

  public async showEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await this.eventService.getEventWithVotes(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  public async addVote(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, votes } = req.body;
      const event = await this.eventService.addVoteToEventById(
        req.params.id,
        name,
        votes
      );
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  public async getResults(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await this.eventService.getResults(req.params.id);
      if (!results) {
        return res
          .status(404)
          .json({ message: "Event not found or no suitable dates found" });
      }
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  // Get event with votes by ID
  public async getEventWithVotes(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const event = await this.eventService.getEventWithVotes(req.params.id);
      if (!event) {
        res.status(404).json({ message: "Event not found" });
      } else {
        res.json(event);
      }
    } catch (error) {
      next(error);
    }
  }
}
