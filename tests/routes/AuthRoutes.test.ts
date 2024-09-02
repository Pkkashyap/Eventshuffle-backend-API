import request from "supertest";
import express from "express";
import { createAuthRouter } from "../../src/routes/AuthRoutes";
import { AuthService } from "../../src/services/AuthService";

jest.mock("../../src/services/AuthService");

const app = express();

describe("AuthRoutes", () => {
  let mockAuthService: jest.Mocked<AuthService>;
  mockAuthService = new AuthService() as jest.Mocked<AuthService>;
  app.use(express.json());
  app.use("/api/v1/auth", createAuthRouter(mockAuthService));

  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      mockAuthService.register.mockResolvedValue({
        username: "testuser",
      } as any);

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({ username: "testuser", password: "password123" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "User registered successfully",
      });
      expect(mockAuthService.register).toHaveBeenCalledWith(
        "testuser",
        "password123"
      );
    });

    it("should return an error if the username is already taken", async () => {
      mockAuthService.register.mockRejectedValue(
        new Error("Username already taken")
      );

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({ username: "testuser", password: "password123" });

      expect(response.status).toBe(500);
    });
  });

  describe("POST /login", () => {
    it("should log in a user and return a token", async () => {
      mockAuthService.login.mockResolvedValue("mockToken");

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ username: "testuser", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: "mockToken" });
      expect(mockAuthService.login).toHaveBeenCalledWith(
        "testuser",
        "password123"
      );
    });

    it("should return an error for invalid credentials", async () => {
      mockAuthService.login.mockRejectedValue(new Error("Invalid credentials"));

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ username: "testuser", password: "wrongpassword" });

      expect(response.status).toBe(500);
    });
  });
});
