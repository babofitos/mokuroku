var Db = require('mongodb').Db
  , Server = require('mongodb').Server

module.exports = function(db, host, port) {
  return new Database(db, host, port)
}

function Database(db, host, port) {
  this.db = new Db(db, new Server(host, port), {w: 1})
  this.db.open(function(err) {
    if (err) throw err
  })
}

Database.prototype.all = function(cb) {
  this.db.collection('loots', function(err, collection) {
    if (err) cb(err)
    else {
      collection.find().toArray(function(err, data) {
        if (err) cb(err)
        else cb(null, data)
      })
    }
  })
}

Database.prototype.delete = function(id, cb) {
  this.db.collection('loots', function(err, collection) {
    if (err) cb(err)
    else {
      collection.remove({_id: id}, function(err, result) {
        if (err) cb(err)
        else cb(null, result)
      })
    }
  })
}

Database.prototype.save = function(loot, cb) {
  this.db.collection('loots', function(err, collection) {
    if (err) cb(err)
    else {
      collection.insert(loot, function(err, result) {
        if (err) cb(err)
        else cb(null, result)
      })
    }
  })
}

Database.prototype.edit = function(id, doc, cb) {
  this.db.collection('loots', function(err, collection) {
    if (err) cb(err)
    else {
      collection.update({_id: id}, doc, function(err) {
        if (err) cb(err)
      })
    }
  })
}