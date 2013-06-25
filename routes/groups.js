module.exports = function(app) {
  //f5 shouldnt 500
  app.get('/groups', function(req, res) {
    res.redirect('/')
  })

  app.post('/groups', function(req, res, next) {
    var openid = req.session.user.openid
      , group = req.body.group

    app.db.addGroup(openid, group, function(err) {
      if (err) next(err)
    })
  })
}