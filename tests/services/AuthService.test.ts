import { AuthService } from "../../src/services/AuthService";
import { User } from "../../src/models/userModel";
import jwt from "jsonwebtoken";

jest.mock("../../src/models/userModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const user = { username: "testuser", password: "hashedpassword" };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.prototype.save as jest.Mock).mockResolvedValue(user);

      const result = await authService.register("testuser", "password123");
      expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(User.prototype.save).toHaveBeenCalled();
    });

    it("should throw an error if the username is already taken", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ username: "testuser" });

      await expect(
        authService.register("testuser", "password123")
      ).rejects.toThrow("Username already taken");
    });
  });

  describe("login", () => {
    it("should return a token for valid credentials", async () => {
      const user = {
        _id: "123",
        username: "testuser",
        password: "hashedpassword",
        comparePassword: jest.fn(),
      };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (user.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mockToken");

      const token = await authService.login("testuser", "password123");
      expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(user.comparePassword).toHaveBeenCalledWith("password123");
      expect(token).toBe("mockToken");
    });

    it("should throw an error if the user does not exist", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login("testuser", "password123")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw an error if the password does not match", async () => {
      const user = {
        _id: "123",
        username: "testuser",
        password: "hashedpassword",
        comparePassword: jest.fn(),
      };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (user.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login("testuser", "password123")
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
