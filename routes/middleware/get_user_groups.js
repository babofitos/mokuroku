function getUserGroups(req, res, next) {
  //req.session.user has groups array
  //if logged in, extract
  if (req.session.user) {
    res.locals.groups = req.session.user.groups
    console.log('groups', req.session)
  }
  next()
}

module.exports = getUserGroups