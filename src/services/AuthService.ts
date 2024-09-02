import { User } from "../models/userModel";
import IUser from "../schemas/interface/IUser";
import jwt from "jsonwebtoken";

export class AuthService {
  public async register(username: string, password: string): Promise<IUser> {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("Username already taken");
    }

    const user = new User({ username, password });
    await user.save();

    return user;
  }

  public async login(username: string, password: string): Promise<string> {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    return token;
  }
}
