import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  console.log(process.env.JWT_SECRET, "sdsd");
  try {
    const decoded = jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET as string
    );
    req["user"] = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
};
