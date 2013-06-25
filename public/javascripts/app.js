angular.module('lootlist', [])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/index'
      , controller: 'IndexCtrl'
      })
      .when('/groups/', {
        templateUrl: '/partials/groups_new'
      , controller: 'NewGroupsCtrl'
      })
      .when('/join/', {
        templateUrl: '/partials/groups_join'
      , controller: 'JoinGroupsCtrl'
      })
      .otherwise({redirectTo: '/'})
    $locationProvider.html5Mode(true)
  }])