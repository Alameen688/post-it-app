const express = require('express'),
  firebase = require('firebase'),
  emailValidation = require('../utils/emailValidation');
// import express from 'express';
// import firebase from 'firebase';
// import emailValidation from '../utils/emailValidation';

const router = express.Router(),
  config = {
    apiKey: 'AIzaSyAyLQtYUNfRvMG7tqL85kto0Zv9l0H0xxk',
    authDomain: 'postitapp-f266c.firebaseapp.com',
    databaseURL: 'https://postitapp-f266c.firebaseio.com',
    projectId: 'postitapp-f266c',
    storageBucket: 'postitapp-f266c.appspot.com',
    messagingSenderId: '276992209544' };
//  Initialize Database
firebase.initializeApp(config);
const auth = firebase.auth(),
  db = firebase.database();

  // Router Controlling Authentication
router.use((err, req, res, next) => {
  //  add real time listner
  auth.onAuthStateChanged((currUser) => {
    if (currUser) {
      res.send('Welcome to PostIt...');
    } else {
      res.status(401);
      res.send('You need to log in first!: ' + res.status(401));
    }
  });
  next();
});
router.post('/signUp', (req, res) => {
  const email = req.body.email,
    password = req.body.password,
    userName = req.body.username;
  let promise;
  if (!emailValidation(email)) {
    res.status(400);
    res.send({ message: 'Please use a valid email address' });
  } else if (password === '') {
    res.status(400);
    res.send({ message: 'Please, you have not entered a password' });
  } else {
    promise = auth.createUserWithEmailAndPassword(email, password)
  .then((user) => {
    user.updateProfile({
      displayName: userName,
    });
    user.sendEmailVerification()
    .then(() => {
      const uid = user.uid;
      db.ref('/users/' + uid).set(
        {
          name: user.displayName,
          id: user.uid
        }
      );
      res.send('Message: User Succesfully created!');
    });
  });
    promise.catch((error) => {
      res.status(400).send({ message: error });
    });
  }
});
 //  end of signUp.post
//  ROUTE THAT  SIGN'S USER IN
router.post('/signIn', (req, res) => {
  const email = req.body.email,
    password = req.body.password;
  auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user.emailVerified === true) {
          const username = user.displayName,
            uid = user.uid;
          res.json({ message: 'User Logged In Successfully!',
            userName: username,
            userUid: uid });
        } else {
          res.send('Please Verify your Account First Thanks');
        }
      })
      .catch((error) => {
        res.status(400).send(error);
      });
});

// ROUTE THAT SIGN'S IN USER WITH GOOGLE PLUS
router.post('/signIn/google', (req, res) => {
  const idToken = req.body.idToken;
  const provider = new firebase.auth.GoogleAuthProvider.credential(idToken);

  firebase.auth().signInWithCredential(provider)
  .then((googleUser) => {
    res.send({ user: googleUser });
  })
  .catch((error) => {
    res.status(401);
    res.send(`Failed to signIn User:${error.message}`);
  });
});

//  ROUTE THAT SIGN'S USER OUT
router.post('/signOut', (req, res) => {
  auth.signOut().then(() => {
  })
.catch((error) => {
  res.send(error.message);
});
  res.send('User signed Out');
});

// ROUTE THAT ALLOWS ONLY LOGGED IN USERS CREATE GROUP
router.post('/group', (req, res) => {
  const currUser = auth.currentUser;
  if (currUser !== null) {
    const dbRef = db.ref('/group'),
      group = req.body.groupName,
      newGroupId = dbRef.push({
        groupName: group,
      }).key;
    db.ref('/users/' + currUser.uid + '/groups').push(
      {
        groupId: newGroupId,
        groupName: group,
      });
    db.ref('group/' + newGroupId + '/users/' + currUser.uid).update({
      id: currUser.uid,
      name: currUser.displayName
    })
      .then(() => {
        res.status(200);
        res.send({ message: 'You Just Created a group called: ' + group });
      }).catch((error) => {
        res.send(error);
      });
  } else {
    res.status(400);
    res.send('Please sign In first!');
  }
});

//  ROUTE THAT ADDS USER TO A GROUP
router.post('/group/:groupId/users', (req, res) => {
  const groupId = req.params.groupId,
    currentUser = auth.currentUser,
    userId = req.body.userId;
  if (currentUser) {
    const promise = db.ref('group/' + groupId + '/users/' + userId).update(
      { id: userId, }
    );
    promise.then(() => {
      res.status(200);
      res.send('Your group has a new User ');
    });
    promise.catch((error) => {
      res.status(400);
      res.send(error.message);
    });
  } else {
    res.status(401);
    res.send('You need to be signed In');
  }
});

// ROUTE THAT ALLOWS USERS POST MESSAGES
router.post('/message/:groupId', (req, res) => {
  const message = req.body.message,
    currUser = auth.currentUser,
    groupId = req.params.groupId;
  if (currUser) {
    const userId = currUser.uid;
    const messagekey = db.ref('messages/' + groupId).push(
      { id: userId,
        messageBody: {
          message
        }
      }
    ).key;
    const promise = db.ref('group/' + groupId + '/messages').push({
      id: userId,
      messageKey: messagekey
    }
    ).then(() => {
      res.status(200);
      res.send('Your message was posted successfully!');
    });
    promise.catch((error) => {
      res.status(400);
      res.send({ message: 'Unfortunately,Your message was not posted' },
       error.message);
    });
  } else {
    res.status(401);
    res.send({ message: 'You need to be signed In' });
  }
});

module.exports = router;
