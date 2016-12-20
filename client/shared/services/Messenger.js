
(function () {
    'use strict';

    angular
        .module('app.shared')
        .factory('Messenger', Messenger);

    Messenger.$inject[''];

    function Messenger() {


        var database = firebase.database();
        var conversationsRef = database.ref('messaging/conversations/');
        var metaRef = database.ref('messaging/meta/');
        var peopleRef = database.ref('messaging/people/');
        var usersRef = database.ref('users');

        var messenger = {
            /*Attributes*/
            /*Conversations*/
            createConversation: createConversation,
            deleteConversation: deleteConversation,
            getConversations: getConversations,
            /*Messages*/
            sendMessage: createMessage,
            deleteMessage: deleteMessage,
            getMessages: getMessagesRef,
            /*Shared*/
            readLastMessage: readLastMessage
        };

        return messenger;

        //////////////////////////////////

        function getConversations(userID) {
            return usersRef.child(userID + '/messagelist/').orderByChild('lastmessage');
        }

        function getRecipientID(conversationID, senderID) {
            return usersRef.child(senderID + '/messagelist/' + conversationID + '/recipient/ID').once('value').then(function (snapshot) {
                console.log(snapshot.val());
                return snapshot.val();
            });
        }


        function createConversation(creatorID, recipientID) {
            var key = conversationsRef.push().key;

            Promise.all([usersRef.child(creatorID).once('value'),
                         usersRef.child(recipientID).once('value')])
            .then(function (result) {
                var metaData = {
                    'creator': {
                        'uid': result[0].key,
                        'username': result[0].val().username
                    },
                    'recipient': {
                        'uid': result[1].key,
                        'username': result[1].val().username
                    }
                };

                var updates = {};
                updates['/messaging/meta/' + key] = metaData;
                updates['/messaging/conversations/' + key] = metaData;
                return firebase.database().ref().update(updates);


            }).then(function () {
                console.log('new conversations added to meta');
            }).catch(function (error) {
                console.log(error);
            });

            return key;

        };

        function deleteConversation(conversationID, userID, recipientID) {

            var updates = {};
            updates['/messaging/conversations/' + conversationID] = null;
            updates['/users/' + userID + '/messagelist/' + conversationID] = null;
            updates['/users/' + recipientID + '/messagelist/' + conversationID] = null;

            return firebase.database().ref().update(updates);


        }

        //function getConversations(userID) {
        //    return usersRef.child(userID).child('messagelist').once('value').then(function (snapshot) {
        //        return snapshot.val();
        //    });
        //}

        function getMessagesRef(conversationID) {
            return conversationsRef.child(conversationID);
        }

        function getMetaData(conversationID) {
            return metaRef.child(conversationID).once('value').then(function (snapshot) {
                return snapshot.val();
            });

        }        

        function createMessage(conversationID, senderID, senderName, content) {

            var timeSent = new Date().getTime();
            var newMessageKey = conversationsRef.child(conversationID).push().key;
            var messageData = {
                author: senderName,
                id: senderID,
                content: content,
                timestamp: timeSent,
                messageID: newMessageKey,
                read: false
            };
            getMetaData(conversationID).then(function (metaData) {

                var conversationData = metaData;
                conversationData.lastmessage = messageData;


                var updates = {};
                updates['/messaging/conversations/' + conversationID + '/' + newMessageKey] = messageData;
                updates['/messaging/meta/' + conversationID + '/lastmessage/'] = messageData;
                updates['/users/' + metaData.recipient.uid + '/messagelist/' + conversationID] = conversationData;
                updates['/users/' + metaData.creator.uid + '/messagelist/' + conversationID] = conversationData;

                return firebase.database().ref().update(updates);
            });

        }

        function deleteMessage(conversationID, MessageID) {
            var updates = {};
            updates['/messaging/conversations/' + conversationID + '/' + MessageID] = null;
            return firebase.database().ref().update(updates);
        }

        function readLastMessage(conversationID, userID) {
            var updates = {};
            updates['/users/' + userID + '/messagelist/' + conversationID + '/lastmessage/read'] = true;
            return firebase.database().ref().update(updates);
        }
    }
})();

