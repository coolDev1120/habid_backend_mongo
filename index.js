// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');

const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// get config vars
dotenv.config();
app.use(cors());

app.use(express.static('public'));
app.use('/public', express.static('public'));

app.use(express.json());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(router);

/** Connect to Mongo*/
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('🚀 Connected to MongoDB successfully.');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  throw err;
});

app.listen(3090);
console.log('Server listening on:', 3090);
