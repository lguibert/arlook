app.factory('ProductFactory', ['$http', '$q', function ($http, $q) {
    return {
        products: false,
        getProduct: function (uuid) {
            var deferred = $q.defer();
            $http.get(server + 'product/' + uuid)
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
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        getTVA: function () {
            var deferred = $q.defer();
            $http.get(server + 'tva/', {cache: true})
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        inProduct: function(nb){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'product/in/store',
                data: nb,
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
        outProduct: function(nb){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'product/out/store',
                data: nb,
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

app.controller('ProductController', ['$scope', '$rootScope', 'superCache', 'ProductFactory', 'LoadingState', 'fileReader', '$routeParams', '$location', '$route',
    function ($scope, $rootScope, superCache, ProductFactory, LoadingState, fileReader, $routeParams, $location, $route) {
        var cache = superCache.get('product');

        if (cache ) {
            $scope.product = cache;
        }
        else {
            LoadingState.setLoadingState(true);
            $scope.loading = LoadingState.getLoadingState();

            ProductFactory.getProduct($routeParams.uuid).then(function (data) {
                $scope.product = data;
                $scope.product.prod_datebuy = Date.parse($scope.product.prod_datebuy);
                $scope.product.prod_lastmodification = Date.parse($scope.product.prod_lastmodification);

                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
            }, function (msg) {
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
                displayMessage(msg, "error");
            });
        }

        $('#table_product_stock_store').DataTable({
            "language" :{
                "url": "media/french.json"
            },
            "columns": [
                null,
                {"orderable": false},
                {"orderable": false}
            ]
        });

        $scope.sellpriceTTC = function () {
            $scope.$watch(['sellprice', 'tva'], function () {
                calculation_tva();
            });
        };

        function calculation_tva(){
            if ($scope.product.prod_tva && $scope.product.prod_sellprice) {
                var tva = parseInt(angular.element('#tva :selected').html().split("%")[0]);
                var price = parseFloat($scope.product.prod_sellprice);
                var pourcent = price * tva / 100;
                var total = price + pourcent;

                angular.element('#sellpriceTTC').val(total);
            }
        }

        $scope.loadTVA = function () {
            ProductFactory.getTVA().then(function (data) {
                $scope.tva = data;
            });
        };

        $scope.in_product = function(uuid, nb, $event){
            LoadingState.setLoadingState(true);
            $scope.loading = LoadingState.getLoadingState();

            ProductFactory.inProduct([uuid, nb]).then(function () {
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
                displayMessage("Modification effectuée.", "success");
                updateStockProduct(nb, "+", $event);
            }, function (msg) {
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
                displayMessage(msg, "error");
            });
        };

        $scope.out_product = function(uuid, nb, $event){
            LoadingState.setLoadingState(true);
            $scope.loading = LoadingState.getLoadingState();

            ProductFactory.outProduct([uuid, nb]).then(function () {
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
                displayMessage("Modification effectuée.", "success");
                updateStockProduct(nb, "-", $event);
            }, function (msg) {
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
                displayMessage(msg, "error");
            });
        };

        function updateStockProduct(nb, ope, $event){
            if(ope == "+"){
                $scope.product.prod_stock_store += nb ;
            }
            else if(ope == "-"){
                $scope.product.prod_stock_store -= nb ;
            }

            $event.currentTarget.parentElement.children[0].value = "";
        }

        $scope.update_product = function (product) {
            if ($scope.uploadimage) {
                product.prod_image = $scope.uploadimage;
            }

            var date = new Date(product.prod_datebuy);
            product.prod_datebuy = date.getFullYear().toString() + "-" + addZero((date.getMonth() + 1).toString()) + "-" + addZero(date.getDate().toString());

            ProductFactory.updateProduct(product).then(function (data) {
                $location.path("/product/" + data[0]['fields'].prod_uuid);
                displayMessage("Mise à jour OP!", "success");
            }, function (msg) {
                displayMessage(msg, "error");
            });
        };

        function addZero(value) {
            if (value.length == 1) {
                value = "0" + value;
            }
            return value;
        }

        $scope.getFile = function () {
            fileReader.readAsDataUrl($scope.file, $scope)
                .then(function (result) {
                    $scope.imageSrc = result;
                });
        };
    }]);