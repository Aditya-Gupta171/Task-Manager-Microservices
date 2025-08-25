import { Router } from 'express'
import type { Request, Response } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validateRegistration, validateLogin } from '../middleware/validation.middleware'
import { authMiddleware } from '../middleware/auth.middleware'


interface AuthRequest extends Request {
  user?: {
    userId: number;
  };
}

const router = Router()
const authController = new AuthController()

router.post('/register', validateRegistration, authController.register.bind(authController))
router.post('/login', validateLogin, authController.login.bind(authController))

router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ userId: req.user?.userId })
})

router.post('/logout', authMiddleware, authController.logout.bind(authController))

router.get('/profile', authMiddleware, authController.getUserProfile.bind(authController))

export default router