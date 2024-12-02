import { print, createClient } from 'redis';

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

// Log the initial connection status
console.log(`Initial connection status: ${redisClient.connected}`);

/**
 * Sets a key-value pair in Redis
 * @param {string} schoolName - The key to set
 * @param {string} value - The value to associate with the key
 */
function setNewSchool(schoolName, value) {
  redisClient.set(schoolName, value, (error, reply) => {
    if (error) {
      console.error(`Failed to set value for ${schoolName}: ${error.message}`);
    } else {
      console.log(`Set value for ${schoolName}: ${reply}`);
    }
  });
}

/**
 * Gets and displays the value associated with the given key in Redis
 * @param {string} schoolName - The key to search for in Redis
 */
function displaySchoolValue(schoolName) {
  redisClient.get(schoolName, (error, value) => {
    if (error) {
      console.error(`Failed to get value for ${schoolName}: ${error.message}`);
    } else if (value) {
      console.log(`Value for ${schoolName}: ${value}`);
    } else {
      console.log(`No value found for ${schoolName}`);
    }
  });
}

// Set and display values
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('Holberton');
displaySchoolValue('HolbertonSanFrancisco');
