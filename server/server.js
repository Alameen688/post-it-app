const express = require('express'),
  bodyParser = require('body-parser'),
  routes = require('./routes/'),
  getRoute = require('./routes/getRoute'),
  firebase = require('firebase');
// import express from 'express';
// import bodyParser from 'body-parser';
// import route from './routes/route';
const port = process.env.PORT || 9999;

const app = express();
app.listen(port);

// for parsing application/x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended: true }));
 // for parsing application/json)
app.use(bodyParser.json());

// Add headers
app.use((req, res, next) => {
    // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods',
  'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers',
  'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
const config = {
  apiKey: 'AIzaSyAyLQtYUNfRvMG7tqL85kto0Zv9l0H0xxk',
  authDomain: 'postitapp-f266c.firebaseapp.com',
  databaseURL: 'https://postitapp-f266c.firebaseio.com',
  projectId: 'postitapp-f266c',
  storageBucket: 'postitapp-f266c.appspot.com',
  messagingSenderId: '276992209544' };
//  Initialize Database
firebase.initializeApp(config);

//  Welcome
app.get('/', (req, res, next) => {
  res.status(200);
  res.send('Hello');
  next();
});
//  Register Our ROUTES
routes(app, firebase);

console.log('postIt App Restful Api server started on: ' + port);
