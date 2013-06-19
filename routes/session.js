var SteamStrategy = require('passport-steam').Strategy


module.exports = function(app) {
  app.passport.use(new SteamStrategy({ 
    returnURL: 'http://localhost:3000/auth/return'
    , realm: 'http://localhost:3000'
    }
  , function(identifier, profile, done) {
      app.db.findByOpenID({openid: identifier}, function(err, user) {
        return done(err, user)
      })
    }
  ))


  app.passport.serializeUser(function(user, done) {
    console.log('user', user)
    done(null, user)
  })

  app.passport.deserializeUser(function(doc, done) {
    console.log('openid', doc)
    app.db.findByOpenID({openid: doc.openid}, function(err, result) {
      if (err) res.send(404)
      else {
        console.log('id', result)
        done(null, result)
      }
    })
  })

  app.get('/session', app.passport.authenticate('steam', {failureRedirect: '/'}),
    function(req, res, next) {}
  )

  app.get('/auth/return', app.passport.authenticate('steam', {failureRedirect: '/'}),
    function(req, res) {
      res.redirect('/')
    }
  )

  app.del('/session', function(req, res, next) {
    req.session.destroy()
    //passport thing
    req.logout()
    res.redirect('/')
  })
}
