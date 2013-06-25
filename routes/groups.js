var restrictToGroupMembers = require('./middleware/restrict_to_group_members')

module.exports = function(app) {
  //f5 shouldnt 500
  app.get('/groups', function(req, res) {
    res.redirect('/')
  })

  app.get('/groups/:name', restrictToGroupMembers, function(req, res, next) {
    var name = req.params.name

    app.db.getGroupLoot(name, function(err, loot) {
      if (err) next(err)
      else {
        res.json(loot)
      }
    })
  })

  app.post('/groups/:name', restrictToGroupMembers, function(req, res, next) {
    var name = req.params.name


  })

  app.del('/groups/:name', restrictToGroupMembers, function(req, res, next) {
    var name = req.params.name

  })

  app.put('/groups/:name', restrictToGroupMembers, function(req, res, next) {
    var name = req.params.name
    
  })

  app.post('/groups', function(req, res, next) {
    var openid = req.session.user.openid
      , data = req.body

    //first check if group exists in group collection,
    //if it doesn't, add to user's groups field
    app.db.addGroup(data.group, data.password, function(err, exists) {
      if (err) next(err)
      if (exists) res.send(409)
      else {
        app.db.addGroupToUser(openid, data.group, function(err) {
          if (err) next(err)
          else {
            //update session
            req.session.user.groups.push(data.group)
            res.send(201)
          }
        })
      }
    })
  })

  app.get('/join', function(req, res) {
    res.redirect('/')
  })

  app.post('/join', function(req, res, next) {
    var openid = req.session.user.openid
      , data = req.body

    //make sure user isnt already in group
    if (req.session.user.groups.indexOf(data.group) !== -1) {
      res.send(409)
    } else {
      app.db.verifyGroup(data.group, data.password, function(err, auth) {
        if (err) next(err) 
        else {
          if (auth) {
            res.send(200)
          } else {
            res.send(404)
          }
        }
      })
    }
  })
}