angular.module('app.shared')

.factory('backBlaze', ['$resource', function ($resource) {

    return {
        START: $resource("http://localhost:3000/api/backblaze/upload", {}, {
            UPLOAD: {
                method: 'post',
                isArray: false
            }
        }),
        ALL: $resource("http://localhost:3000/api/backblaze/allmedia", {}, {
            MEDIA: {
                method: 'get',
                isArray: false
            }
        })

    };
}]);