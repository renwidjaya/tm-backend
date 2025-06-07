import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const authorize = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized. Token tidak ditemukan." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as {
      id: number;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token tidak valid." });
    return;
  }
};
