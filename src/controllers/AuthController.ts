import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private authService: AuthService) {}

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const user = await this.authService.register(username, password);
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const token = await this.authService.login(username, password);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }
}
