// Common Importing Statements
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require("cors");
const fs = require("fs");
const mysql = require('mysql2');

// Routes
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notifyRoutes');
const commonRoutes = require('./routes/commonRoutes');

// Controller
const pushnotificationController = require("./controllers/pushnotificationController");
const { init, initDept, initcommon, initcollege } = require('./controllers/initializeDb');
const { getDeptCount } = require('./controllers/commonController');

// Initializing
const app = express();
dotenv.config();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('MySQL connection established');

    // Create database if it doesn't exist
    const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``;
    db.query(createDatabaseQuery, (err) => {
        if (err) {
            console.error('Error creating database:', err.message);
            return;
        }
        console.log(`Database "${process.env.DB_NAME}" is ready or already exists`);

        // Connect to the newly created or existing database
        const dbConnection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Check if the connection to the database is successful
        dbConnection.connect(err => {
            if (err) {
                console.error('Error connecting to the database:', err.message);
                return;
            }
            console.log(`Connected to the database: "${process.env.DB_NAME}"`);

            // Start your server after the database connection is successful
            startServer(dbConnection);
        });
    });
});

// Function to start the server
const startServer = (dbConnection) => {
    // Default route
    app.get('/', (req, res) => {
        res.send("Kec App Server");
    });

    const baseUrl = '/v2';

    // Default route for base URL
    app.get(baseUrl + '/', (req, res) => {
        res.send(`Kec App Server @  ${baseUrl}`);
    });

    // Read data from JSON file
    const readData = async (fn) => {
        fs.readFile("data.json", function (err, data) {
            if (err) throw err;
            const cardData = JSON.parse(data);
            fn(cardData);
        });
    };

    // Write data to JSON file
    const writeData = async (newdata) => {
        fs.writeFile("data.json", JSON.stringify(newdata), err => {
            if (err) throw err;
            console.log("Done writing");
        });
    };

    // Display card data
    app.get(baseUrl + '/displaycard', async (req, res) => {
        try {
            fs.readFile("data.json", function (err, data) {
                if (err) throw err;
                const cardData = JSON.parse(data);
                res.status(200).json(cardData);
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });

    // Add display card
    app.post(baseUrl + '/add/displaycard', async (req, res) => {
        try {
            fs.readFile("data.json", async function (err, data) {
                if (err) throw err;
                const cardData = JSON.parse(data);
                console.log(cardData);
                const newdata = {
                    id: cardData.length,
                    name: req.body.name,
                    url: req.body.url,
                    icon: req.body.icon
                };
                cardData.push(newdata);
                fs.writeFile("data.json", JSON.stringify(cardData), err => {
                    if (err) throw err;
                    console.log("Done writing");
                    res.status(200).json("Successfully Added");
                });
            });

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });

    // Common Routes
    app.use(baseUrl + "/common", commonRoutes);

    // User Routes
    app.use(baseUrl + "/user", userRoutes);

    // Notification Routes
    app.post(baseUrl + "/pushnotify", pushnotificationController.SendNotificationToDevice);
    app.use(baseUrl + "/notify", notificationRoutes);

    // DB Init
    app.get(baseUrl + "/initCommon", initcommon);
    app.get(baseUrl + "/initCollege", initcollege);
    app.post(baseUrl + "/initDept", initDept);
    app.get(baseUrl + "/deptcount", getDeptCount);

    // Listening port
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
        console.log(`Server is running at Port ${PORT}`);
    });
};
