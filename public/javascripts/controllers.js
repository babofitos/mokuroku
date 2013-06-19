function IndexCtrl($scope, $http, $location) {
  $http.get('/list').success(function(data, status) {
    console.log('data', data)
    var len = data.length
    for (var i=0;i<len;i++) {
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
    $http.post('/list', postData).success(function(data) {
      data.edit = false
      data.submit = true
      data.delete = false
      data.cancel = true
      $scope.loots.push(data)
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