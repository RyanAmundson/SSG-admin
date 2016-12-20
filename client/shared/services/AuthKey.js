angular.module('app.shared')
.service('Authkey', function () {
    var authkey = "";
    var username = "";
    var id = "";
    var user = {};

    var loc = "";
    var following = {};
    var followers = {};


    return {
        getUserData: function () {
            return user;
        },
        setUserData: function (User) {
            user = User;
        },
        clearUserData: function () {
            user = {};
        },
        getAuthKey: function () {
            return authkey;
        },
        setAuthKey: function (key) {
            authkey = key;
        },
        resetAuthKey: function () {
            authkey = "";
        },
        setUserName: function (name) {
            username = name;
        },
        getUserName: function () {
            return username;
        },
        clearUserName: function () {
            username = "";
        },
        setUserId: function (num) {
            id = num;
        },
        getUserId: function () {
            return id;
        },
        clearUserId: function () {
            id = "";
        },
        setUserLocation: function (Loc) {
            loc = Loc;
        },
        getUserLocation: function () {
            return loc;
        },
        clearUserLocation: function () {
            loc = "";
        }
    };
});