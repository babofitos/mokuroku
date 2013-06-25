function getUserGroups(req, res, next) {
  //req.session.user has groups array
  //if logged in, extract
  if (req.session.user) {
    req.groups = req.session.user.groups
    console.log('res locals', res.locals.groups)
    console.log('groups', req.session)
  }
  next()
}

module.exports = getUserGroups