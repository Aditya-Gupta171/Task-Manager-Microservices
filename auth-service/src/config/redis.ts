import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  // No password for local development
});

redisClient.on('error', (error) => {
  console.error('Redis Error:', error);
});

// Test connection
redisClient.ping().then(
  () => console.log('Redis connected'),
  (err) => console.error(' Redis connection failed:', err)
);

export default redisClient;