var restrictToUsers = require('./middleware/restrict_to_users')
  , getUserGroups = require('./middleware/get_user_groups')
  , restrictToGroupMembers = require('./middleware/restrict_to_group_members')

module.exports = function(app) {
  app.get('/list', restrictToUsers, getUserGroups, function(req, res, next) {
    //get openid from session and query db
    app.db.all(req.session.user.openid, function(err, results) {
      if (err) next(err)
      else {
        res.json({
          groups: req.groups
        , loot: results
        })
      }
    })
  })

  app.post('/list', restrictToUsers, function(req, res) {
    app.db.save(req.session.user.openid, req.body, function(err, result) {
      if (err) {
        next(err)
      }
      else {
        res.json(result)
      }
    })
  })

  app.put('/list', restrictToUsers, function(req, res) {
    app.db.edit(req.session.user.openid, req.body, function(err) {
      if (err) next(err)
      else {
        res.send(200)
      }
    })
  })

  app.del('/list/:id', restrictToUsers, function(req, res) {
    app.db.delete(req.params.id, function(err, result) {
      if (err) next(err)
      else res.send(200)
    })
  })

  app.get('/groups/api/:name', restrictToGroupMembers, getUserGroups, function(req, res, next) {
    var name = req.params.name

    app.db.getGroupLoot(name, function(err, loot) {
      if (err) next(err)
      else {
        res.json({
          groups: req.groups
        , loot: loot
        })
      }
    })
  })

  app.post('/groups/api/:name', restrictToGroupMembers, function(req, res, next) {
    var name = req.params.name
      , data = req.body

    app.db.saveGroupLoot(name, data, function(err, result) {
      if (err) next(err)
      else {
        res.json(result)
      }
    })

  })

  app.del('/groups/api/:name/:id', restrictToGroupMembers, function(req, res, next) {
    app.db.deleteGroupLoot(req.params.id, function(err, result) {
      if (err) next(err)
      else res.send(200)
    })

  })

  app.put('/groups/api/:name', restrictToGroupMembers, function(req, res, next) {
    var name = req.params.name

    app.db.editGroupLoot(name, req.body, function(err) {
      if (err) next(err)
      else res.send(200)
    })
  })
}