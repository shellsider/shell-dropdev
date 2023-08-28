//3rd Party Imports
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(`UNCAUGHT EXCEPTION! Shutting Down!`);
  process.exit(1);
});

//DOTENV Path Configeration
dotenv.config({ path: './config.env' });

//Self Mmodule Imports
const app = require('./app.js');

//Establishing Mongoose Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`DB Connection Established!`));

//Setting up Server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on PORT: ${process.env.PORT}`);
});

// Unhandled Rejected Promises
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDLED REJECTION! Shutting Down!`);
  server.close(() => {
    process.exit(1);
  });
});
