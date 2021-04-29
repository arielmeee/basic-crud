require('./model/mongodb');

// Import the necessary packages
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session)
var app = express();
const path = require('path');
const exphb = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');

// Initializing session to store inside DB
const store = new mongoDbSession({
    uri: 'mongodb://localhost:27017/Course-Management',
    collection: 'sessions'
});

// Setting up session
app.use(session({
    secret: 'Key', // The key that will sign the cookie
    resave: false, // Prevents to create new session for every request
    saveUninitialized: false, // If session is not modified or initialized, dont save
    store: store
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuring Express middleware for the handlebars
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphb({ handlebars: allowInsecurePrototypeAccess(Handlebars), extname: 'hbs', defaultLayout: 'mainLayout', layoutDir: __dirname + 'views/layouts/' }));
app.set('view engine', 'hbs');

// Establish the server connection
// PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

// Set authentication controller
const authController = require('./controller/authController');
app.use('/', authController);

// Set the Controller path which will be responding the user actions
const courseController = require('./controller/courseController');
app.use('/course', courseController);