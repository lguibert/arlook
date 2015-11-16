app.factory('BilanFactory', ['$http', '$q', function ($http, $q) {
    return {
        bilan: false,
        getBilan: function () {
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
        }
    };
}]);

app.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        colours: ['#FF5252', '#FF8A80'],
        responsive: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
        datasetFill: false
    });
}]);

app.controller('BilanController', ['$scope', '$rootScope', 'superCache', 'BilanFactory', 'LoadingState',
    function ($scope, $rootScope, superCache, BilanFactory, LoadingState) {

        LoadingState.setLoadingState(true);
        $scope.loading = LoadingState.getLoadingState();
        bilan_default();


        function bilan_default(){
            BilanFactory.getBilan().then(function (data) {
                $scope.labels = ['Jour','Semaine','Mois','Année'];
                $scope.data = [data];
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
            }, function (msg) {
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
                displayMessage(msg, "error");
            });
        }

        $scope.$watch("perfect_date", function(){
            if($scope.perfect_date){
                d = new Date($scope.perfect_date).toJSON();
                BilanFactory.getBilanByPerfectDate(d).then(function (data) {
                    $scope.data = [data];
                    $scope.labels = ['Date sélectionnée'];
                }, function (msg) {
                    displayMessage(msg, "error");
                });
            }
        });

        $scope.default = function (){
            console.log("ouh yééé");
            bilan_default();
        };
    }]);