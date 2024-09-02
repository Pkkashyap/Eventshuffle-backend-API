import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";

export const createAuthRouter = (authService = new AuthService()) => {
  const authController = new AuthController(authService);
  const router = Router();

  router.post("/register", authController.register.bind(authController));
  router.post("/login", authController.login.bind(authController));
  return router;
};

export default createAuthRouter();
