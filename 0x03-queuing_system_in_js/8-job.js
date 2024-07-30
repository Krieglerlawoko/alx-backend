dds jobs to the 'push_notification_code_3' queue
 * @param {Array<Object>} jobs - List of objects containing job data
 * @param {import('kue').Queue} queue - The queue object
 * @throws {Error} Throws an error if `jobs` is not an array
 */
export default function createPushNotificationsJobs(jobs, queue) {
  // Validate that jobs is an array
  if (!Array.isArray(jobs)) {
    throw new Error('The jobs parameter must be an array.');
  }

  // Process each job data item
  jobs.forEach((jobData) => {
    const job = queue.create('push_notification_code_3', jobData);

    // Save the job and handle errors
    job.save((error) => {
      if (error) {
        console.error(`Failed to create notification job: ${error.message}`);
        return;
      }
      console.log(`Notification job created: ${job.id}`);
    });

    // Log job progress
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed successfully.`);
    });

    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} is ${progress}% complete.`);
    });

    job.on('failed', (errorMessage) => {
      console.error(`Notification job ${job.id} failed: ${errorMessage}`);
    });
  });
}
