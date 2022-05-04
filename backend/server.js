// Packages
const path = require('path')
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
app.use("/api/users", require("./routes/userRoutes"));

// Serve frontend
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')))
} else {
  app.get('/', (req, res) => res.send('Please set to production'))
}

// Error middleware
app.use(errorHandler);

// Server listening
app.listen(port, () => {
  console.log(`SERVER STARTED ON PORT ${port}`.cyan.bold);
});
