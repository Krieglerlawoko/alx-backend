import { createClient, print } from 'redis';

const redisClient = createClient();

// Handle Redis client errors
redisClient.on('error', (error) => {
  console.error(`Redis client not connected to server: ${error.message}`);
});

// Log successful connection to the Redis server
redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
  initializeData();
});

/**
 * Initialize data in Redis by setting key-value pairs for HolbertonSchools
 */
function initializeData() {
  const schools = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 42,
  };

  for (const [city, value] of Object.entries(schools)) {
    redisClient.hset('HolbertonSchools', city, value, print);
  }

  redisClient.hgetall('HolbertonSchools', (error, value) => {
    if (error) {
      console.error(`Error retrieving data: ${error.message}`);
    } else {
      console.log('HolbertonSchools:', value);
    }
  });
}
