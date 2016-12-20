
angular.module('app', [
'ionic',
'app.shared',
'app.login',
'app.admin',
'app.menu',
'ionic-material',
'ionMdInput',
'firebase'
])

.run(function($ionicPlatform) {
     $ionicPlatform.ready(function() {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          if (window.cordova && window.cordova.plugins.Keyboard) {
               cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          }
          if (window.StatusBar) {
               // org.apache.cordova.statusbar required
               StatusBar.styleDefault();
          }
     });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

     // Turn off caching for demo simplicity's sake
     $ionicConfigProvider.views.maxCache(0);
     /*
     // Turn off back button text
     $ionicConfigProvider.backButton.previousTitleText(false);
     */

     $stateProvider.state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'components/menu/menu.html',
          controller: 'MenuCtrl'
     })

     .state('app.login', {
          url: '/login',
          views: {
               'menuContent': {
                    templateUrl: 'components/login/login.html',
                    controller: 'LoginCtrl'
               },
               'fabContent': {
                    template: ''
               }
          }
     })
     .state('app.admin', {
          url: '/admin',
          views: {
               'menuContent': {
                    templateUrl: 'components/admin/admin.html',
                    controller: 'AdminCtrl'
               },
               'fabContent': {
                    template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                    controller: function ($timeout) {
                         $timeout(function () {
                              document.getElementById('fab-activity').classList.toggle('on');
                         }, 200);
                    }
               }
          }
     })
;

// if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise('/app/login');
});
