import { createQueue } from 'kue';

const blacklistedNumbers = ['4153518780', '4153518781'];
const queue = createQueue();

/**
 * Handles notification jobs for queue 'push_notification_code_2'
 * @param {string} phoneNumber - User's phone number
 * @param {string} message - Push notification message
 * @param {import('kue').Job} job - Queue job
 * @param {import('kue').DoneCallback} done - Done callback
 */
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100);

  if (blacklistedNumbers.includes(phoneNumber)) {
    const errorMessage = `Phone number ${phoneNumber} is blacklisted`;
    console.error(errorMessage);
    done(new Error(errorMessage));
    return;
  }

  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber} with message: ${message}`);
  done();
}

// Process the 'push_notification_code_2' queue with concurrency of 2
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
