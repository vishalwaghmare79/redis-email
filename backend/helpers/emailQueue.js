const Queue = require("bull");
const sgMail = require("@sendgrid/mail");
const { getRandomDelay, delay } = require("./randomDelay");
const dotenv = require("dotenv");
const { Email } = require("../models/email.model");
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    console.log(`Redis reconnect attempt #${times}`);
    return Math.min(times * 500, 2000); 
  },
};

const emailQueue = new Queue("emailQueue", {
  redis: redisConfig,
});

emailQueue.on("error", (error) => {
  console.error("Queue error:", error);
});

emailQueue.on("waiting", (jobId) => {
  console.log(`Job ${jobId} is waiting`);
});

emailQueue.on("active", (job) => {
  console.log(`Job ${job.id} is active`);
});

emailQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailQueue.on("failed", (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});

emailQueue.on("ready", () => {
  console.log("Queue is ready");
});

emailQueue.on("stalled", (jobId) => {
  console.log(`Job ${jobId} stalled`);
});

const sendEmail = async (email) => {
  try {
    await sgMail.send(email);
    console.log(`Email sent to ${email.to}`);

    await Email.findByIdAndUpdate(email.emailId, { status: "sent" });
  } catch (error) {
    console.error(`Failed to send email to ${email.to}:`, error);

    await Email.findByIdAndUpdate(email.emailId, { status: "failed" });
  }
};

const processEmailsInBatches = async (emails) => {
  let remainingEmails = [...emails];
  let totalDelay = 0;

  while (remainingEmails.length > 0) {
    const batchSize = getRandomDelay(3, 10);
    const batch = remainingEmails.splice(0, batchSize);

    const batchDelay = getRandomDelay(1, 5) * 60000;
    totalDelay += batchDelay;

    await delay(totalDelay);

    for (const email of batch) {
      await sendEmail(email);

      const emailDelay = getRandomDelay(1000, 5000);
      await delay(emailDelay);
    }
  }
};

emailQueue.process(async (job) => {
  console.log("Processor started for job:", job.id);
  const { emails } = job.data;
  console.log(`Processing ${emails.length} emails...`, job.data);

  await processEmailsInBatches(emails);
});

module.exports = emailQueue;
