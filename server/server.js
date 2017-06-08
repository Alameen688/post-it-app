const express = require('express'),
  bodyParser = require('body-parser'),
  route = require('./routes/route');
// import express from 'express';
// import bodyParser from 'body-parser';
// import route from './routes/route';

const port = process.env.PORT || 9999,
  app = express();

// for parsing application/x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended: true }));
 // for parsing application/json)
app.use(bodyParser.json());

// Add headers
app.use((req, res, next) => {
    // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods',
  'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers',
  'X-Requested-With,content-type, Authorization');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});


  //  Welcome
app.get('/', (req, res, next) => {
  res.status(200);
  res.send('Hello');
  next();
});

//  Register Our ROUTES
// All of our routes will be prefixed with /server
app.use(route);
app.listen(port);
console.log('postIt App Restful Api server started on: ' + port);
