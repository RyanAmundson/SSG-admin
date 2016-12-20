
angular.module('app.login')
.controller('LoginCtrl', function ($scope, $location, $timeout, $stateParams, $state, $firebaseAuth,$ionicSideMenuDelegate, ionicMaterialInk, Authkey) {


     $ionicSideMenuDelegate.canDragContent(false);

    $scope.userInfo = {
        email: "ryanjustin@live.com",
        password: "boston555"
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

            $state.go('app.admin');

        }, function (error) {

            console.log("login failed."+error);


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
