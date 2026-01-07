const express = require("express");
const cors = require("cors");
const testRoute = require("./routes/test.js");
const userRoutes = require('./routes/users');
const { logger } = require("./config/logger");
require("dotenv").config();
require("./config/db");

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(express.json());

// logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// test route
// app.use("/", testRoute);
// app.use("/db-test", testRoute);

// test users route
app.use("/", userRoutes);


// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
