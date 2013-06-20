function restrictUserToSelf (req, res, next) {
  if (!req.user || req.session.passport.user.openid !== req.user.openid) {
    res.send('Unauthorized', 401)
  } else {
    next()
  }
}

module.exports = restrictUserToSelf