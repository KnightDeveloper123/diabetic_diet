
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import  {executeQuery}  from "../controller/helper.js";

interface AuthPayload extends JwtPayload {
  id?: string;
  user_id?: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export const middleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Token Missing",
      });
      return;
    }

    // Validate Bearer token format.
    const [scheme, token, ...extra] = authHeader.split(" ");

    if (
      scheme !== "Bearer" ||
      !token ||
      extra.length > 0
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
      return;
    }

    // Check whether the token is blacklisted.
    const blacklisted = await executeQuery(
      `SELECT * FROM blacklisted_tokens WHERE token = ?`,
      [token]
    );

    if (blacklisted.length > 0) {
      res.status(401).json({
        success: false,
        message: "Token expired. Please login again",
      });
      return;
    }

    // Verify JWT.
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
      res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
      return;
    }

    const user = decoded as AuthPayload;

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }
};
