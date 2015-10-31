app.factory('ProductsFactory', ['$http', '$q', function ($http, $q) {
    return {
        products: false,
        getProducts: function () {
            var deferred = $q.defer();
            $http.get(server + 'products/', {cache: true})
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
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
                    deferred.reject(data);
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
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        getTVA: function(){
            var deferred = $q.defer();
            $http.get(server + 'tva/', {cache: true})
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

app.directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    });

app.controller('ProductsController', ['$scope', '$rootScope', 'superCache', 'ProductsFactory', 'LoadingState', 'fileReader', '$route', '$location',
    function ($scope, $rootScope, superCache, ProductsFactory, LoadingState, fileReader, $route, $location) {
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

    $scope.$on('ngRepeatFinished', function() {
        $('#table_products').DataTable({
            "language" :{
                "url": "media/french.json"
            },
            "columns": [
                null,
                null,
                {"orderable": false},
                {"orderable": false},
                {"orderable": false}
            ]
        });
    });

    $scope.show_product = function(id){
      $location.path("/product/"+id);
    };

    $scope.loadTVA = function(){
        ProductsFactory.getTVA().then(function(data){
            $scope.tva = data;
        });
    };

    $scope.sellpriceTTC = function(){
        $scope.$watch(['sellprice', 'tva'], function(){
            if($scope.product.tva && $scope.product.sellprice){
                var tva = parseInt(angular.element('#tva :selected').html().split("%")[0]);
                var price = $scope.product.sellprice;
                var pourcent = price * tva / 100;
                var total = price + pourcent;

                angular.element('#sellpriceTTC').val(total);
            }
        });
    };


    $scope.add_new = function (product) {
        product.image = $scope.uploadimage;
        ProductsFactory.addProduct(product).then(function () {
                displayMessage("Produit enregistré.", "success");
                $route.reload();
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


app.controller('ProductController', ['$scope', 'superCache', 'ProductsFactory', 'LoadingState', '$routeParams',
    function ($scope, superCache, ProductsFactory, LoadingState, $routeParams) {

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
