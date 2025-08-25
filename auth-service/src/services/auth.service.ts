import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { JwtUtils } from '../utils/jwt.utils'

const prisma = new PrismaClient()

export class AuthService {
  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })
    
    return { id: user.id, email: user.email, name: user.name }
  }
  
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }
    
    const token = JwtUtils.generateToken({ userId: user.id })
    
    // Store token in Redis for server-side validation/revocation
    await JwtUtils.storeSession(user.id, token)
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  }
  
  async validateToken(token: string) {
    return JwtUtils.verifyToken(token)
  }
  
  async logout(userId: number) {
    // Remove the token from Redis to invalidate it server-side
    await JwtUtils.removeSession(userId)
    return true
  }
  
  async getUserProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user
  }
}