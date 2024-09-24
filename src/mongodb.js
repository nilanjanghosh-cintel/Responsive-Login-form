const mongoose = require("mongoose");

// Use the environment variable for the MongoDB connection string
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongoose connected');
  })
  .catch((e) => {
    console.error('Connection failed', e);
  });

const logInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const LogInCollection = mongoose.model('LogInCollection', logInSchema);

module.exports = LogInCollection;

