import { createQueue } from 'kue';

const queue = createQueue();

// Job data
const jobData = {
  phoneNumber: '+254111222',
  message: 'Your order is on its way. Thank you for shopping with us.',
};

// Create and save the job
const job = queue.create('push_notification_code', jobData)
  .save((error) => {
    if (error) {
      console.error(`Failed to create notification job: ${error.message}`);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });

// Event listeners for job completion and failure
job.on('complete', () => {
  console.log(`Notification job ${job.id} completed successfully`);
});

job.on('failed', (errorMessage) => {
  console.error(`Notification job ${job.id} failed: ${errorMessage}`);
});
