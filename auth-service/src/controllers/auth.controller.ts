import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;
  
  constructor() {
    this.authService = new AuthService();
  }
  
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const user = await this.authService.register(email, password, name);
      res.status(201).json(user);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      res.status(500).json({ message: 'Error registering user' });
    }
  }
  
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Authentication failed' });
    }
  }
  
  async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;  
      await this.authService.logout(userId);
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error logging out' });
    }
  }

  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;  
      const profile = await this.authService.getUserProfile(userId);
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error fetching profile' });
    }
  }
}