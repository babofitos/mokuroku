function getUserGroups(req, res, next) {
  //req.session.user has groups array
  //if logged in, extract
  if (req.session.user) {
    req.groups = req.session.user.groups
  }
  next()
}

module.exports = getUserGroups