var SteamStrategy = require('passport-steam').Strategy

module.exports = function(app) {
  var strategy = {
    returnURL: app.config.url + "auth/return"
    , realm: app.config.url
  }

  app.passport.use(new SteamStrategy(strategy, function(identifier, profile, done) {
      //callback after finishing auth
      //done passes to passport.authenticate
      return done(null, identifier)
    }
  ))

  app.get('/session', app.passport.authenticate('steam', {failureRedirect: '/'})
  , function(req, res, next) {}
  )

  //on auth callback, check claimed identifier with db. if new user, add to db
  //set session to be the returned document with openid & _id
  app.get('/auth/return', function(req, res, next) {
    app.passport.authenticate('steam', function(err, user, info) {
      if (err || !user) { 
        res.redirect('/')
      } else {
        app.db.findByOpenID({openid: user}, function(err, result) {
          if (err) next(err)
          else {
            req.session.user = result
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
