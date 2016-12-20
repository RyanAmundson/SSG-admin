
angular.module('app.login')
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
            $state.go('app.privateProfile');


        });
    };
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

            $state.go('app.privateProfile');
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

            $state.go('app.privateProfile');
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

            $state.go('app.privateProfile');

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
});