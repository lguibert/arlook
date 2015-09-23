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
        },
        addProduct: function (product) {
            var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: server + 'products/add/',
                    data: product,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                .success(function (data) {
                    deferred.resolve(data);
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

        ProductsFactory.getProducts().then(function (data) {
            $scope.products = data;

            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
        }, function (msg) {
            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
            displayMessage(msg, "error");
        });
    }


    $scope.add_new = function (product) {
        ProductsFactory.addProduct(product).then(function (data) {
                displayMessage("Produit enregistré.", "success");
                $scope.product = '';
                $scope.addProductForm.$setPristine();
                $scope.addProductForm.$setUntouched();
            },
            function (msg) {
                displayMessage(msg, "error");
            }
        )
        ;
    };
}]);