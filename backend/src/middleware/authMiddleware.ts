import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { addLog } from "../utils/statusLogger";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || "expense_mate_default_secret_key_2026";
};

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = getJwtSecret();
      const decoded = jwt.verify(token, secret) as { id: string };

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        addLog(
          "warn",
          "API",
          `Auth failed: User ID ${decoded.id} no longer exists in database.`,
        );
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      req.user = user as IUser;
      return next();
    } catch (error: any) {
      const errMessage = error?.message || String(error);
      addLog("error", "API", `JWT Auth Error: ${errMessage}`, error?.stack);
      return res.status(401).json({ message: `Not authorized: ${errMessage}` });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};
