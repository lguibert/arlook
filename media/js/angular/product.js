app.factory('ProductFactory', ['$http', '$q', function ($http, $q) {
    return {
        products: false,
        getProduct: function (uuid) {
            var deferred = $q.defer();
            $http.get(server + 'product/' + uuid, {cache: true})
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        updateProduct: function (product) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'product/update/',
                data: product,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
    };
}]);

app.controller('ProductController', ['$scope', '$rootScope', 'superCache', 'ProductFactory', 'LoadingState', 'fileReader', '$routeParams',
    function ($scope, $rootScope, superCache, ProductFactory, LoadingState, fileReader, $routeParams) {
    var cache = superCache.get('product');

    if (cache) {
        $scope.product = cache;
    } else {
        LoadingState.setLoadingState(true);
        $scope.loading = LoadingState.getLoadingState();

        ProductFactory.getProduct($routeParams.uuid).then(function (data) {
            $scope.product = data;

            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
        }, function (msg) {
            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
            displayMessage(msg, "error");
        });
    }
}]);