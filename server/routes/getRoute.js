const express = require('express'),
  firebase = require('firebase');

const getArrayOfUsers = (data) => {
  return Object.keys(data).map((key) => {
    return data[key];
  });
};

const router = express.Router(),
  config = {
    apiKey: 'AIzaSyAyLQtYUNfRvMG7tqL85kto0Zv9l0H0xxk',
    authDomain: 'postitapp-f266c.firebaseapp.com',
    databaseURL: 'https://postitapp-f266c.firebaseio.com',
    projectId: 'postitapp-f266c',
    storageBucket: 'postitapp-f266c.appspot.com',
    messagingSenderId: '276992209544' };
//  Initialize Database
// firebase.initializeApp(config);

router.get('/getUsers', (req, res) => {
  const ref = firebase.database().ref().child('users');
  // const ref2 = ref.child('"' + userss + '"');
  ref.once('value', (data) => {
    const users = getArrayOfUsers(data.val());
    res.send(users);
  }).catch((error) => {
    res.send(error);
  });
});
module.exports = router;

