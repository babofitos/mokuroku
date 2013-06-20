var Db = require('mongodb').Db
  , Server = require('mongodb').Server
  , BSON = require('mongodb').BSONPure


module.exports = function(db, host, port) {
  return new Database(db, host, port)
}

function Database(db, host, port) {
  this.db = new Db(db, new Server(host, port), {w: 1})
  this.db.open(function(err) {
    if (err) throw err
  })
}

//http.get from angular to api route
//api.route grabs openid from session and sends it here
//match all documents with openid as its user field and
//return as array
Database.prototype.all = function(openid, cb) {
  this.db.collection('loots', function(err, loot) {
    if (err) cb(err)
    else {
      loot.find({user: openid}).toArray(function(err, data) {
        if (err) cb(err)
        else {
          cb(null, data)
        }
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

//http.post from angular to api route
//grab user openid from session, insert
//new document with user and loot as fields
//returns an array, send first element only
Database.prototype.save = function(openid, newLoot, cb) {
  this.db.collection('loots', function(err, loot) {
    if (err) cb(err)
    else {
      loot.insert({user: openid, loot: newLoot}, function(err, doc) {
        if (err) cb(err)
        else {
          cb(null, doc[0])
        }
      })
    }
  })
}

//http.put from angular to api route
//query old doc by _id and then update it with new loot
Database.prototype.edit = function(openid, doc, cb) {
  this.db.collection('loots', function(err, loot) {
    if (err) cb(err)
    else {
      loot.update({_id: new BSON.ObjectID(doc._id)}, {$set: {loot: doc.loot}}, function(err) {
        if (err) cb(err)
        else cb(null)
      })
    }
  })
}

//query users collection
//if not found, insert since new user
//else return
Database.prototype.findByOpenID = function(openid, cb) {
  this.db.collection('users', function(err, user) {
    if (err) cb(err)
    else {
      user.findOne(openid, function(err, doc) {
        if (err) cb(err)
        else if (!doc) {
          user.insert({openid: openid.openid}, function(err, records) {
            if (err) cb(err)
            else cb(null, records[0])
          })
        }
        else {
          cb(null, doc)
        }
      })
    }
  })
}