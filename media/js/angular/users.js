app.factory('UserFactory', ['$http', '$q', function ($http, $q) {
    return {
        updateUser: function (user) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'user/update/',
                data: user,
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
        addUser: function (user) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'user/new/',
                data: user,
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
        getMySell: function (user, date) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'user/sell/',
                data: [user, date],
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
        getMyPresta: function (user, date) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'user/presta/',
                data: [user, date],
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
        loginBilan: function (username, password) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: server + 'user/loginBilan/',
                data: [username, password],
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

app.controller('UserController', ['$scope', '$rootScope', 'UserFactory', '$location', '$route', function ($scope, $rootScope, UserFactory, $location, $route) {
    $scope.user = {
        superuser: false
    };
    $scope.active_date = new Date();

    $scope.update_password = function (user) {
        UserFactory.updateUser([md5(user.password), $rootScope.globals.currentUser.username]).then(function () {
            $location.path("/logout");
            displayMessage("Changement de mot de passe effectué. Veuillez vous reconnecter.", "success");
        }, function (msg) {
            displayMessage(msg, "error");
        });
    };

    $scope.add_new = function (user) {
        user.password = md5(user.password);
        UserFactory.addUser(user).then(function () {
            $route.reload();
            displayMessage("Création effectuée.", "success");
        }, function (msg) {
            displayMessage(msg, "error");
        });
    };

    $scope.show_next = function () {
        $(".hide-next + form").toggle();
    };

    $scope.$on('ngRepeatFinished', function () {
        $('#table_sell_bilans').DataTable({
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

    $scope.getMySell = function () {
        UserFactory.getMySell($rootScope.globals.currentUser.username, null).then(function (data) {
            $scope.my_sell = data;
        }, function (msg) {
            displayMessage(msg, "error");
        });
    };

    $scope.getMyPresta = function () {
        UserFactory.getMyPresta($rootScope.globals.currentUser.username, null).then(function (data) {
            $scope.my_presta = data[0];
            $scope.type_pay = data[1];
        }, function (msg) {
            displayMessage(msg, "error");
        });
    };

    $scope.$watch("perfect_date", function () {
        if ($scope.perfect_date) {
            var d = new Date($scope.perfect_date);
            $scope.active_date = d;
            var stringed_date = d.getFullYear() + "-" + (parseInt(d.getMonth()) + 1).toString() + "-" + d.getDate();
            UserFactory.getMySell($rootScope.globals.currentUser.username, stringed_date).then(function (data) {
                $scope.my_sell = data;
            }, function (msg) {
                displayMessage(msg, "error");
            });

            UserFactory.getMyPresta($rootScope.globals.currentUser.username, stringed_date).then(function (data) {
                console.log(data[0]);
                $scope.my_presta = data[0];
                $scope.type_pay = data[1];
            }, function (msg) {
                displayMessage(msg, "error");
            });
        }
    });

    $scope.login_bilan = function (credentials) {
        credentials.password = md5(credentials.password);
        UserFactory.loginBilan($rootScope.globals.currentUser.username, credentials.password).then(function (data) {
            $rootScope.user_validated = true;
            //$scope.user_validated = true;
        }, function (msg) {
            $rootScope.user_validated = false;
            //$scope.user_validated = false;
        });
    }
}]);

app.directive('passwordcheck', function ($q) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$asyncValidators.passwordcheck = function (modelValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    return $q.when();
                }

                var def = $q.defer();

                if (scope.passwordChangeForm.password.$viewValue === modelValue) {
                    def.resolve();
                } else {
                    def.reject();
                }

                return def.promise;
            };
        }
    };
});