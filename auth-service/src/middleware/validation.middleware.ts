import { Request, Response, NextFunction } from 'express'

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' })
  }

  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  next()
}

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  next()
}