require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");
const path = require("path");
const bodyParser = require('body-parser');
const routes = require('./routes/index');

// Setting up port
const connUri = process.env.MONGO_LOCAL_CONN_URL;
let PORT = process.env.PORT || 3000;

//=== 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(function(req, res, next) {
  if (req.method == 'POST' || req.method == 'PUT' || req.method == 'DELETE'){

    console.log("==== req.method ====")
    console.log(req.method)

    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'No credentials sent!' });
    } else {
      if(!(req.headers.authorization == `xx Umaaah haaalaaa ${process.env.CLIENT_SECRET} haaalaaa Umaaah xx`)){
        return res.status(403).json({ error: 'Invalid token!' });
      }
    }
  }
  next();
});


//=== 4 - CONFIGURE ROUTES
//Configure Route

app.use('/api', routes);

// Front Site Build Path
app.use('/', express.static(path.join(__dirname, '../build')))
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//=== 2 - SET UP DATABASE
//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.connect(connUri, { useNewUrlParser: true });

const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB --  database connection established successfully!'));
connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

app.use(passport.initialize());
require("./middlewares/jwt")(passport);


//=== 5 - START SERVER
app.listen(PORT, () => console.log('Server running on http://localhost:'+PORT+'/'));
