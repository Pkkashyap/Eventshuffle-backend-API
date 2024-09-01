import { body, param } from "express-validator";
import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateEventId = [
  param("id").trim().isMongoId().withMessage("Invalid event ID format"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateVote = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("votes")
    .isArray({ min: 1 })
    .withMessage("At least one vote must be provided")
    .custom((votes) => {
      if (!Array.isArray(votes)) {
        throw new Error("Votes must be an array");
      }
      const validVotes = votes.every((date) => !isNaN(Date.parse(date)));
      if (!validVotes) {
        throw new Error("All votes must be valid ISO 8601 date strings");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateEventCreation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Event name is required")
    .isLength({ max: 100 })
    .withMessage("Event name cannot exceed 100 characters"),
  body("dates")
    .isArray({ min: 1 })
    .withMessage("At least one date must be provided")
    .custom((dates) => {
      if (!Array.isArray(dates)) {
        throw new Error("Dates must be an array");
      }

      // Parse dates into a consistent format
      const normalizedDates = dates.map((date) => {
        const parsedDate = new Date(Date.parse(date));
        return parsedDate.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD'
      });

      const validDates = normalizedDates.every(
        (date) => !isNaN(Date.parse(date))
      );
      if (!validDates) {
        throw new Error("All dates must be valid date strings (YYYY-MM-DD)");
      }

      const uniqueDates = new Set(normalizedDates);
      if (uniqueDates.size !== normalizedDates.length) {
        throw new Error("Duplicate dates are not allowed");
      }

      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
