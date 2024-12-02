import { createQueue } from 'kue';
import { expect } from 'chai';
import { spy } from 'sinon';
import createPushNotificationsJobs from './8-jobs';

describe('createPushNotificationsJobs Unit Tests', () => {
  const queue = createQueue();

  before(() => {
    // Enter test mode before running any tests
    queue.testMode.enter();
  });

  afterEach(() => {
    // Clear test data after each test
    queue.testMode.clear();
  });

  after(() => {
    // Exit test mode after all tests have run
    queue.testMode.exit();
  });

  it('should add jobs to the queue', () => {
    const consoleSpy = spy(console, 'log');
    const jobs = [
      { phoneNumber: '499494', message: 'Your one-time pin is 1234' },
      { phoneNumber: '908187', message: 'Your one-time pin is 0965' }
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs).to.have.lengthOf(2);
    expect(consoleSpy.calledTwice).to.be.true;

    // Restore the original console.log function
    consoleSpy.restore();
  });

  it('should add jobs with the correct data', () => {
    const jobs = [{ phoneNumber: '499494', message: 'Your one-time pin is 1234' }];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs[0].data).to.deep.equal(jobs[0]);
  });

  it('should throw an error if the jobs parameter is not an array', () => {
    const invalidJobs = { phoneNumber: '499494', message: 'Your one-time pin is 1234' };

    expect(() => createPushNotificationsJobs(invalidJobs, queue)).to.throw('The jobs parameter must be an array.');
  });
});
