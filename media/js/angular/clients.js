app.factory('ClientsFactory', ['$http', '$q', function ($http, $q) {
    return {
        clients: false,
        getClients: function () {
            var deferred = $q.defer();
            $http.get(server + 'clients/', {cache: true})
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        getClient: function (uuid) {
            var deferred = $q.defer();
            $http.get(server + 'client/' + uuid, {cache: true})
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        addClient: function (client) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'clients/add/',
                data: client,
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


app.controller('ClientsController', ['$scope', '$rootScope', 'superCache', 'ClientsFactory', 'LoadingState', '$route', function ($scope, $rootScope, superCache, ClientsFactory, LoadingState, $route) {
    var cache = superCache.get('clients');

    if (cache) {
        $scope.clients = cache;
    } else {
        LoadingState.setLoadingState(true);
        $scope.loading = LoadingState.getLoadingState();

        ClientsFactory.getClients().then(function (data) {
            $scope.clients = data;

            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
        }, function (msg) {
            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
            displayMessage(msg, "error");
        });
    }

    $scope.$on('ngRepeatFinished', function() {
        $('#table_clients').DataTable({
            "language" :{
                "url": "media/french.json"
            }
        });
    });

    $scope.add_new = function (client) {
        console.log(client);
        ClientsFactory.addClient(client).then(function () {
                displayMessage("Client enregistré.", "success");
                $route.reload();
            },
            function (msg) {
                displayMessage(msg, "error");
            }
        )
        ;
    };
}]);

app.controller('ClientController', ['$scope', '$rootScope', 'superCache', 'ClientsFactory', 'LoadingState', '$routeParams', '$location',
    function ($scope, $rootScope, superCache, ClientsFactory, LoadingState, $routeParams, $location) {
    var cache = superCache.get('client');

    if (cache) {
        $scope.client = cache;
    } else {
        LoadingState.setLoadingState(true);
        $scope.loading = LoadingState.getLoadingState();

        ClientsFactory.getClient($routeParams.uuid).then(function (data) {
            $scope.client = data[0].fields;

            $scope.client['client_lastmodification'] = date_format($scope.client['client_lastmodification']);

            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
        }, function (msg) {
            LoadingState.setLoadingState(false);
            $scope.loading = LoadingState.getLoadingState();
            displayMessage(msg, "error");
        });
    }

    function date_format(date){
        var datesplit = date.split("T");
        return datesplit[0];
    }

    $scope.modification = function(){
        clientbob = $scope.client;
        $location.path("client/new/");
        //$scope.$apply();
    };
}]);

