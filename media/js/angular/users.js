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
        }
    };
}]);

app.controller('UserController', ['$scope', '$rootScope', 'UserFactory', '$location', function ($scope, $rootScope, UserFactory, $location) {
    $scope.update_password = function(user){
        UserFactory.updateUser([md5(user.password), $rootScope.globals.currentUser.username]).then(function () {
            $location.path("/logout");
            displayMessage("Changement de mot de passe effectué. Veuillez vous reconnecter.", "success");
        }, function (msg) {
            displayMessage(msg, "error");
        });
    };
}]);

app.directive('passwordcheck', function($q) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$asyncValidators.passwordcheck = function(modelValue) {
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