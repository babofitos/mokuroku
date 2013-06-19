var SteamStrategy = require('passport-steam').Strategy


module.exports = function(app) {
  app.passport.use(new SteamStrategy({ 
    returnURL: 'http://localhost:3000/auth/return'
    , realm: 'http://localhost:3000'
    }
  , function(identifier, profile, done) {
      app.db.findByOpenID({openid: identifier}, function(err, user) {
        console.log('user', user)
        return done(err, user)
      })
    }
  ))

  app.passport.serializeUser(function(user, done) {
    done(null, user._id)
  })

  app.passport.deserializeUser(function(id, done) {
    app.db.findByID(id, function(err, result) {
      if (err) res.send(404)
      else {
        console.log('id', result)
        done(null, result)
      }
    })
  })

  app.get('/login', app.passport.authenticate('steam', {failureRedirect: '/'}), 
    function(req, res, next) {}
  )

  app.get('/auth/return', app.passport.authenticate('steam', {failureRedirect: '/'}),
    function(req, res) {
      res.redirect('/')
    }
  )
}
