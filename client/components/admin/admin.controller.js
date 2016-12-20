angular.module('app.admin')
.controller('AdminCtrl', function ($scope, $stateParams, $timeout,$http, ionicMaterialMotion, ionicMaterialInk) {

     var data = {
          issues: "####",
          laws: "####",
          actors: "####"
     }
     var categories = {
          "water":
          {
               "laws": "####",
               "actors": "####"
          },
          "air":
          {
               "laws": "####",
               "actors": "####"
          },
          "land":
          {
               "laws": "####",
               "actors": "####"
          },
          "conservation":
          {
               "laws": "####",
               "actors": "####"
          },
          "pollution":
          {
               "laws": "####",
               "actors": "####"
          }
     }

     $scope.overview = {
          "data" : data,
          "categories" : categories
     };
     var loadContent = function(category,type){
          $http.get("../../v0.5/server/"+type+".php?"+category+"=topic&offset=0").then(function(results){
               console.log(results);

          });

     }("water","laws");


     var loadData = function(){
          $http.get("../../../../SalishSea/v0.5/server/admin.php").then(function(result){
               console.log(result);
               data.issues = result.data[0];
               data.laws = result.data[1];
               data.actors = result.data[2];
          });
          $http.get("../../../../SalishSea/v0.5/server/laws.php?water=topic&offset=0").then(function(result){
               console.log(result);
               categories.water.laws = result.data.length;
          });
          $http.get("../../../../SalishSea/v0.5/server/actors.php?water=topic&offset=0").then(function(result){
               categories.water.actors = result.data.length;
          });

          $http.get("../../../../SalishSea/v0.5/server/laws.php?air=topic&offset=0").then(function(result){
               console.log(result);
               categories.air.laws = result.data.length;
          });
          $http.get("../../../../SalishSea/v0.5/server/actors.php?air=topic&offset=0").then(function(result){
               categories.air.actors = result.data.length
          });

          $http.get("../../../../SalishSea/v0.5/server/laws.php?land=topic&offset=0").then(function(result){
               console.log(result);
               categories.land.laws = result.data.length;
          });
          $http.get("../../../../SalishSea/v0.5/server/actors.php?land=topic&offset=0").then(function(result){
               categories.land.actors = result.data.length
          });

          $http.get("../../../../SalishSea/v0.5/server/laws.php?pollution=topic&offset=0").then(function(result){
               console.log(result);
               categories.pollution.laws = result.data.length;
          });
          $http.get("../../../../SalishSea/v0.5/server/actors.php?pollution=topic&offset=0").then(function(result){
               categories.pollution.actors = result.data.length
          });

          $http.get("../../../../SalishSea/v0.5/server/laws.php?conservation=topic&offset=0").then(function(result){
               console.log(result);
               categories.conservation.laws = result.data.length;
          });
          $http.get("../../../../SalishSea/v0.5/server/actors.php?conservation=topic&offset=0").then(function(result){
               categories.conservation.actors = result.data.length
          });
     }();


});
