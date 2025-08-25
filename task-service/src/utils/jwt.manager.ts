import jwt from "jsonwebtoken";
import redisClient from "../config/redis";

const JWT_SECRET = process.env.JWT_SECRET || "access_secret";
const SESSION_EXPIRY = 60 * 60 * 24; 

export interface JwtPayload {
  userId: number;
  email?: string;
  role?: string;
}

export const getJwtToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

export const verifyJwtToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export class JwtManager {
  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET);
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  static async storeSession(userId: number, token: string): Promise<void> {
    const sessionKey = `session:${userId}`;
    await redisClient.set(sessionKey, token, "EX", SESSION_EXPIRY);
  }

  static async getSession(userId: number): Promise<string | null> {
    const sessionKey = `session:${userId}`;
    return redisClient.get(sessionKey);
  }

  static async removeSession(userId: number): Promise<void> {
    const sessionKey = `session:${userId}`;
    await redisClient.del(sessionKey);
  }

  static async validateSession(token: string): Promise<any> {
    try {
      const decoded = this.verifyToken(token) as JwtPayload;
      
      const storedToken = await this.getSession(decoded.userId);
      
      if (!storedToken || storedToken !== token) {
        throw new Error("Session expired or invalid");
      }
      
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
};