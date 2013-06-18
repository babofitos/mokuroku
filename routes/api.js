module.exports = function(app) {
  app.get('/list', function(req, res, next) {
    app.db.all(function(err, results) {
      if (err) next(err)
      else {
        res.json(results)
      }
    })
  })

  app.post('/list/new', function(req, res) {
    console.log(req.body)
    app.db.save(req.body, function(err, result) {
      if (err) {
        next(err)
      }
      else {
        res.send(200)
      }
    })
  })

  app.put('/list/:id/edit', function(req, res) {
    app.db.edit(req.params.id, req.body, function(err) {
      if (err) next(err)
      else res.send(200)
    })
  })

  app.del('/list/:id/del', function(req, res) {
    app.db.delete(req.params.id, function(err, result) {
      if (err) next(err)
      else res.send(200)
    })
  })
}