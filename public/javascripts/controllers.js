function IndexCtrl($scope, $http, $location) {
  $http.get('/list').success(function(data, status) {
    $scope.loots = data
  })
  $scope.go = function() {
    var postData = {
      xcoord: $scope.xcoord
    , ycoord: $scope.ycoord
    , comment: $scope.comment
    , date: new Date().toString()
    }
    $http.post('/list/new', postData).success(function() {
      $scope.loots.push(postData)
      $scope.xcoord = ''
      $scope.ycoord = ''
      $scope.comment = ''
    })
  }
}

// function LootDelCtrl($scope, $routeParams) {
  
// }

// function LootEditCtrl($scope, $routeParams) {
  
// }