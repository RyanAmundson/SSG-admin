(function () {
    angular
        .module('app.messenger')
        .controller('ConversationsCtrl', Conversations);

    Conversations.$inject = ['$scope','$stateParams', '$timeout', '$firebaseObject', '$firebaseArray', 'Messenger', 'ionicMaterialInk', 'ionicMaterialMotion', 'Authkey'];

    function Conversations($scope,$stateParams, $timeout, $firebaseObject, $firebaseArray, Messenger, ionicMaterialInk, ionicMaterialMotion, Authkey) {

        var vm = this;
        console.log(this);
        vm.createConversation = createConversation;
        vm.createConversation = deleteConversation;
        vm.createConversation = openConversation;
        vm.user = Authkey.getUserData();

        syncConversations();


        function syncConversations() {
            Messenger.getConversations(vm.user.uid).on('value', function (snapshot) {
                vm.conversations = snapshot.val();
            });
        }
        function createConversation() {
            Messenger.createConversation;
        }

        function deleteConversation(){
            Messenger.deleteConversation;
        }
        function openConversation() {
            Messenger.readLastMessage;
        }



        //var obj = $firebaseObject(firebase.database().ref('users/' + vm.user.uid + '/messagelist').orderByChild('lastmessage'));
        //obj.$bindTo(vm, "conversations").then(function () {
        //    console.log(vm.conversations);
        //});


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

    }

});