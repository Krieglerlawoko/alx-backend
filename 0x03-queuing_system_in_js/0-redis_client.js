import { createClient } from 'redis';

const redisClient = createClient();

// Handle Redis client errors
redisClient.on('error', (error) => {
  console.error(`Redis client not connected to server: ${error.message}`);
  redisClient.quit();
});

// Log successful connection to the Redis server
redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Export the redisClient for use in other modules
export default redisClient;
