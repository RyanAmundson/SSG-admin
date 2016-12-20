
angular.module('app.connections')

.controller('PrivateFollowersCtrl', function ($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, Authkey) {
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

});