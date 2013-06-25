function restrictToGroupMembers (req, res, next) {
  if (req.session.user.groups.indexOf(req.params.name) === -1) {
      res.send(403)
  } else {
      next()
  }
}

module.exports = restrictToGroupMembers