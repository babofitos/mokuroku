
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , api = require('./routes/api')
  , config = require('./config.json')
  , MongoStore = require('connect-mongo')(express)
  , passport = require('passport')

var app = express()

var db = app.settings.env == 'development' ? 
  require('./lib/db')('lootlistdb', 'localhost', 27017) : require('./lib/db')('', '', 27017)

app.configure(function(){
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
  , store: new MongoStore({
      db: 'lootlistdb'
    })
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(function(req, res, next) {
    res.locals.user = req.user
    next()
  })
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
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

app.get('/', routes.index)

app.get('/partials/:name', routes.partials)
require('./routes/login')(app)
require('./routes/api')(app)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
