var restrictUserToSelf = require('./middleware/restrict_user_to_self')

module.exports = function(app) {
  app.get('/list', restrictUserToSelf, function(req, res, next) {
    //get openid from session and query db
    app.db.all(req.user.openid, function(err, results) {
      if (err) next(err)
      else {
        res.json(results)
      }
    })
  })

  app.post('/list', restrictUserToSelf, function(req, res) {
    app.db.save(req.user.openid, req.body, function(err, result) {
      if (err) {
        next(err)
      }
      else {
        console.log('post list result', result)
        res.json(result)
      }
    })
  })

  app.put('/list', restrictUserToSelf, function(req, res) {
    app.db.edit(req.user.openid, req.body, function(err) {
      if (err) next(err)
      else {
        res.send(200)
      }
    })
  })

  app.del('/list/:id', restrictUserToSelf, function(req, res) {
    app.db.delete(req.params.id, function(err, result) {
      if (err) next(err)
      else res.send(200)
    })
  })
}