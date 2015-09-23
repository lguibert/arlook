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
        getProduct: function (uuid) {
            var deferred = $q.defer();
            $http.get(server + 'product/' + uuid, {cache: true})
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


app.controller('ProductsController', ['$scope', '$rootScope', 'superCache', 'ProductsFactory', 'LoadingState', 'fileReader', function ($scope, $rootScope, superCache, ProductsFactory, LoadingState, fileReader) {
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
        product.image = $scope.uploadimage;
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

    $scope.getFile = function () {
        fileReader.readAsDataUrl($scope.file, $scope)
            .then(function (result) {
                $scope.imageSrc = result;
            });
    };
}]);

app.directive("ngFileSelect", function () {
    return {
        link: function (scope, el) {
            el.bind("change", function (e) {
                scope.file = (e.srcElement || e.target).files[0];
                scope.getFile();
            })
        }
    }
});

app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

app.controller('ProductController', ['$scope', '$rootScope', 'superCache', 'ProductsFactory', 'LoadingState', 'fileReader', '$routeParams', function ($scope, $rootScope, superCache, ProductsFactory, LoadingState, fileReader, $routeParams) {
    var cache = superCache.get('product');

    if (cache) {
        $scope.product = cache;
    } else {
        LoadingState.setLoadingState(true);
        $scope.loading = LoadingState.getLoadingState();

        ProductsFactory.getProduct($routeParams.uuid).then(function (data) {
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
