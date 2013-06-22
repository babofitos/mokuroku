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

  app.get('/session', app.passport.authenticate('steam', {failureRedirect: '/'})
  , function(req, res, next) {}
  )

  //on auth callback, check claimed identifier with db. if new user, add to db
  //set session to be the returned document with openid & _id
  app.get('/auth/return', function(req, res, next) {
    app.passport.authenticate('steam', function(err, user, info) {
      if (err) next(err)
      else if (!user) res.redirect('/')
      else {
        app.db.findByOpenID({openid: user.openid}, function(err, result) {
          if (err) next(err)
          else {
            req.session.user = user
            return res.redirect('/')
          }
        })
      }
    })(req, res, next)
  })

  app.del('/session', function(req, res, next) {
    req.session.destroy()
    res.redirect('/')
  })
}
