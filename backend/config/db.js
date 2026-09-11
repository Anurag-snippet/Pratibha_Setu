const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pratibha_setu';

  try {
    // Event listeners
    mongoose.connection.on('connected', () => {
      console.log(`[MongoDB] Successfully connected to database: ${mongoose.connection.name}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Connection lost / disconnected');
    });

    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error(`[MongoDB] Initial connection failure: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
