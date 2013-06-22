var apikey = require('../config.json').steamapikey
  , request = require('request')
  , host = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='

//if user logged in, take steamid from claimed identifier and api call steam
//for various steam info
function getSteamSummary(req, res, next) {
  if (req.user) {
    var steamid = req.user.openid.split('/')[5]
    console.log('steamid', steamid)
    request(host+apikey+'&steamids='+steamid, function(err, resp, body) {
      if (err) next(err)
      else {
        var playerSummary = JSON.parse(body).response.players[0]
        res.render('layout', {steam: playerSummary})
      }
    })
  } else {
    next()
  }
}

module.exports = getSteamSummary
