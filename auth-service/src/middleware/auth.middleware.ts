import { Request, Response, NextFunction } from "express";
import { JwtUtils } from "../utils/jwt.utils";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = JwtUtils.verifyToken(token); 
      (req as any).user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