//.factory('Messenger', ['$firebaseObject', function ($firebaseObject) {

//    //object returned
//    var messenger = {};

//    var database = firebase.database();
//    var conversationsRef = database.ref('messaging/conversations/');
//    var metaRef = database.ref('messaging/meta/');
//    var peopleRef = database.ref('messaging/people/');
//    var usersRef = database.ref('users');

//    messenger.getConversationsList = function (userID) {
//        return usersRef.child(userID).child('messagelist').orderByChild('lastmessage');
//    };

//    var getRecipientID = function (conversationID, senderID) {
//        return usersRef.child(senderID).child('messagelist').child(conversationID).child('recipient').child('ID').once('value').then(function (snapshot) {
//            console.log(snapshot.val());
//            return snapshot.val();
//        });
//    };

//    messenger.createNewConversation = function (creatorID, recipientID) {
//        return conversationsRef.push().key;
//    };
//    messenger.createConversation = function (creatorID, recipientID) {

//        var newConversationKey = conversationsRef.push().key;
//        Promise.all([usersRef.child(creatorID).child('username').once('value'),
//                    usersRef.child(recipientID).child('username').once('value')])
//            .then(function (result) {

//            var conversationData = {
//                'creator': {
//                    'ID': creatorID,
//                    'name': result[0].val()
//                },
//                'recipient': {
//                    'ID': recipientID || 'none',
//                    'name': result[1].val()
//                }
//            };

//            var updates = {};
//            updates['/messaging/conversations/' + newConversationKey] = "true";
//            updates['/users/' + creatorID + '/messagelist/' + newConversationKey] = conversationData;
//            updates['/users/' + recipientID + '/messagelist/' + newConversationKey] = conversationData || 'true';

//            firebase.database().ref().update(updates);


//        });
//        return newConversationKey;

//    };

//    messenger.deleteConversation = function (conversationID, userID, recipientID) {

//        var updates = {};
//        updates['/messaging/conversations/' + conversationID] = null;
//        updates['/users/' + userID + '/messagelist/' + conversationID] = null;
//        updates['/users/' + recipientID + '/messagelist/' + conversationID] = null;

//        return firebase.database().ref().update(updates);


//    };

//    messenger.getConversations = function (userID) {
//        return usersRef.child(userID).child('messagelist').once('value').then(function (snapshot) {
//            return snapshot.val();
//        });
//    };

//    messenger.getMessagesRef = function (conversationID) {
//        return conversationsRef.child(conversationID);
//    };

//    messenger.sendMessage = function (conversationID, senderID, senderName, content) {

//        console.log(content);
//        var timeSent = new Date().getTime();
//        var newMessageKey = conversationsRef.child(conversationID).push().key;
//        var messageData = {
//            author: senderName,
//            id: senderID,
//            content: content,
//            timestamp: timeSent,
//            messageID: newMessageKey,
//            read : false
//        };

//        getRecipientID(conversationID, senderID).then(function (recipientID) {
//            console.log(recipientID);
//            var updates = {};
//            console.log(conversationID);
//            updates['/messaging/conversations/' + conversationID + '/' + newMessageKey] = messageData;
//            updates['/users/' + recipientID + '/messagelist/' + conversationID + '/lastmessage'] = messageData;
//            updates['/users/' + senderID + '/messagelist/' + conversationID + '/lastmessage'] = messageData;


//            return firebase.database().ref().update(updates);

//        });

//    };

//    messenger.deleteMessage = function (conversationID, MessageID) {
//        var updates = {};
//        updates['/messaging/conversations/' + conversationID + '/' + MessageID] = null;

//        return firebase.database().ref().update(updates);

//    };

//    messenger.readLastMessage = function (conversationID, userID) {
//        var updates = {};
//        updates['/users/' + userID + '/messagelist/' + conversationID + '/lastmessage/read'] = true;
//        return firebase.database().ref().update(updates);
//    };



//    return messenger;


//}]);