const nodemailer = require('nodemailer');
const { getRandomDelay, delay } = require('./randomDelay');
const { Email } = require('../models/email.model');
const { Job } = require('../models/job.model');
const dotenv = require('dotenv');

dotenv.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email provider (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Function to process a single email
const sendEmail = async (email) => {
  try {
    // Send the email using Nodemailer
    await transporter.sendMail({
      from: email.from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      attachments: email.attachments,
    });

    console.log(`Email sent to ${email.to}`);

    // Update the email status to "sent"
    await Email.findByIdAndUpdate(email.emailId, { status: 'sent' });
  } catch (error) {
    console.error(`Failed to send email to ${email.to}:`, error);

    // Update the email status to "failed"
    await Email.findByIdAndUpdate(email.emailId, { status: 'failed' });
  }
};

// Function to process emails in batches
const processEmailsInBatches = async (emails) => {
  console.log('Processing emails in batches...');
  let remainingEmails = [...emails];
  let totalDelay = 0;

  while (remainingEmails.length > 0) {
    const batchSize = getRandomDelay(3, 10);
    const batch = remainingEmails.splice(0, batchSize);

    const batchDelay = getRandomDelay(1, 5) * 60000; // Delay in milliseconds
    totalDelay += batchDelay;

    console.log(`Processing batch of ${batch.length} emails with a delay of ${batchDelay}ms...`);

    await delay(totalDelay);

    for (const email of batch) {
      await sendEmail(email);

      const emailDelay = getRandomDelay(1000, 5000); // Delay between emails
      await delay(emailDelay);
    }
  }
};

// Add emails to the MongoDB queue
const addToQueue = async (emails) => {
  console.log('Adding emails to the queue...');
  const jobs = emails.map((email) => ({ email, status: 'pending' }));
  await Job.insertMany(jobs);
};

// Process the MongoDB queue
const processQueue = async () => {
  console.log('Processing email queue...');

  const jobs = await Job.find({ status: 'pending' }).limit(5); // Process 5 at a time
  for (const job of jobs) {
    try {
      // Mark the job as "processing"
      await Job.findByIdAndUpdate(job._id, { status: 'processing' });

      // Process the email
      await processEmailsInBatches([job.email]);

      // Mark the job as "completed" and remove it from the database
      await Job.findByIdAndDelete(job._id); // Remove the job after processing
      console.log(`Job ${job._id} completed and removed from the database.`);
    } catch (error) {
      console.error('Failed to process job:', error);

      // Mark the job as "failed" and remove it from the database
      await Job.findByIdAndDelete(job._id); // Remove the job even if it fails
      console.log(`Job ${job._id} failed and removed from the database.`);
    }
  }
};

// Export the functions
module.exports = { addToQueue, processQueue };