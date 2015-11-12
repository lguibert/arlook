app.factory('BilanFactory', ['$http', '$q', function ($http, $q) {
    return {
        bilan: false,
        getBilan: function (uuid) {
            var deferred = $q.defer();
            $http.get(server + 'client/line/' + uuid)
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

app.controller('BilanController', ['$scope', '$rootScope', 'superCache', 'BilanFactory', 'LoadingState', '$routeParams',
    function ($scope, $rootScope, superCache, BilanFactory, LoadingState, $routeParams) {
        var cache = superCache.get('bilan');

        if (cache) {
            $scope.bilan = cache;
        } else {
            LoadingState.setLoadingState(true);
            $scope.loading = LoadingState.getLoadingState();

            BilanFactory.getLineProduct($routeParams.uuid).then(function (data) {
                $scope.lineprod = data;

                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
            }, function (msg) {
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
                displayMessage(msg, "error");
            });
        }

        $scope.$on('ngRepeatFinished', function() {
            $('#table_lineprod').DataTable({
                "language" :{
                    "url": "media/french.json"
                },
                "order": [
                    [2, "desc"]
                ]
            });
        });

    }]);