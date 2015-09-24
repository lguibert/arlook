app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {templateUrl: 'templates/home.html'})
        .when('/products/', {templateUrl: 'templates/product/products.html'})
        .when('/product/new/', {templateUrl: 'templates/product/add_product.html'})
        .when('/product/:uuid/', {templateUrl: 'templates/product/product.html'})

        .when('/clients/', {templateUrl: 'templates/client/clients.html'})
        .when('/client/new/', {templateUrl: 'templates/client/add_client.html'})
        .when('/client/:uuid/', {templateUrl: 'templates/client/client.html'})
        .otherwise({redirectTo: '/'});
}]);