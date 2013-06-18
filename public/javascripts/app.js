angular.module('lootlist', [])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/index'
      , controller: 'IndexCtrl'
      })
      // .when('/list/:id/del', {
      //   controller: LootDelCtrl
      // })
      // .when('/list/:id/edit', {
      //   controller: LootEditCtrl
      // })
      .otherwise({redirectTo: '/'})
    $locationProvider.html5Mode(true)
  }])