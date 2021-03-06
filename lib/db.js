var BSON = require('mongodb').BSONPure
  , MongoClient = require('mongodb')

module.exports = function(url) {
  return new Database(url)
}

function Database (url) {
  new MongoClient(url, function(err, db) {
    if (err) throw err
    else {
      this.db = db
    }
  }.bind(this))
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

//get _id from params query and remove doc
Database.prototype.delete = function(docid, cb) {
  this.db.collection('loots', function(err, collection) {
    if (err) cb(err)
    else {
      console.log('docid', docid)
      collection.remove({_id: new BSON.ObjectID(docid)}, function(err) {
        if (err) cb(err)
        else cb(null)
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
          user.insert({openid: openid.openid, groups: []}, function(err, records) {
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

//filter out duplicate group names
Database.prototype.addGroup = function(name, password, cb) {
  this.db.collection('groups', function(err, group) {
    if (err) cb(err)
    else {
      group.findOne(name, function(err, doc) {
        if (err) {
          cb(err)
        } else if (doc) {
          cb(null, true) //true, group exists. can't create dupe
        } else {
          //doesn't exist, make new group
          //and pass false to cb
          group.insert({name: name, password: password}, function(err, doc) {
            if (err) cb(err)
            else cb(null, false)
          })
        }
      })
    }
  })
}

//push new group into groups array
//group is an object with group: 'name', password: 'password'
Database.prototype.addGroupToUser = function(openid, name, cb) {
  this.db.collection('users', function(err, user) {
    if (err) cb(err)
    else {
      user.update({openid: openid}, {$push: {groups: name}}, function(err) {
        if (err) cb(err)
        else {
          cb(null)
        }
      })
    }
  })
}

//when new user joining group, check credentials
Database.prototype.verifyGroup = function(name, password, cb) {
  this.db.collection('groups', function(err, group) {
    if (err) {
      cb(err)
    } else {
      group.findOne({name: name, password: password}, function(err, doc) {
        if (err) {
          cb(err)
        } else {
          if (doc) {
            cb(null, true) //credentials match
          } else {
            cb(null, false) //no documents returned- credentials don't match
          }
        }
      })
    }
  })
}

Database.prototype.getGroupLoot = function(name, cb) {
  this.db.collection('loots', function(err, loot) {
    if (err) {
      cb(err)
    } else {
      loot.find({groupName: name}).toArray(function(err, results) {
        if (err) {
          cb(err)
        } else {
          cb(null, results)
        }
      })
    }
  })
}

Database.prototype.saveGroupLoot = function(name, newLoot, cb) {
  this.db.collection('loots', function(err, loot) {
    if (err) {
      cb(err)
    } else {
      loot.insert({groupName: name, loot: newLoot}, function(err, doc) {
        if (err) cb(err)
        else {
          cb(null, doc[0])
        }
      })
    }
  })
}

Database.prototype.editGroupLoot = function(name, doc, cb) {
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

Database.prototype.deleteGroupLoot = function(docid, cb) {
  this.db.collection('loots', function(err, collection) {
    if (err) cb(err)
    else {
      collection.remove({_id: new BSON.ObjectID(docid)}, function(err) {
        if (err) cb(err)
        else cb(null)
      })
    }
  })
}