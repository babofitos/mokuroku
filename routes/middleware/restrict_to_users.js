//be logged in to access api
function restrictToUsers(req, res, next) {
  if (!req.session.user.openid) {
    res.send('Unauthorized', 401)
  } else {
    next()
  }
}

module.exports = restrictToUsers