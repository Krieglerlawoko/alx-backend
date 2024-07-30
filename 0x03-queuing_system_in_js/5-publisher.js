import { createClient } from 'redis';

const redisClient = createClient();

// Handle Redis client errors
redisClient.on('error', (error) => {
  console.error(`Redis client not connected to server: ${error.message}`);
});

// Log successful connection to the Redis server
redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

/**
 * Publish a message to the Redis channel after a specified delay
 * @param {string} message - The message to publish
 * @param {number} delay - The delay in milliseconds before publishing the message
 */
function publishMessage(message, delay) {
  setTimeout(() => {
    console.log(`About to send message: ${message}`);
    redisClient.publish('holberton school channel', message, (error, reply) => {
      if (error) {
        console.error(`Failed to publish message: ${error.message}`);
      } else {
        console.log(`Message sent: ${message} (Subscribers: ${reply})`);
      }
    });
  }, delay);
}

// Publish messages with specified delays
publishMessage('Holberton Student #1 starts course', 100);
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);
