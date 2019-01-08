'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();



//Setting the maximum number of users to 10

const MAX_LOG_COUNT = 10;


exports.truncate = functions.database.ref('/users/{user_id}').onWrite(async (change) => {
    const parentRef = change.after.ref.parent;
    const snapshot = await parentRef.once('value');

    

    if (snapshot.numChildren() >= MAX_LOG_COUNT) {
      let childCount = 0;
      const updates = {};
      snapshot.getPriority()
      snapshot.forEach((child) => {
        if (++childCount <= snapshot.numChildren() - MAX_LOG_COUNT) {
          updates[child.key] = null;
        }
      });


      return parentRef.update(updates);
    }
    return null;
  });

