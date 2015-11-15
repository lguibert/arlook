var app = angular.module('arlook', ['ngRoute', "ngCookies", "chart.js"]);
var server = "http://dev.lucasguibert.com:8000/";


app.service('LoadingState', ['$rootScope', function ($rootScope) {
    return {
        getLoadingState: function () {
            return this.loading;
        },
        setLoadingState: function (state) {
            this.loading = state;
            $rootScope.$emit("ChangedState");
        }
    }
}]);

app.controller('MainController', ['$scope', '$rootScope', 'LoadingState', function ($scope, $rootScope, LoadingState) {
    $rootScope.$on('ChangedState', function () {
        $scope.loading = LoadingState.getLoadingState();
    });
}]);

app.factory('superCache', ['$cacheFactory', function ($cacheFactory) {
    return $cacheFactory('myData');
}]);