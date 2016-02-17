app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/login", {templateUrl: 'templates/login.html'})
        .when('/products/', {templateUrl: 'templates/product/products.html'})
        .when('/product/new/', {templateUrl: 'templates/product/add_product.html'})
        .when('/product/update/:uuid', {templateUrl: 'templates/product/update_product.html'})
        .when('/product/:uuid/', {templateUrl: 'templates/product/product.html'})

        .when('/clients/', {templateUrl: 'templates/client/clients.html'})
        .when('/client/new/', {templateUrl: 'templates/client/add_client.html'})
        .when('/client/update/:uuid', {templateUrl: 'templates/client/update_client.html'})
        .when('/client/:uuid/', {templateUrl: 'templates/client/client.html'})

        .when('/user/new/', {templateUrl: 'templates/user/add_user.html', data: {role: ['admin']}})

        .when('/myaccount/', {templateUrl: 'templates/account.html'})

        .when('/bilan/', {templateUrl: 'templates/bilan.html', data: {role: ['admin']}})
        .otherwise({redirectTo: '/myaccount'});
}]);

app.run(['$rootScope', '$location', '$cookieStore', '$http', function ($rootScope, $location, $cookieStore, $http) {
// keep user logged in after page refresh


    $rootScope.$on( "$routeChangeStart", function(event, next) {
        delete $rootScope.user_validated;
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            $rootScope.logged = true;
            $rootScope.role = $rootScope.globals.currentUser.role;
        }

        var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
        var loggedIn = $rootScope.globals.currentUser;

        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }

        if(loggedIn){
            if(next.data){
                var roles = next.data.role;

                var right = $.inArray($rootScope.globals.currentUser.role, roles);

                if(right === -1){
                    $location.path('/myaccount');
                }
            }
        }
    });
}]);