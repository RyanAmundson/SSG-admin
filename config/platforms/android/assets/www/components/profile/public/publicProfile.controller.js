angular.module('app.profile')
.controller('PublicProfileCtrl', function ($scope, $stateParams, $timeout, $q, Messenger, ionicMaterialMotion, ionicMaterialInk, Authkey) {
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


});