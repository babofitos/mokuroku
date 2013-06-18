function IndexCtrl($scope, $http, $location) {
  $http.get('/list').success(function(data, status) {
    for (var i=0;i<data.length;i++) {
      data[i].edit = false
      data[i].submit = true
      data[i].delete = false
      data[i].cancel = true
    }
    $scope.loots = data
  })

  $scope.submit = function() {
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

  $scope.edit = function(loot) {
    loot.edit = true
    loot.submit = false
    loot.delete = true
    loot.cancel = false
  }

  $scope.delete = function(loot) {
    $http.delete()
  }

  $scope.cancel = function(loot) {
    loot.edit = false
    loot.submit = true
    loot.delete = false
    loot.cancel = true
  }
}

// function LootDelCtrl($scope, $routeParams) {
  
// }

// function LootEditCtrl($scope, $routeParams) {
  
// }