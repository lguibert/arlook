app.factory('LineFactory', ['$http', '$q', function ($http, $q) {
    return {
        products: false,
        getLineProduct: function (uuid) {
            var deferred = $q.defer();
            $http.get(server + 'product/line/' + uuid)
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        getLineClient: function (uuid) {
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

app.controller('LineProdController', ['$scope', '$rootScope', 'superCache', 'LineFactory', 'LoadingState', '$routeParams',
    function ($scope, $rootScope, superCache, LineFactory, LoadingState, $routeParams) {
        var cache = superCache.get('products');

        if (cache) {
            $scope.products = cache;
        } else {
            LoadingState.setLoadingState(true);
            $scope.loading = LoadingState.getLoadingState();

            LineFactory.getLineProduct($routeParams.uuid).then(function (data) {
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

app.controller('LineClientController', ['$scope', '$rootScope', 'superCache', 'LineFactory', 'LoadingState', '$routeParams',
    function ($scope, $rootScope, superCache, LineFactory, LoadingState, $routeParams) {
        var cache = superCache.get('products');

        if (cache) {
            $scope.products = cache;
        } else {
            LoadingState.setLoadingState(true);
            $scope.loading = LoadingState.getLoadingState();

            LineFactory.getLineClient($routeParams.uuid).then(function (data) {
                $scope.lineclient = data;

                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
            }, function (msg) {
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
                displayMessage(msg, "error");
            });
        }

        $scope.$on('ngRepeatFinished', function() {
            $('#table_lineclient').DataTable({
                "language" :{
                    "url": "media/french.json"
                },
                "order": [
                    [2, "desc"]
                ]
            });
        });

    }]);


