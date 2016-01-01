app.factory('ClientsFactory', ['$http', '$q', function ($http, $q) {
    return {
        clients: false,
        getClients: function () {
            var deferred = $q.defer();
            $http.get(server + 'clients/')
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
            $http.get(server + 'client/' + uuid)
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
        },
        updateClient: function (client) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'client/update/',
                data: client,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data) {
                    deferred.resolve(angular.fromJson(data));
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
        ,
        updateVisitClient: function (uuid, value, username) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'client/visit/',
                data: [uuid, value, username],
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
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

    $scope.$on('ngRepeatFinished', function () {
        $('#table_clients').DataTable({
            "language": {
                "url": "media/french.json"
            }
        });
    });

    $scope.add_new = function (client) {
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

    $scope.update_visit = function (uuid, value){
        ClientsFactory.updateVisitClient(uuid, value, $rootScope.globals.currentUser.username).then(function () {
            $route.reload();
            displayMessage("Mise à jour effectuée.", "success");
        }, function (msg) {
            displayMessage(msg, "error");
        });
    };
}]);

app.controller('ClientController', ['$scope', '$rootScope', 'superCache', 'ClientsFactory', 'LoadingState', '$routeParams', '$location', '$route',
    function ($scope, $rootScope, superCache, ClientsFactory, LoadingState, $routeParams, $location, $route) {
        var cache = superCache.get('client');

        if (cache) {
            $scope.client = cache;
        } else {
            LoadingState.setLoadingState(true);
            $scope.loading = LoadingState.getLoadingState();

            ClientsFactory.getClient($routeParams.uuid).then(function (data) {
                $scope.client = data;

                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
            }, function (msg) {
                LoadingState.setLoadingState(false);
                $scope.loading = LoadingState.getLoadingState();
                displayMessage(msg, "error");
            });
        }

        $scope.update_client = function (client) {
            ClientsFactory.updateClient(client).then(function (data) {
                $location.path("/client/" + data[0]['fields'].client_uuid);
                displayMessage("Mise à jour effectuée.", "success");
            }, function (msg) {
                displayMessage(msg, "error");
            });
        };

        $scope.update_visit = function (uuid, value){
            ClientsFactory.updateVisitClient(uuid, value, $rootScope.globals.currentUser.username).then(function () {
                $route.reload();
                displayMessage("Mise à jour effectuée.", "success");
            }, function (msg) {
                displayMessage(msg, "error");
            });
        };
    }]);

