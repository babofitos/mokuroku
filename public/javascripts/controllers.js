function IndexCtrl($scope, $http, $location) {
  $http.get('/list').success(function(data, status) {
    var len = data.loot.length
    for (var i=0;i<len;i++) {
      data.loot[i].edit = false
      data.loot[i].submit = true
      data.loot[i].delete = false
      data.loot[i].cancel = true
      data.loot[i].readonly = true
    }
    $scope.loots = data.loot
    $scope.groups = data.groups
  })

  $scope.readableDate = function(date) {
    var date = new Date(date).toString().split(' GMT')
    return date[0]
  }

  $scope.submit = function() {
    var postData = {
      xcoord: $scope.xcoord
    , ycoord: $scope.ycoord
    , comment: $scope.comment
    , date: Date.now()
    }
    $http.post('/list', postData).success(function(data) {
      data.edit = false
      data.submit = true
      data.delete = false
      data.cancel = true
      data.readonly = true
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
      , date: Date.now()
      } 
    }
    $http.put('/list', putData).success(function() {
      loot.loot = putData.loot
      editModeToggle(loot)
      $scope.loots[$index] = loot
    })
  }

  $scope.delete = function(loot, $index) {
    $http.delete('/list/'+loot._id).success(function() {
      $scope.loots.splice($index, 1)
    })
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

function NewGroupsCtrl($scope, $http, $location) {
  $scope.submit = function() {
    var postData = {
      group: $scope.group
    , password: $scope.password
    }

    $http.post('/groups', postData).success(function(data) {
      $location.path('/')
    })
  }
}

function JoinGroupsCtrl($scope, $http, $location) {
  $scope.submit = function() {
    var postData = {
      group: $scope.group
    , password: $scope.password
    }

    $http.post('/join', postData).success(function(data) {
      $location.path('/')
    })
  }
}