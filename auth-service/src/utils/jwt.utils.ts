import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import redisClient from '../config/redis';

dotenv.config();

// Define token expiry time (24 hours in seconds)
const SESSION_EXPIRY = 60 * 60 * 24;

// Validate that JWT_SECRET exists
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set in environment variables. Using fallback secret key.');
}

// Define our custom payload type
export interface TokenPayload extends JwtPayload {
  userId: number;
  email?: string;
  role?: string;
}

export class JwtUtils {
  /**
   * Generate a JWT token
   * @param payload Data to encode in the token
   * @returns The signed JWT token
   */
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  /**
   * Verify and decode a JWT token
   * @param token The JWT token to verify
   * @returns Decoded token payload or throws an error if invalid
   */
  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Store the user's session token in Redis
   * @param userId The user ID
   * @param token The JWT token
   */
  static async storeSession(userId: number, token: string): Promise<void> {
    const sessionKey = `session:${userId}`;
    await redisClient.set(sessionKey, token, 'EX', SESSION_EXPIRY);
  }

  /**
   * Get a stored session token from Redis
   * @param userId The user ID
   * @returns The stored token or null if not found
   */
  static async getSession(userId: number): Promise<string | null> {
    const sessionKey = `session:${userId}`;
    return redisClient.get(sessionKey);
  }

  /**
   * Remove a user's session token from Redis
   * @param userId The user ID
   */
  static async removeSession(userId: number): Promise<void> {
    const sessionKey = `session:${userId}`;
    await redisClient.del(sessionKey);
  }

  /**
   * Validate a token by verifying it and checking if it matches the stored token
   * @param token The JWT token to validate
   * @returns The decoded token payload if valid
   */
  static async validateSession(token: string): Promise<TokenPayload> {
    try {
      const decoded = this.verifyToken(token);
      
      // Check if token matches the one stored in Redis
      const storedToken = await this.getSession(decoded.userId);
      
      if (!storedToken || storedToken !== token) {
        throw new Error('Session expired or invalid');
      }
      
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired session');
    }
  }
}

export default JwtUtils;
