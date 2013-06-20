module.exports = function(app) {
  app.get('/list', function(req, res, next) {
    //get openid from session and query db
    app.db.all(req.user.openid, function(err, results) {
      if (err) next(err)
      else {
        res.json(results)
      }
    })
  })

  app.post('/list', function(req, res) {
    console.log(req.body)
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

  app.put('/list', function(req, res) {
    app.db.edit(req.user.openid, req.body, function(err) {
      if (err) next(err)
      else {
        res.send(200)
      }
    })
  })

  app.del('/list/:id', function(req, res) {
    app.db.delete(req.params.id, function(err, result) {
      if (err) next(err)
      else res.send(200)
    })
  })
}