import { print, createClient } from 'redis';
import { promisify } from 'util';

const redisClient = createClient();

// Promisify the Redis get method
const getAsync = promisify(redisClient.get).bind(redisClient);

// Handle Redis client errors
redisClient.on('error', (error) => {
  console.error(`Redis client not connected to server: ${error.message}`);
  redisClient.quit();
});

// Log successful connection to the Redis server
redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
  main().catch((error) => {
    console.error(`Error in main execution: ${error.message}`);
    redisClient.quit();
  });
});

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
 * Gets and displays the value associated with the given key in Redis asynchronously
 * @param {string} schoolName - The key to search for in Redis
 */
async function displaySchoolValue(schoolName) {
  try {
    const value = await getAsync(schoolName);
    if (value) {
      console.log(`Value for ${schoolName}: ${value}`);
    } else {
      console.log(`No value found for ${schoolName}`);
    }
  } catch (error) {
    console.error(`Failed to get value for ${schoolName}: ${error.message}`);
  }
}

/**
 * Entry point
 */
async function main() {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
}
