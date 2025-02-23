const Queue = require("bull");
const sgMail = require("@sendgrid/mail");
const { getRandomDelay, delay } = require("./randomDelay");
const dotenv = require("dotenv");
const { Email } = require("../models/email.model");
const Redis = require("ioredis");

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  reconnectOnError: (err) => {
    console.error("Redis reconnecting due to error:", err);
    return true;
  },
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.on("connect", () => console.log("Redis connected successfully!"));

const emailQueue = new Queue("emailQueue", { redis: { client: redisClient } });

emailQueue.on("error", (error) => console.error("Queue error:", error));
emailQueue.on("waiting", (jobId) => console.log(`Job ${jobId} is waiting`));
emailQueue.on("active", (job) => console.log(`Job ${job.id} is active`));
emailQueue.on("completed", (job) => console.log(`Job ${job.id} completed`));
emailQueue.on("failed", (job, error) => console.error(`Job ${job.id} failed:`, error));
emailQueue.on("ready", () => console.log("Queue is ready"));
emailQueue.on("stalled", (jobId) => console.log(`Job ${jobId} stalled`));

const sendEmail = async (email) => {
  try {
    await sgMail.send(email);
    console.log(`Email sent to ${email.to}`);
    await Email.findByIdAndUpdate(email.emailId, { status: "sent" });
  } catch (error) {
    console.error(`Failed to send email to ${email.to}:`, error);
    await Email.findByIdAndUpdate(email.emailId, { status: "failed" });
    throw error; // Allow Bull to retry the job
  }
};

const processEmailsInBatches = async (emails, job) => {
  let remainingEmails = [...emails];
  let totalDelay = 0;

  while (remainingEmails.length > 0) {
    const batchSize = job.data.batchSize || getRandomDelay(3, 10);
    const batch = remainingEmails.splice(0, batchSize);
    const batchDelay = job.data.batchDelay || getRandomDelay(1, 5) * 60000;
    totalDelay += batchDelay;

    await delay(totalDelay);
    for (const email of batch) {
      await sendEmail(email);
      await delay(getRandomDelay(1000, 5000));
      job.progress((emails.length - remainingEmails.length) / emails.length * 100);
    }
  }
};

emailQueue.process(5, async (job) => { // Process 5 jobs concurrently
  console.log("Processor started for job:", job.id);
  const { emails } = job.data;
  console.log(`Processing ${emails.length} emails...`);
  await processEmailsInBatches(emails, job);
});

process.on("SIGTERM", async () => {
  await emailQueue.close();
  redisClient.disconnect();
  process.exit(0);
});

module.exports = emailQueue;