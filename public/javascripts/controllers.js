function IndexCtrl($scope, $http, $location) {
  $http.get('/list').success(function(data, status) {
    var len = data.length
    for (var i=0;i<len;i++) {
      data[i].edit = false
      data[i].submit = true
      data[i].delete = false
      data[i].cancel = true
      data[i].readonly = true
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
    //get current loot and save to access incase user cancels
    //clone it using JSON so that it doesnt reference same obj
    $scope[loot._id] = JSON.parse(JSON.stringify(loot))
    editModeToggle(loot)
  }

  $scope.submitEdited = function(loot, $index) {
    var putData = {
      _id: loot._id
    , loot: {
        xcoord: loot.loot.xcoord
      , ycoord: loot.loot.ycoord
      , comment: loot.loot.comment
      , date: new Date().toString()
      } 
    }
    $http.put('/list', putData).success(function() {
      loot.loot = putData.loot
      editModeToggle(loot)
      $scope.loots[$index] = loot
    })
  }

  $scope.delete = function(loot) {
    $http.delete()
  }

  $scope.cancel = function(loot, $index) {
    //reverting to old data saved inside .edit
    $scope.loots[$index] = $scope[loot._id]
    editModeToggle(loot)
  }
}

function editModeToggle(inst) {
  inst.edit = !inst.edit
  inst.submit = !inst.submit
  inst.delete = !inst.delete
  inst.cancel = !inst.cancel
  inst.readonly = !inst.readonly
}