const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const connectDB = require('./config/db');
const emailRoutes = require('./routes/emailRoute');
require('dotenv').config();

connectDB();
const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api', emailRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
