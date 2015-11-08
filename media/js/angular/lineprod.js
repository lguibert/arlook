app.factory('LineProdFactory', ['$http', '$q', function ($http, $q) {
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
        }
    };
}]);

app.controller('LineProdController', ['$scope', '$rootScope', 'superCache', 'LineProdFactory', 'LoadingState', '$routeParams',
    function ($scope, $rootScope, superCache, LineProdFactory, LoadingState, $routeParams) {
        var cache = superCache.get('products');

        if (cache) {
            $scope.products = cache;
        } else {
            LoadingState.setLoadingState(true);
            $scope.loading = LoadingState.getLoadingState();

            LineProdFactory.getLineProduct($routeParams.uuid).then(function (data) {
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


