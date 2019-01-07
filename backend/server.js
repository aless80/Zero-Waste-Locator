import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import mongoose from 'mongoose';
//import Store from './models/store';

// Initialize the application
const app = express();

//Load configurations
const config = require('./config/config.js');

// Passport Config
require('./config/passport')(passport);

// Load routes
const users = require('./routes/users');
const storeroutes = require('./routes/stores.js');

// Get rid of warning thrown by mongoose
mongoose.set('useCreateIndex', true)

//Use mongoose to connect to the stores DB in mongoDB
mongoose.connect(config.mongoStores, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('Connection to the MongoDB database established successfully!');
});

// CORS Middleware
app.use(cors());

// Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport Middleware 
//   *MUST* be after Express Session Middleware
//   if express-session is being used
app.use(passport.initialize());
app.use(passport.session());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//console.log the method and url
app.use(function timeLog (req, res, next) {
  console.log(req.method, req.url)  
  next()
})

// Use routes
app.use('/users', users);
app.use('/stores', storeroutes)

// Establishes which port the backend runs on.
app.listen(config.port, () => console.log(`Express server running on port ${config.port}`));
