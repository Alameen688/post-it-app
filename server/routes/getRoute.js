const express = require('express'),
  firebase = require('firebase');

const getArray = (data) => {
  return Object.keys(data).map((key) => {
    return data[key];
  });
};

const router = express.Router();

router.get('/getUsers', (req, res) => {
  const ref = firebase.database().ref().child('users');
  ref.once('value', (data) => {
    const users = getArray(data.val());
    res.send(users);
  }).catch((error) => {
    res.send(error);
  });
});

router.get('/getGroup', (req, res) => {
  const ref = firebase.database().ref().child('group');
  ref.once('value', (data) => {
    const groups = getArray(data.val());
    res.send(groups);
  }).catch((error) => {
    res.send(error);
  });
});
module.exports = router;

