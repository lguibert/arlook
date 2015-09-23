app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {templateUrl: 'templates/home.html'})
        .when('/products/new/', {templateUrl: 'templates/add_products.html'})
        .when('/product/:uuid/', {templateUrl: 'templates/product.html'})
        .otherwise({redirectTo: '/'});
}]);