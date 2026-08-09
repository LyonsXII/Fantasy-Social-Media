import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Not authenticated"
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
}