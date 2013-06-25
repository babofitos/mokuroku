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
      .when('/groups/:name', {
        templateUrl: '/partials/group'
      , controller: 'GroupCtrl'
      })
      .otherwise({redirectTo: '/'})
    $locationProvider.html5Mode(true)
  }])