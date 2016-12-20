angular.module('app.viewer')
.controller('ViewerCtrl', function ($scope, $stateParams, $timeout, $filter, $anchorScroll, $location,$ionicScrollDelegate,$ionicSideMenuDelegate, ionicMaterialInk, ionicMaterialMotion, Authkey, Messenger) {


     $ionicSideMenuDelegate.canDragContent(false);


     $scope.view = {
          id: $stateParams.id,
          location: "../../atempstorage/"+$stateParams.viewgroup+"/"+$stateParams.view,
     }


});
