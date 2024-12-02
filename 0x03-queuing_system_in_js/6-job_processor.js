import { createQueue } from 'kue';

const queue = createQueue();

/**
 * Sends notification to a specified user
 * @param {string} phoneNumber - The recipient's phone number
 * @param {string} message - The message to send
 */
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber} with message: ${message}`);
}

/**
 * Processes 'push_notification_code' jobs in the queue
 * @param {Object} job - The job object
 * @param {Function} done - The callback to signal job completion
 */
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;

  try {
    sendNotification(phoneNumber, message);
    done();
  } catch (error) {
    console.error(`Failed to send notification: ${error.message}`);
    done(error);
  }
});
