angular.module('lootlist', [])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/index'
      , controller: 'IndexCtrl'
      })
      .otherwise({redirectTo: '/'})
    $locationProvider.html5Mode(true)
  }])