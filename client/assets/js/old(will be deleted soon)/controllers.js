/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function () {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function (bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function (location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function () {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function () {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function () {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function () {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LoginCtrl', function ($scope, $location, $timeout, $stateParams, $state, $firebaseAuth, ionicMaterialInk, Authkey) {

    $scope.userInfo = {
        email: "test@test.test",
        password: "testuser"
    };
    $scope.user;
    $scope.$parent.clearFabs();
    $timeout(function () {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

    var writeUserData = function (userId, name, email, photoURL) {
        firebase.database().ref('users/' + userId).update({
            username: name,
            email: email,
            photoURL: photoURL
        });
    }


    $scope.logInWithFacebook = function () {
        // First, we perform the signInWithRedirect.
        // Creates the provider object.
        $scope.provider = new firebase.auth.FacebookAuthProvider();
        $scope.auth = firebase.auth();
        // You can add additional scopes to the provider:
        $scope.provider.addScope('email');
        $scope.provider.addScope('user_friends');

        $scope.auth.signInWithPopup($scope.provider).then(function (result) {


            console.log(result);
            Authkey.setUserData(result.user)
            writeUserData(result.user.uid, result.user.displayName, result.user.email, result.user.photoURL);
            $state.go('app.profile');


        });
    }();
    $scope.logInWithGoogle = function () {

        console.log("attempting to log in with Google");
        console.log(firebase);
        // $scope.auth = Auth.$authWithOAuthPopup("google").then(function(authData) {
        $scope.provider = new firebase.auth.GoogleAuthProvider();
        $scope.auth = firebase.auth();

        $scope.auth.signInWithPopup($scope.provider).then(function (result) {
            console.log(result);
            Authkey.setUserData(result.user)
            writeUserData(result.user.uid, result.user.displayName, result.user.email, result.user.photoURL);

            $state.go('app.profile');
        });
    };

    $scope.logInWithTwitter = function () {

        console.log("attempting to log in with Twitter");
        console.log(firebase);
        // $scope.auth = Auth.$authWithOAuthPopup("google").then(function(authData) {
        $scope.provider = new firebase.auth.TwitterAuthProvider();
        $scope.auth = firebase.auth();

        $scope.auth.signInWithPopup($scope.provider).then(function (result) {
            console.log(result);
            Authkey.setUserData(result.user)
            writeUserData(result.user.uid, result.user.displayName, result.user.email, result.user.photoURL);

            $state.go('app.profile');
        });
    };

    $scope.logInWithFirebase = function () {
        console.log("attempting to log in with firebase");
        console.log(firebase);
        $scope.auth = firebase.auth();
        console.log($scope.auth);
        $scope.auth.signInWithEmailAndPassword($scope.userInfo.email, $scope.userInfo.password).then(function (result) {
            console.log("login success" + result);
            console.log($location);
            Authkey.setUserData(result)
            writeUserData(result.uid, result.email, result.email, result.photoURL);

            $state.go('app.profile');

        }, function (error) {

            console.log("login failed.");


        });

    };
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        Authkey.clearUserData();
    }, function (error) {
        console.log(error);
        // An error happened.
    });
})

.controller('FriendsPublicCtrl', function ($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, Authkey) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function () {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.followers;
    console.log($stateParams.id);

    $scope.getFollowers = function (userId) {
        firebase.database().ref('users/' + userId + '/followers').on('value', function (snapshot) {
            $scope.followers = snapshot.val();
            console.log(snapshot.val());
        });
    }($stateParams.id);

})

.controller('FriendsCtrl', function ($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, Authkey) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function () {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.user = Authkey.getUserData();
    $scope.followers = {};

    $scope.getFollowers = function (userId) {
        firebase.database().ref('users/' + userId + '/followers').on('value', function (snapshot) {
            $scope.followers = snapshot.val();
            console.log($scope.followers);
        });
    }($scope.user.uid);

})
 .controller('MessagesCtrl', function ($scope, $stateParams, $timeout,$firebaseObject, Messenger, ionicMaterialInk, ionicMaterialMotion, Authkey) {


     $scope.user = Authkey.getUserData();
     

     var obj = $firebaseObject(firebase.database().ref('users/'+$scope.user.uid+'/messagelist').orderByChild('lastmessage'));
     obj.$bindTo($scope, "conversations").then(function (unbind) {
         console.log($scope.conversations);
     });
     
     $scope.createConversation = Messenger.createConversation;
     $scope.deleteConversation = Messenger.deleteConversation;



     // Set Header
     $scope.$parent.showHeader();
     $scope.$parent.clearFabs();
     $scope.$parent.setHeaderFab('left');

     // Delay expansion
     $timeout(function () {
         $scope.isExpanded = true;
         $scope.$parent.setExpanded(true);
     }, 300);

     // Set Motion
     ionicMaterialMotion.fadeSlideInRight();

     // Set Ink
     ionicMaterialInk.displayEffect();

 })
.controller('MessageSingleCtrl', function ($scope, $stateParams, $timeout, $filter, $anchorScroll, $location, ionicMaterialInk, ionicMaterialMotion, Authkey, Messenger) {


    $scope.user = Authkey.getUserData();
    console.log($scope.user);
    $scope.currentMessage = "";
    $scope.conversationID = $stateParams.id;



    //send a new message
    $scope.sendMessage = function () {
        Messenger.sendMessage($stateParams.id, $scope.user.uid, $scope.user.displayName, $scope.currentMessage);
        $scope.currentMessage = "";
    };
    //delete a message
    $scope.deleteMessage = function (conversationID, messageID) {
        Messenger.deleteMessage(conversationID, messageID);
    };

    //set listeners
    Messenger.getMessagesRef($stateParams.id).on('value', function (messages) {
        $scope.messages = messages.val();
    });



    $scope.gotoBottom = function () {
        console.log("scrolling...");
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('bottom');

        // call $anchorScroll()
        $anchorScroll();
    };


    //getMessages($stateParams.id);



    // $scope.gotoBottom();


    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function () {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    //// Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    //// Set Ink
    ionicMaterialInk.displayEffect();

})

.controller('ProfileCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, Authkey) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    // Set Motion
    $timeout(function () {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function () {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.user = {};

    $scope.loadUserData = function (uid) {
        firebase.database().ref('users/' + uid).on('value', function (snapshot) {
            $scope.user = snapshot.val();
        });
    }(Authkey.getUserData().uid);



})
.controller('PublicProfileCtrl', function ($scope, $stateParams, $timeout, $q,Messenger, ionicMaterialMotion, ionicMaterialInk, Authkey) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    // Set Motion
    $timeout(function () {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function () {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
    //-------------------------------------------------

    $scope.viewer = {};
    $scope.viewee = {};
    $scope.isFollowing;

    $scope.sendThisPersonAMessage = function () {
        $scope.newMessageID = Messenger.createConversation($scope.viewer.uid, $stateParams.id);
        console.log($scope.newMessageID);
    };


    $scope.checkFollowing = function () {
        firebase.database().ref('users/' + $scope.viewee.uid + '/followers/' + $scope.viewer.uid).on('value', function (snapshot) {
            $scope.isFollowing = !(snapshot.val() === null);
        });
    };

    $scope.unfollowUser = function () {
        console.log("attempting to unfollow..");
        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['users/' + $scope.viewer.uid + '/following/' + $scope.viewee.uid] = null;
        updates['users/' + $scope.viewee.uid + '/followers/' + $scope.viewer.uid] = null;
        $timeout(function () {
            return firebase.database().ref().update(updates);
        }, 500);

    };

    $scope.followUser = function () {
        console.log("attempting to follow..");
        // A post entry.
        var followerData = {
            username: $scope.viewer.username
        };
        var followeeData = {
            username: $scope.viewee.username
        };
        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['users/' + $scope.viewer.uid + '/following/' + $scope.viewee.uid] = followeeData;
        updates['users/' + $scope.viewee.uid + '/followers/' + $scope.viewer.uid] = followerData;
        $timeout(function () {

            return firebase.database().ref().update(updates);
        }, 500);
    };

    $scope.loadUserData = function (uid) {
        return $q(function (resolve, reject) {
            firebase.database().ref('users/' + uid).on('value', function (snapshot) {
                resolve(snapshot.val()) || reject("error");
            });
        });
    };

    //init
    $q.all([$scope.loadUserData($stateParams.id), $scope.loadUserData(Authkey.getUserData().uid)]).then(function (result) {
        console.log(result[0], result[1]);
        console.log(Object.keys(result));
        $scope.viewee = result[0];
        $scope.viewer = result[1];
        $scope.viewee.uid = $stateParams.id;
        $scope.viewer.uid = Authkey.getUserData().uid;
        $scope.checkFollowing();
    },
    function (error) {
        console.log("There was an error loading user data", error);
        //add some kind of temp for errored profile
    });


})
.controller('ActivityCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function () {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('UploadCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, Authkey, backBlaze) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.user = Authkey.getUserData();
    $scope.tags = {};
    $scope.description = {};
    console.log($scope.user)

    $scope.upload = function (data) {
        console.log(data)
        backBlaze.START.UPLOAD({ file: data }, function (data) {
            console.log(data);
            var file = data.fileName.split(".")[0];
            var xt = data.fileName.split(".")[1];
            console.log(data.name)
            var tags = $scope.tags.list.split(",");
            firebase.database().ref('content/' + file).set({
                creator: $scope.user.displayName,
                fileName: file,
                description: $scope.description.string,
                likes: 0,
                comments: [],
                tags: tags,
                ext: xt,
                reported: {
                    status: false,
                    reason: ""
                }
            });
        });

    };


    // Set Motion
    $timeout(function () {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);
    $timeout(function () {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);
    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function ($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, backBlaze) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);
    $scope.media = {};
    $scope.mediaOdd = {};



    firebase.database().ref('content/').once('value').then(function (snapshot) {
        var files = snapshot.val();
        files = Object.keys(files).map(function (i) {
            return files[i];
        })
        // firebase.database().ref.orderByChild("content").on("child_added", function(snapshot) {

        //  });
        // Restructure to get rid of id in object, key
        // files = files.map(function(item){
        //     return ;
        // });

        console.log(files)
        var even = files.filter((i, x) => { if (x % 2 == 0) return i });
        var odd = files.filter((i, x) => { if (x % 2 == 1) return i });
        $scope.media = even;
        $scope.mediaOdd = odd;

        console.log($scope.media, $scope.mediaOdd)

        $timeout(function () {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 600);


    });



    //  backBlaze.ALL.MEDIA(function(data){
    //   console.log(data.files);
    //   var files = data.files;

    //  var even = files.filter((i,x)=>{ if(x%2 ==0)return i});
    //  var odd = files.filter((i,x)=>{ if(x%2 == 1)return i});
    //  $scope.media = even;
    //  $scope.mediaOdd = odd;

    //   $timeout(function() {
    //       ionicMaterialMotion.fadeSlideIn({
    //           selector: '.animate-fade-slide-in .item'
    //       });
    //   }, 600);

    // });


    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

;
