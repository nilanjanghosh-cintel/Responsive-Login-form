const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const LogInCollection = require("./mongodb"); // Ensure this is the correct path to your MongoDB model
const hbs = require("hbs");
const port = process.env.PORT || 3000;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI; // Ensure this is set in your environment variables
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongoose connected');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up view engine and paths
const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

// Render signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Render login page
app.get('/', (req, res) => {
    res.render('login', { errorMessage: null }); // Ensure no error message on initial load
});

// Handle signup
app.post('/signup', async (req, res) => {
    try {
        const { name, password } = req.body; // Destructure for clarity

        // Check if the user already exists
        const existingUser = await LogInCollection.findOne({ name });
        if (existingUser) {
            return res.send("User details already exist"); // Changed response for clarity
        }

        // Create new user
        const newUser = new LogInCollection({ name, password });
        await newUser.save(); // Use save() instead of insertMany for a single document

        res.status(201).render("home", {
            naming: name
        });
    } catch (error) {
        console.error("Error occurred during signup:", error);
        res.status(500).send("An error occurred during signup"); // More specific error message
    }
});

// Handle login
app.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body; // Destructure for clarity

        const user = await LogInCollection.findOne({ name });
        if (user && user.password === password) {
            res.status(200).render("home", { naming: name, successMessage: "Login successful!" });
        } else {
            res.render("login", { errorMessage: "Incorrect password" });
        }
    } catch (error) {
        console.error("Error occurred during login:", error);
        res.render("login", { errorMessage: "Wrong details" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
