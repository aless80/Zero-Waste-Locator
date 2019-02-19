const express = require("express");
const path = require('path')
const cors = require('cors');
const  bodyParser = require('body-parser');
const  passport = require('passport');
const  mongoose = require('mongoose');
const  helmet = require('helmet');
const  compression = require('compression');

// Initialize the application
const app = express();

// Helmet to secure Express
app.use(helmet());

//Compress all routes
app.use(compression());

//Load configurations
const config = require('./config/config.js');

// Passport Config
require('./config/passport')(passport);

// Load routes
const users = require('./routes/users.routes');
const storeroutes = require('./routes/stores.routes.js');

// Get rid of warning thrown by mongoose
mongoose.set('useCreateIndex', true)

//Use mongoose to connect to the stores DB in mongoDB
mongoose.connect(config.mongoDB, { useNewUrlParser: true });
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

// Static Folders
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

//console.log the method and url
app.use(function logger (req, res, next) {
  console.log(req.method, req.url)  
  next()
})

// Use routes
app.use('/', users);
app.use('/', storeroutes)

// Serve Angular's static assets
if (process.env.NODE_ENV == 'production') {
  // Set static folder
  app.use(express.static("../dist/"));
  // Any request that is not the /users/ or /stores/ above goes to Angular client
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist','index.html')); 
  });
}

// Establishes which port the backend runs on.
app.listen(config.port, () => {
  console.log(`Express server running with NODE_ENV=${process.env.NODE_ENV} on port ${config.port}`)
  if (typeof process.env.MAILER_EMAIL_ID == 'undefined') {
    console.log("To be able to send emails to users please remember to set environment variables in .env");
  }
});