angular.module('app.viewable-group')
.controller('ViewableGroupCtrl', function ($scope, $stateParams, $timeout, $filter, $anchorScroll, $location,$ionicScrollDelegate,$ionicSideMenuDelegate,$state, ionicMaterialInk, ionicMaterialMotion, Authkey, Messenger) {

     $scope.viewGroup = {
          name: "test group",
          viewCount: 3,
          height: "250px",
          width: "250px",
          views : [
               {
                    id: 1,
                    name: "venice.jpeg",
                    location: "../../atempstorage/travel/venice.jpeg"
               },
               {
                    id: 2,
                    name: "360img.png",
                    location: "../../atempstorage/travel/360img.png"
               },
               {
                    id: 3,
                    name: "puydesancy.jpg",
                    location: "../../atempstorage/travel/puydesancy.jpg"
               }
          ]
     };

     function loadViews(){

     }

     $scope.clicked = function(name) {
          console.log("cliecked");
          $state.go('app.viewer',{viewgroup:$stateParams.viewgroup,view:name});
     }


});
