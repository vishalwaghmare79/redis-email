const sgMail = require('@sendgrid/mail');
const { Email } = require('../models/email.model');
const { Job } = require('../models/job.model');
const dotenv = require('dotenv');

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, retries = 3) => {
  try {
    await sgMail.send(email);
    console.log(`Email sent to ${email.to}`);

    await Email.findByIdAndUpdate(email.emailId, { status: 'sent' });
  } catch (error) {
    console.error(`Failed to send email to ${email.to}:`, error);

    if (retries > 0) {
      console.log(`Retrying email to ${email.to} (${retries} retries left)...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await sendEmail(email, retries - 1); 
    } else {
      await Email.findByIdAndUpdate(email.emailId, { status: 'failed' });
      throw error;
    }
  }
};

const addToQueue = async (emails) => {
  console.log('Adding emails to the queue...');
  const jobs = emails.map((email) => ({ email, status: 'pending' }));
  await Job.insertMany(jobs);
};

const processQueue = async () => {
  console.log('Processing email queue...');

  const jobs = await Job.find({ status: 'pending' }).limit(10); 
  console.log(`Found ${jobs.length} pending jobs.`);

  for (const job of jobs) {
    try {
      console.log(`Processing job ${job._id}...`);

      await Job.findByIdAndUpdate(job._id, { status: 'processing' });
      console.log(`Job ${job._id} marked as processing.`);

      await sendEmail(job.email);

      await Job.findByIdAndDelete(job._id); 
      console.log(`Job ${job._id} completed and removed from the database.`);
    } catch (error) {
      console.error('Failed to process job:', error);

      await Job.findByIdAndDelete(job._id);
      console.log(`Job ${job._id} failed and removed from the database.`);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 100)); 
    }
  }
};

module.exports = { addToQueue, processQueue };