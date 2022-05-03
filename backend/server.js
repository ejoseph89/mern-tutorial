// Packages
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

// Connect database
connectDB();

// Initializing express
const app = express();

// Middleware
// To use body data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Pointing to routes
app.use("/api/goals", require("./routes/goalRoutes"));

// Error middleware
app.use(errorHandler);

// Server listening
app.listen(port, () => {
  console.log(`SERVER STARTED ON PORT ${port}`.cyan.bold);
});
