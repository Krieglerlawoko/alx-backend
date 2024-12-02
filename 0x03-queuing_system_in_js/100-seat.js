import express from 'express';
import { createClient } from 'redis';
import { createQueue } from 'kue';
import { promisify } from 'util';

const app = express();
const client = createClient();
const queue = createQueue();
const HOST = '127.0.0.1';
const PORT = 1245;
let reservationEnabled = true;

// Redis client operations
/**
 * Sets the number of available seats in Redis
 * @param {number} number - The number of available seats
 */
function reserveSeat(number) {
  client.set('available_seats', number, (err) => {
    if (err) console.error(`Error setting available seats: ${err.message}`);
  });
}

/**
 * Queries Redis for the number of available seats
 * @returns {Promise<number>} - The number of available seats
 */
async function getCurrentAvailableSeats() {
  const getAsync = promisify(client.get).bind(client);
  const availableSeats = await getAsync('available_seats');
  return availableSeats ? Number(availableSeats) : 0;
}

// Express app routes
app.get('/available_seats', async (req, res) => {
  try {
    const availableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: availableSeats });
  } catch (error) {
    console.error(`Error fetching available seats: ${error.message}`);
    res.status(500).json({ status: 'Internal Server Error' });
  }
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  const reserveSeatJob = queue.create('reserve_seat').save((err) => {
    if (err) {
      console.error(`Error creating reservation job: ${err.message}`);
      return res.status(500).json({ status: 'Internal Server Error' });
    }

    res.json({ status: 'Reservation in process' });

    reserveSeatJob.on('complete', () => {
      console.log(`Seat reservation job ${reserveSeatJob.id} completed`);
    });

    reserveSeatJob.on('failed', (errorMessage) => {
      console.error(`Seat reservation job ${reserveSeatJob.id} failed: ${errorMessage}`);
    });
  });
});

app.get('/process', (req, res) => {
  queue.process('reserve_seat', async (job, done) => {
    try {
      let availableSeats = await getCurrentAvailableSeats();

      if (availableSeats <= 0) {
        return done(new Error('Not enough seats available'));
      }

      availableSeats -= 1;
      reserveSeat(availableSeats);

      if (availableSeats === 0) {
        reservationEnabled = false;
      }

      done();
    } catch (error) {
      console.error(`Error processing seat reservation: ${error.message}`);
      done(error);
    }
  });

  res.json({ status: 'Queue processing' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is live at http://${HOST}:${PORT}`);
});
