import express from 'express';
import cors from 'cors';  // Add this import
import authRoutes from './routes/auth.routes';
import { connectDB } from './config/database';
import redisClient from './config/redis'; // Import Redis client
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Add CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;

async function startServer() {
  await connectDB(); 

  app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
  });
}

startServer();