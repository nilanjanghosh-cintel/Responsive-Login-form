const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongodb");
const hbs = require("hbs")
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            password: req.body.password
        };

        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking && checking.password === req.body.password) {
            return res.send("User details already exist");
        } else {
            await LogInCollection.insertMany([data]);
        }

        res.status(201).render("home", {
            naming: req.body.name
        });
    } catch (error) {
        console.error("Error occurred during signup:", error);
        res.send("Wrong inputs");
    }
});

app.get('/', (req, res) => {
    res.render('login', { errorMessage: null }); // Ensure no error message on initial load
});

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (check && check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.name}`, successMessage: "Login successful!" });
        } else {
            res.render("login", { errorMessage: "Incorrect password" });
        }
    } catch (error) {
        console.error("Error occurred during login:", error);
        res.render("login", { errorMessage: "Wrong details" });
    }
});



app.listen(port, () => {
    console.log('Port connected');
});
