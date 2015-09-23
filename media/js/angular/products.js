app.factory('ProductsFactory', ['$http', '$q', function ($http, $q) {
    var factory = {
        products: false,
        getProducts: function () {
            var deferred = $q.defer();
            $http.get(server + 'products/', {cache: true})
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(null);
                });
            return deferred.promise;
        },
        getProduct: function (product) {
            var deferred = $q.defer();
            $http.get(server + 'products/' + product, {cache: true})
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(null);
                });
            return deferred.promise;
        }
    }
    return factory;
}]);


app.controller('ProductsController', ['$scope', '$rootScope', 'superCache', 'ProductsFactory', 'LoadingState', function ($scope, $rootScope, superCache, ProductsFactory, LoadingState) {
    var cache = superCache.get('products');

    if (cache) {
        $scope.products = cache;
    } else {
        LoadingState.setLoadingState(true);
        $scope.loading = LoadingState.getLoadingState();

        $scope.products = ProductsFactory.getProducts().then(function (data) {
            $scope.products = data;

            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
        }, function (msg) {
            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
            displayMessage(msg, "error");
        });
    }


    $scope.add_new = function(product){
        console.log(product);
    };
}]);