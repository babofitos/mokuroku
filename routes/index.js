
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('layout', {steam:''});
}

exports.partials = function (req, res) {
  var name = req.params.name
  res.render('partials/' + name)
}