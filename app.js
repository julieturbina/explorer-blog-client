require('dotenv').config();
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);
var cors = require('cors');

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const User     = require('./models/user');
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const flash = require("connect-flash");

const bcrypt     = require("bcrypt");
const saltRounds = 10;

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/explorer-blog', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
app.use(cors());

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: "explorer-blog",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// app.use(passport.initialize());
// app.use(passport.session());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Explorer Blog';

//Routes
const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes);


//==========COMMENTED TO TEST EVENTROUTE BELOW============
const eventRoutes = require('./routes/event-route');
app.use('/', eventRoutes);

// const eventApi  = require('./routes/event-api');
// app.use('/api', eventApi);



const index = require('./routes/index');
app.use('/', index);


module.exports = app;

