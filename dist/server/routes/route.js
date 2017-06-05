'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(),
    config = {
  apiKey: 'AIzaSyAyLQtYUNfRvMG7tqL85kto0Zv9l0H0xxk',
  authDomain: 'postitapp-f266c.firebaseapp.com',
  databaseURL: 'https://postitapp-f266c.firebaseio.com',
  projectId: 'postitapp-f266c',
  storageBucket: 'postitapp-f266c.appspot.com',
  messagingSenderId: '276992209544' };

//  Initialize Database
_firebase2.default.initializeApp(config);
var auth = _firebase2.default.auth(),
    db = _firebase2.default.database();

// Router Controlling Authentication
router.use(function (err, req, res, next) {
  //  add real time listner
  auth.onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
      res.send('Welcome to PostIt...');
    } else {
      res.status(401);
      res.send('You need to log in first!: ' + res.status(401));
    }
  });
  next();
});
router.post('/signUp', function (req, res) {
  var email = req.body.email,
      password = req.body.password,
      userName = req.body.username,
      promise = auth.createUserWithEmailAndPassword(email, password).then(function (user) {
    user.updateProfile({
      displayName: userName
    }).then(function () {
      db.ref('/users/' + userName).update({
        userId: user.uid
      });
      res.send('Message: User Succesfully created!');
    });
  });
  promise.catch(function (error) {
    res.status(400);
    res.send(error.message);
  });
}); //  end of signUp.post

//  ROUTE THAT CREATES SIGN'S USER IN
router.post('/signIn', function (req, res) {
  var email = req.body.email,
      password = req.body.password,
      promise = auth.signInWithEmailAndPassword(email, password).then(function () {
    res.send('user logged in successfully');
  });
  promise.catch(function (error) {
    res.status(400);
    res.send(error.message);
  });
});
//  ROUTE THAT SIGN'S USER OUT
router.post('/signOut', function (req, res) {
  auth.signOut().then(function () {}).catch(function (error) {
    res.send(error.message);
  });
  res.send('User signed Out');
});

// ROUTE THAT ALLOWS ONLY LOGGED IN USERS CREATE GROUP
router.post('/group', function (req, res) {
  var currUser = _firebase2.default.auth().currentUser;
  if (currUser) {
    var dbRef = db.ref('/group'),
        group = req.body.groupName,
        newGroupId = dbRef.push({
      groupName: group,
      createdBy: currUser.uid
    }).key;
    db.ref('/users/' + currUser.displayName + '/groups').push({
      groupId: newGroupId,
      groupName: group
    });
    res.status(200);
    res.send('You Just Created a group called: ' + group);
  } else {
    res.status(400);
    res.send('You need to be signed In');
  }
});

//  ROUTE THAT ADDS USER TO A GROUP
router.post('/group/:groupId/users', function (req, res) {
  var currUser = _firebase2.default.auth().currentUser,
      groupId = req.params.groupId,
      userId = req.body.userId;
  if (currUser) {
    var promise = db.ref('group/' + groupId + '/users').push({ UserId: userId });
    promise.then(function () {
      res.status(200);
      res.send('Your group has a new User ');
    });
    promise.catch(function (error) {
      res.status(400);
      res.send(error.message);
    });
  } else {
    res.status(401);
    res.send('You need to be signed In');
  }
});

// ROUTE THAT ALLOWS USERS POST MESSAGES
router.post('/message/:groupId', function (req, res) {
  var currUser = _firebase2.default.auth().currentUser,
      message = req.body.message,
      groupId = req.params.groupId;
  if (currUser) {
    var userId = currUser.uid;
    var messagekey = db.ref('messages/' + groupId).push({ userId: userId,
      messageBody: {
        message: message
      }
    }).key;
    var promise = db.ref('group/' + groupId + '/messages').push({
      userId: userId,
      messageKey: messagekey
    }).then(function () {
      res.status(200);
      res.send('Your message was posted successfully!');
    }).catch(function (error) {
      res.status(400);
      res.send('Unfortunately,Your message was not posted');
    });
  } else {
    res.status(401);
    res.send('You need to be signed In');
  }
});

module.exports = router;