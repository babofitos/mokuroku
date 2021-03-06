
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , api = require('./routes/api')
  , MongoStore = require('connect-mongo')(express)
  , passport = require('passport')
  , csrf = require('./routes/middleware/csrf').csrf
  , csrfValue = require('./routes/middleware/csrf').csrfValue
  , getSteamSummary = require('./routes/middleware/steamapi')

var app = express()

var config = app.settings.env == 'development' ? require('./config.json') 
  : require('./config-production.json')

app.config = config

var db = require('./lib/db')(config.db)

var sessionStore = {
  db: config.db_name
, port: config.port
, host: config.host
, username: config.user
, password: config.pw
}

app.configure(function(){
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.db = db
  app.passport = passport
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.limit('50kb'))
  app.use(express.bodyParser());
  app.use(express.cookieParser())
  app.use(express.session({
    secret: config.cookie_secret
  , store: new MongoStore(sessionStore)
  , cookie: {maxAge: 1000*60*60*24*365}
  }))
  app.use(passport.initialize())
  //set value to receive x-xsrf-token header
  app.use(express.csrf({value: csrfValue}))
  app.use(function(req, res, next) {
    //set cookie for angular csrf
    res.cookie('XSRF-TOKEN', req.session._csrf)
    next()
  })
  app.use(function(req, res, next) {
    //access user variable from templates
    res.locals.user = req.session.user
    next()
  })
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(function(err, req, res, next) {
    if (err) {
      console.log(err)
      res.send(500, 'Something went wrong')
    }
    else res.send(404, 'Page not found')
  })
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', csrf, getSteamSummary, routes.index)

app.get('/partials/:name', routes.partials)

require('./routes/groups')(app)

require('./routes/session')(app)
require('./routes/api')(app)


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
