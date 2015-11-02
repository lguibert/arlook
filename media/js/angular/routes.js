app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/login", {templateUrl: 'templates/login.html'})
        .when('/products/', {templateUrl: 'templates/product/products.html'})
        .when('/product/new/', {templateUrl: 'templates/product/add_product.html'})

        .when('/clients/', {templateUrl: 'templates/client/clients.html'})
        .when('/client/new/', {templateUrl: 'templates/client/add_client.html'})
        .when('/client/:uuid/', {templateUrl: 'templates/client/client.html'})

        .when('/myaccount/', {templateUrl: 'templates/account.html'})

        .when('/bilan/', {templateUrl: 'templates/bilan.html', data: {role: ['admin']}})
        .otherwise({redirectTo: '/login'});
}]);

app.run(['$rootScope', '$location', '$cookieStore', '$http', function ($rootScope, $location, $cookieStore, $http) {
// keep user logged in after page refresh

    $rootScope.$on( "$routeChangeStart", function(event, next) {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            $rootScope.logged = true;
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