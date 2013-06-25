var restrictToUsers = require('./middleware/restrict_to_users')
  , getUserGroups = require('./middleware/get_user_groups')

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
}