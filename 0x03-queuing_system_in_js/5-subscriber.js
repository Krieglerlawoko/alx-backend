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

// Handle messages received on subscribed channels
redisClient.on('message', (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);
  if (message === 'KILL_SERVER') {
    handleKillServer(channel);
  }
});

// Subscribe to the specified channel
redisClient.subscribe('holberton school channel');

/**
 * Handle the 'KILL_SERVER' message by unsubscribing and quitting the client
 * @param {string} channel - The channel to unsubscribe from
 */
function handleKillServer(channel) {
  console.log(`Unsubscribing from ${channel} and shutting down the client.`);
  redisClient.unsubscribe(channel, (err) => {
    if (err) {
      console.error(`Error unsubscribing from ${channel}: ${err.message}`);
    } else {
      console.log(`Successfully unsubscribed from ${channel}`);
      redisClient.quit();
    }
  });
}
