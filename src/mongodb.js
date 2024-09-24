const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://localhost:27017/LoginFormPractice", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Mongoose connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err.message);
  });

// Define the schema for the login collection
const logInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving to the database
logInSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Create the model
const LogInCollection = mongoose.model("LogInCollection", logInSchema);

module.exports = LogInCollection;
