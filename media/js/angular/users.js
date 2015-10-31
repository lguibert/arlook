app.controller('LoginController', function ($scope, $rootScope, AuthenticationService, $location) {
    $scope.credentials = {
        username: '',
        password: ''
    };

    $rootScope.logged = false;

    $scope.login = function (credentials) {
        AuthenticationService.Login(credentials, function(response){
           if(response.success){
               AuthenticationService.SetCredentials(response.data[0], response.data[1], response.data[2]);
               $rootScope.logged = true;
               $rootScope.role = response.data[2];
               $location.path('/products');
           }else{
               displayMessage(response.msg, "error");
           }
        });
    };

    $scope.logout = function (){
        AuthenticationService.ClearCredentials();
        $location.path("/");
    }
});