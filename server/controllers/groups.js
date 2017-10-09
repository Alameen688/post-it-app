import firebase from 'firebase';
import getArray from '../utils/getArray';
import SendNotification from '../utils/sendNotifications';

/**
 * This Controller file exports all controllers for the group 
 * endpoints
 * @param {*} req 
 * @param {*} res 
 */

// ============Controller for Creating Groups ============

export const createGroup = (req, res) => {
  // const currUser = firebase.auth().currentUser;
  const userUid = req.body.userId;
  const userName = req.body.userName;
  if (userUid !== null) {
    const dbRef = firebase.database().ref('/group'),
      group = req.body.groupName,
      newGroupId = dbRef.push({
        groupName: group,
      }).key;
    firebase.database().ref(`/users/${userUid}/groups`).push(
      {
        groupId: newGroupId,
        groupName: group,
        isAdmin: true
      });
    firebase.database().ref(`group/${newGroupId}/users/${userUid}`)
      .update({
        id: userUid,
        name: userName
      })
      .then(() => {
        res.status(200);
        res.send({ message: `You Just Created a group called:${group}` });
      })
      .catch((error) => {
        res.send({ error: error.message });
      });
  } else {
    res.status(400);
    res.send({ error: 'Please sign In first!' });
  }
};

//  ============ Controller that Gets all groups created  ============
export const getGroups = (req, res) => {
  const userUid = req.params.userUid;
  const ref = firebase.database().ref(`users/${userUid}/groups`);
  ref.once('value', (data) => {
    const groupList = data.val();
    if (groupList === null) {
      res.status(404)
        .send({ error: 'You do not belong to any group yet' });
    } else {
      const groups = getArray(groupList);
      res.status(200)
        .send({ message: 'groups fetched successfully!', group: groups });
    }
  }).catch((error) => {
    res.status(500)
      .send({ error: error.message });
  });
};

// ===========controller gets the users in a particular group ============
export const getGroupUsers = (req, res) => {
  const groupId = req.params.groupId;
  const ref = firebase.database().ref(`group/${groupId}/users`);
  const ref1 = firebase.database().ref().child('users');
  ref.once('value', (users) => {
    const groupUsers = users.val();
    if (groupUsers === null) {
      res.status(404)
        .send({ error: 'This group has no user yet!' });
    } else {
      const newArr = getArray(groupUsers);
      ref1.once('value', (users2) => {
        const usersGotten = users2.val();
        if (users2 !== null) {
          const allUsers = getArray(usersGotten);
          const filtered = allUsers.filter(userInAllUsers => !newArr.some(
            userInGroup => userInAllUsers.id === userInGroup.id)
          );
          res.status(200)
            .send({
              message: 'Users fetched successfully',
              groupUser: filtered
            });
        }
      })
        .catch((error) => {
          res.status(400)
            .send({ error: error.message });
        });
    }
  });
};

//  ============ Controller that get's Messages ============
export const getMessages = (req, res) => {
  const groupId = req.params.groupId;
  const ref = firebase.database().ref(`/messages/${groupId}`);
  ref.once('value', (msgData) => {
    const mesResponse = msgData.val();
    if (mesResponse !== null) {
      const messages = getArray(mesResponse);
      res.status(200)
        .send({ messages });
    } else {
      res.status(404)
        .send({ error: 'There are no Messages!' });
    }
  })
    .catch((error) => {
      res.send({ error: error.message });
    });
};

//  ============ Controller that post's messages ============
export const postMessage = (req, res) => {
  const { message, priority, groupId, userId, userName } = req.body;
  // const currUser = firebase.auth().currentUser;
  if (userId) {
    const messagekey = firebase.database().ref(`messages/${groupId}`)
      .push({
        id: userId,
        name: userName,
        messages: message,
        Priority: priority
      }).key;
    const promise = firebase.database().ref(`group/${groupId}/messages`)
      .push({
        id: userId,
        messageKey: messagekey
      })
      .then(() => {
        if (priority === 'Urgent' || priority === 'Critical') {
          SendNotification(groupId, priority);
        }
        res.status(200)
          .send({ message: 'Your message was posted successfully!' });
      });
    promise.catch((error) => {
      res.status(400)
        .send({ error: error.message });
    });
  } else {
    res.status(401);
    res.send({ error: 'You need to be signed In' });
  }
};

//  ============Controller Get's All Users  ============
export const getAllUsers = (req, res) => {
  const ref = firebase.database().ref().child('users');
  ref.once('value', (data) => {
    const users = getArray(data.val());
    res.status(200)
      .send(users);
  }).catch((error) => {
    res.send({ error: error.message });
  });
};
//  ============Controller Adds user to group ============ 
export const addUser = (req, res) => {
  const { groupName, name, userId } = req.body;
  const groupId = req.params.groupId;
  if (userId) {
    const promise = firebase.database()
      .ref(`/group/${groupId}/users/${userId}`)
      .update({
        id: userId,
        name
      });
    firebase.database().ref(`/users/${userId}/groups`).push(
      {
        groupId,
        groupName,
        isAdmin: false
      });
    promise.then(() => {
      res.status(200);
      res.send({ message: 'Your group has a new User ' });
    });
    promise.catch((error) => {
      res.status(400);
      res.send({ error: error.message });
    });
  } else {
    res.status(401);
    res.send({ error: 'You need to be signed In' });
  }
};
