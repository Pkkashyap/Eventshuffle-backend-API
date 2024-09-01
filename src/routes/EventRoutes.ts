import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { EventService } from "../services/EventService";
import {
  validateEventCreation,
  validateEventId,
  validateVote,
} from "../middlewares/validateEvent";

export const createEventRouter = (eventService = new EventService()) => {
  const router = Router();
  const eventController = new EventController(eventService);

  router.post(
    "/",
    validateEventCreation,
    eventController.createEvent.bind(eventController)
  );

  router.get("/list", eventController.listEvents.bind(eventController));

  router.get(
    "/:id",
    validateEventId,
    eventController.showEvent.bind(eventController)
  );

  router.post(
    "/:id/vote",
    validateEventId,
    validateVote,
    eventController.addVote.bind(eventController)
  );

  router.get(
    "/:id/results",
    validateEventId,
    eventController.getResults.bind(eventController)
  );

  return router;
};

export default createEventRouter();
