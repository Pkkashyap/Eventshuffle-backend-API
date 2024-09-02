import { AuthController } from "../../src/controllers/AuthController";
import { AuthService } from "../../src/services/AuthService";
import { Request, Response, NextFunction } from "express";

jest.mock("../../src/services/AuthService");

describe("AuthController", () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockAuthService = new AuthService() as jest.Mocked<AuthService>;
    authController = new AuthController(mockAuthService);

    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a user and return a success message", async () => {
      req.body = { username: "testuser", password: "password123" };
      mockAuthService.register.mockResolvedValue({
        username: "testuser",
      } as any);

      await authController.register(req as Request, res as Response, next);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        "testuser",
        "password123"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
      });
    });

    it("should handle errors during registration and call next with the error", async () => {
      const error = new Error("Username already taken");
      mockAuthService.register.mockRejectedValue(error);

      await authController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    it("should log in a user and return a token", async () => {
      req.body = { username: "testuser", password: "password123" };
      mockAuthService.login.mockResolvedValue("mockToken");

      await authController.login(req as Request, res as Response, next);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        "testuser",
        "password123"
      );
      expect(res.json).toHaveBeenCalledWith({ token: "mockToken" });
    });

    it("should handle errors during login and call next with the error", async () => {
      const error = new Error("Invalid credentials");
      mockAuthService.login.mockRejectedValue(error);

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
