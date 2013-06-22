//be logged in to access api
function restrictUserToSelf (req, res, next) {
  if (!req.session.user) {
    res.send('Unauthorized', 401)
  } else {
    next()
  }
}

module.exports = restrictUserToSelf