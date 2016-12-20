angular.module('app.upload')

.controller('UploadCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, Authkey, backBlaze) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.user = Authkey.getUserData();
    $scope.tags = {};
    $scope.description = {};
    console.log($scope.user)

    $scope.upload = function (data) {
        console.log(data)
        backBlaze.START.UPLOAD({ file: data }, function (data) {
            console.log(data);
            var file = data.fileName.split(".")[0];
            var xt = data.fileName.split(".")[1];
            console.log(data.name)
            var tags = $scope.tags.list.split(",");
            firebase.database().ref('content/' + file).set({
                creator: $scope.user.displayName,
                fileName: file,
                description: $scope.description.string,
                likes: 0,
                comments: [],
                tags: tags,
                ext: xt,
                reported: {
                    status: false,
                    reason: ""
                }
            });
        });

    };


    // Set Motion
    $timeout(function () {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);
    $timeout(function () {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);
    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function ($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, backBlaze) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);
    $scope.media = {};
    $scope.mediaOdd = {};



    firebase.database().ref('content/').once('value').then(function (snapshot) {
        var files = snapshot.val();
        files = Object.keys(files).map(function (i) {
            return files[i];
        })
        // firebase.database().ref.orderByChild("content").on("child_added", function(snapshot) {

        //  });
        // Restructure to get rid of id in object, key
        // files = files.map(function(item){
        //     return ;
        // });

        console.log(files)
        var even = files.filter((i, x) => { if (x % 2 == 0) return i });
        var odd = files.filter((i, x) => { if (x % 2 == 1) return i });
        $scope.media = even;
        $scope.mediaOdd = odd;

        console.log($scope.media, $scope.mediaOdd)

        $timeout(function () {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 600);


    });



    //  backBlaze.ALL.MEDIA(function(data){
    //   console.log(data.files);
    //   var files = data.files;

    //  var even = files.filter((i,x)=>{ if(x%2 ==0)return i});
    //  var odd = files.filter((i,x)=>{ if(x%2 == 1)return i});
    //  $scope.media = even;
    //  $scope.mediaOdd = odd;

    //   $timeout(function() {
    //       ionicMaterialMotion.fadeSlideIn({
    //           selector: '.animate-fade-slide-in .item'
    //       });
    //   }, 600);

    // });


    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

;
