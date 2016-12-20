angular.module('starter.factories', ['ionic', 'firebase', 'ngResource', 'ng-file-model'])

  // .factory('Auth', function($firebaseAuth, $firebaseObject) {
  //     var endPoint = "project-6890719673233979667.firebaseapp.com";
  //     var usersRef = new Firebase(endPoint);
  //     return $firebaseAuth(usersRef);
  // })
  .factory('backBlaze', ['$resource', function ($resource) {

      return {
          START: $resource("http://localhost:3000/api/backblaze/upload", {}, {
              UPLOAD: {
                  method: 'post',
                  isArray: false
              }
          }),
          ALL: $resource("http://localhost:3000/api/backblaze/allmedia", {}, {
              MEDIA: {
                  method: 'get',
                  isArray: false
              }
          })

      };
  }])
  .service('Authkey', function () {
      var authkey = "bllHFui4Kea1pcxh3q9sOvbBrfH3";
      var username = "Ryan Amundson";
      var id = "";
      var user = {};

      var loc = "";
      var following = {};
      var followers = {};


      return {
          getUserData: function () {
              return user;
          },
          setUserData: function (User) {
              user = User;
          },
          clearUserData: function () {
              user = {};
          },
          getAuthKey: function () {
              return authkey;
          },
          setAuthKey: function (key) {
              authkey = key;
          },
          resetAuthKey: function () {
              authkey = "";
          },
          setUserName: function (name) {
              username = name;
          },
          getUserName: function () {
              return username;
          },
          clearUserName: function () {
              username = "";
          },
          setUserId: function (num) {
              id = num;
          },
          getUserId: function () {
              return id;
          },
          clearUserId: function () {
              id = "";
          },
          setUserLocation: function (Loc) {
              loc = Loc;
          },
          getUserLocation: function () {
              return loc;
          },
          clearUserLocation: function () {
              loc = "";
          }
      };
  })
.factory('Messenger', ['$firebaseObject', function ($firebaseObject) {

    //object returned
    var messenger = {};
    //this = messenger;
    //references
    var database = firebase.database();
    var conversationsRef = database.ref('messaging/conversations/');
    var metaRef = database.ref('messaging/meta/');
    var peopleRef = database.ref('messaging/people/');
    var usersRef = database.ref('users');

    //create new conversation
    messenger.createConversation = function (creatorID, recipientID) {

        var newConversationKey = conversationsRef.push().key;
        console.log(newConversationKey);
        Promise.all([usersRef.child(creatorID).child('username').once('value'), usersRef.child(recipientID).child('username').once('value')]).then(function (result) {
            console.log(result[0].val());
            
            var conversationData = {
                'creator': {
                    'ID': creatorID,
                    'name': result[0].val()
                },
                'recipient': {
                    'ID': recipientID || 'none',
                    'name': result[1].val()
                }
            };

            var updates = {};
            updates['/messaging/conversations/' + newConversationKey] = "true";
            updates['/users/' + creatorID + '/messagelist/' + newConversationKey] = conversationData;
            updates['/users/' + recipientID + '/messagelist/' + newConversationKey] = conversationData || 'true';

            firebase.database().ref().update(updates);
            

        });
        return newConversationKey;

    };
    messenger.deleteConversation = function (conversationID, userID, recipientID) {

        var updates = {};
        updates['/messaging/conversations/' + conversationID] = null;
        updates['/users/' + userID + '/messagelist/' + conversationID] = null;
        updates['/users/' + recipientID + '/messagelist/' + conversationID] = null;

        return firebase.database().ref().update(updates);


    };

    messenger.getConversations = function (userID) {
        return usersRef.child(userID).child('messagelist').once('value').then(function (snapshot) {
            return snapshot.val();
        });
    };


    //==================================================================//
    //get reference to messages of a conversation
    messenger.getMessagesRef = function (conversationID) {
        return conversationsRef.child(conversationID);
    };

    var getRecipientID = function (conversationID, senderID) {
        return usersRef.child(senderID).child('messagelist').child(conversationID).child('recipient').child('ID').once('value').then(function (snapshot) {
            console.log(snapshot.val());
            return snapshot.val();
        });
    };

    //send a new message
    messenger.sendMessage = function (conversationID, senderID, senderName, content) {

        console.log(content);
        var timeSent = new Date().getTime();
        var newMessageKey = conversationsRef.child(conversationID).push().key;
        var messageData = {
            author: senderName,
            id: senderID,
            content: content,
            timestamp: timeSent,
            messageID: newMessageKey
        };

        getRecipientID(conversationID, senderID).then(function (recipientID) {
            console.log(recipientID);
            var updates = {};
            console.log(conversationID);
            updates['/messaging/conversations/' + conversationID + '/' + newMessageKey] = messageData;
            updates['/users/' + senderID + '/messagelist/' + conversationID + '/lastmessage'] = messageData;
            updates['/users/' + recipientID + '/messagelist/' + conversationID + '/lastmessage'] = messageData;

            return firebase.database().ref().update(updates);

        });

    };

    //delete a message
    messenger.deleteMessage = function (conversationID, MessageID) {
        var updates = {};
        updates['/messaging/conversations/' + conversationID + '/' + MessageID] = null;

        return firebase.database().ref().update(updates);

    };




    return messenger;


}])
.service('MessengerService', ['$firebaseObject', '$q', function ($firebaseObject, $q) {
    var db = firebase.database();
    var usersRef = db.ref('users');
    var conversationsRef = db.child('conversations');
    var currentUsersRef = {};
    var currentUsersConversationsRef = "";

    this.init = function (userID) {
        currentUsersRef = usersRef.child('recipientID');
        currentUsersConversationsRef = currentUsersRef.child('messagelist');



    };
    this.getMyConversations = function () {
        return currentUsersConversationsRef;
    };

    this.getConversation = function (conversationID) {
        return conversationsRef.child(conversationID);
    };
    function getUser(userID) {
        return usersRef.child(userID).once('value');
    }

    /*========================================*/
    //Conversations                           //
    /*========================================*/
    function checkExistingConversation(senderID, recipientID) {

        conversationsRef.orderByChild('')

        Promises.all([getUser(senderID), getUser(recipientID)]).then(function () {
            console.log(result);
            return 



        });


    }

    this.createNewConversation = function (senderID, recipientID) {
        var newConversationID = "";

        return newConversationID;
    };
    this.deleteConversation = function (conversationID) {
        //return success or failure

    };

    /*========================================*?
    //Messages                                //
    /*========================================*/
    this.sendMessage = function () {


    };

    return MS;

}])
.filter('orderObjectBy', function () {
    return function (items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
});
