function csrf(req, res, next) {
  res.locals.token = req.session._csrf
  next()
}

function csrfValue (req) {
  var token = (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token'])
    || (req.headers['x-xsrf-token'])
  return token
}

exports.csrf = csrf
exports.csrfValue = csrfValue