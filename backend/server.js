const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const connectDB = require('./config/db');
const emailRoutes = require('./routes/emailRoute');
const { processQueue } = require('./helpers/emailQueue');
require('dotenv').config();

connectDB();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api', emailRoutes);

// Start the email queue worker
const startWorker = () => {
  const workerInterval = setInterval(async () => {
    try {
      await processQueue();
    } catch (error) {
      console.error('Error in worker:', error);
    }
  }, 10000); // Run every 10 seconds

  // Stop the worker after 1 hour (for testing purposes)
  setTimeout(() => {
    clearInterval(workerInterval);
    console.log('Worker stopped.');
  }, 3600000); // 1 hour
};

// Start the worker
startWorker();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});