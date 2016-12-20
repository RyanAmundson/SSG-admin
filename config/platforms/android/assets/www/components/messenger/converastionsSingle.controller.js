angular.module('app.messenger')
.controller('ConversationsSingleCtrl', function ($scope, $stateParams, $timeout, $filter, $anchorScroll, $location,$ionicScrollDelegate, ionicMaterialInk, ionicMaterialMotion, Authkey, Messenger) {


    $scope.user = Authkey.getUserData();
    console.log($scope.user);
    $scope.currentMessage = "";
    $scope.conversationID = $stateParams.id;

    function gotoBottom() {
        
        $location.hash('anchor');
        $ionicScrollDelegate.anchorScroll(true);
        //$ionicScrollDelegate.scrollBottom(true);
    };
    gotoBottom();
    //send a new message
    $scope.sendMessage = function () {
        Messenger.sendMessage($stateParams.id, $scope.user.uid, $scope.user.displayName, $scope.currentMessage);
        $scope.currentMessage = "";
        gotoBottom();
    };
    //delete a message
    $scope.deleteMessage = function (conversationID, messageID) {
        Messenger.deleteMessage(conversationID, messageID);
        gotoBottom();
    };

    //set listeners
    Messenger.getMessages($stateParams.id).on('value', function (messages) {
        Messenger.readLastMessage($scope.conversationID, $scope.user.uid);
        $scope.messages = messages.val();
        gotoBottom();
    });




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

});