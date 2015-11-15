app.factory('BilanFactory', ['$http', '$q', function ($http, $q) {
    return {
        bilan: false,
        getBilan: function (type) {
            var deferred = $q.defer();
            $http.get(server + 'bilan/' + type)
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
    };
}]);

app.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        colours: ['#FF5252', '#FF8A80'],
        responsive: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
        datasetFill: false
    });
}]);

app.controller('BilanController', ['$scope', '$rootScope', 'superCache', 'BilanFactory', 'LoadingState', '$timeout',
    function ($scope, $rootScope, superCache, BilanFactory, LoadingState, $timeout) {
        /*var cache = superCache.get('bilan');

        if (cache) {
            $scope.bilan = cache;
        } else {

        }*/

        $scope.labels = ['1','2','3','4','5'];
        $scope.series = ['Series A'];

        LoadingState.setLoadingState(true);
        $scope.loading = LoadingState.getLoadingState();

        BilanFactory.getBilan("day").then(function (data) {
            $scope.data = [data];

            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
        }, function (msg) {
            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
            displayMessage(msg, "error");
        });
    }]);