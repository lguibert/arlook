app.factory('BilanFactory', ['$http', '$q', function ($http, $q) {
    return {
        bilan: false,
        getBilanProd: function () {
            var deferred = $q.defer();
            $http.get(server + 'bilan/')
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        getBilanByPerfectDate: function (date) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'bilan/',
                data: date,
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
        getBilanVisit: function () {
            var deferred = $q.defer();
            $http.get(server + 'bilan/visit')
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        getBilanVisitPerfect: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'bilan/visit/',
                data: data,
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
    }
}]);

app.controller('BilanController', ['$scope', '$rootScope', 'superCache', 'BilanFactory', 'LoadingState',
    function ($scope, $rootScope, superCache, BilanFactory, LoadingState) {
        $scope.active_date = new Date();

        LoadingState.setLoadingState(true);
        $scope.loading = LoadingState.getLoadingState();
        bilan_default();

        $scope.$on('ngRepeatFinished', function () {
            $('#table_bilans').DataTable({
                "language": {
                    "url": "media/french.json"
                }
            });
        });

        $scope.$on('ngRepeatFinished2', function () {
            $('#table_visit_bilans').DataTable({
                "language": {
                    "url": "media/french.json"
                }
            });
        });

        function bilan_default() {
            BilanFactory.getBilanProd().then(function (data) {
                $scope.bilans = data;
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
            }, function (msg) {
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
                displayMessage(msg, "error");
            });

            BilanFactory.getBilanVisit().then(function (data) {
                $scope.bilans_visit = data;
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
            }, function (msg) {
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
                displayMessage(msg, "error");
            });
        }

        $scope.$watch("perfect_date", function () {
            if ($scope.perfect_date) {
                var d = new Date($scope.perfect_date);
                $scope.active_date = d;
                BilanFactory.getBilanByPerfectDate(d.getFullYear() + "-" + (parseInt(d.getMonth()) + 1).toString() + "-" + d.getDate()).then(function (data) {
                    $scope.bilans = data;
                }, function (msg) {
                    displayMessage(msg, "error");
                });
                BilanFactory.getBilanVisitPerfect(d.getFullYear() + "-" + (parseInt(d.getMonth()) + 1).toString() + "-" + d.getDate()).then(function (data) {
                    $scope.bilans_visit = data;
                }, function (msg) {
                    displayMessage(msg, "error");
                });
            }
        });
    }]);