angular.module('app.collections')
.controller('CollectionsCtrl', function ($scope, $stateParams, $timeout, $filter, $anchorScroll, $location,$ionicScrollDelegate,$ionicSideMenuDelegate,$state, ionicMaterialInk, ionicMaterialMotion, Authkey, Messenger) {

     $scope.collections = {
          name: "test group",
          viewCount: 1,
          height: "100px",
          width: "100px",
          covers : [
               {
                    id: 1,
                    name: "Travel",
                    location: "../../atempstorage/travel/venice.jpeg"
               }
          ]
     };
     $scope.clicked = function(name){
          $state.go('app.viewable-group',{viewgroup:name});
     }

});
