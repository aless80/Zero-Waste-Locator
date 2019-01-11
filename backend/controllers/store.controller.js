import Store from '../models/store';

// Retrieve all stores from the database.
exports.findAll = (req, res) => {
    Store.find((err, stores) => {
      if (err)
        res.status(400).send('Failed to fetch stores\n' + res.json(err));
      else
        res.json(stores);
    });
  }

// Fetches a single document by _id.
exports.findOne = (req, res) => {
    Store.findById(req.params.id, (err, store) => {
      if (err)
        res.status(400).send('Failed to fetch store\n' + res.json(err));
      else
        res.json(store);
    });
  }
  
//Create new store
exports.create = (req, res) => {
    let store = new Store(req.body);
    store.save()
      .then(store => {
        res.status(200).json('Document Added Successfully');
      })
      .catch(err => {
        res.status(400).send('Failed to create new record\n' + res.json(err));
      });
  }

// Delete a store with the specified id in the request
exports.delete = (req, res) => {
  Store.findByIdAndRemove({_id: req.params.id }, (err, store) => {
    if (err)
      res.json(err);
    else
      res.json('Removed Successfully');
   });
}

// Update a store
exports.update = (req, res) => {
  Store.findById(req.params.id, (err, store) => {
    if (!store) {
      res.json(err);
    } else {
      store.coords = req.body.coords;
      store.address = req.body.address;
      store.street_num = req.body.street_num;
      store.locality = req.body.locality;
      store.zip = req.body.zip;
      store.country = req.body.country;
      store.descr = req.body.descr;
      store.types = req.body.types;
      store.username = req.body.username;
      store.rating = req.body.rating;
      store.save().then(store => {
        res.json('Update Complete');
      }).catch(err => {
        res.status(400).send('Update failed\n' + res.json(err));
      });
    }
  });
}

// Fetch any document by field
//It also works with "types" files, which is an array
exports.fetchfield = (req, res) => {
    var query = {};
    if (req.body == '*') {
      query[req.params.field] = {$exists: true}
    } else {
      query[req.params.field] = { $in: req.body};
    }
    Store.find(query)
      .exec((err, results) => {
          if (err)
            res.status(400).send('Failed to fetch documents\n' + res.json(err));
          else
            res.json(results);
      })
  }

// Finds distinct values in field
//It also works with "types" files, which is an array
exports.distinct = (req, res) => {
    Store.distinct(req.params.field)
      .exec((err, results) => {
          if (err)
            res.status(400).send('Failed to fetch distinct fields\n' + res.json(err));
          else
            res.json(results);
      })
  }

// Check if a document exists
exports.exist = (req, res) => {
    //:address can be part of the full address, for example 'hamps elisées 14 1234 Pari'
    //MongoDB aggregation. 1) put together a full address without commas; 2) match the incoming address parameter as substring; 3) return the whole matching document(s).  
    Store.aggregate([ 
      { 
        $project: {
          "doc":"$$ROOT", 
          full_address: { 
            $concat: [ "$address"," ","$street_num"," ","$zip"," ","$locality"," ","$country"]
          }
        }
      }, 
      { 
        $match: {
          full_address: {
            '$regex': req.params.address, //eg: "rregaards gate 60C 0174 oslo no", 
            '$options': 'i'
          }
        }
      },
      { 
        $replaceRoot: {
          newRoot: "$doc"
        }
      } 
    ])
    .exec((err, stores) => {
        if (err)
          res.status(400).send('/stores/exists failed\n' + res.json(err));
        else {
          console.log('/stores/exists ',stores.length,' match' + (stores.length != 1 ? 'es' : '') + ' on: ', req.params.address)
          res.json(stores);
        }
      })
    }

// Not used: Get 5 documents in order of nearest to farthest
exports.near = (req, res) => {
    Store.aggregate([{
      $geoNear: {
         near: { type: "Point", coordinates: req.body.coords }, //not sure what is "Point"
         spherical: true,
         maxDistance: 200,
         //query: {address : "some address" },
         distanceField: "dist.calculated", //output field with distance
         includeLocs: "dist.location", //output field with the location used for the distance
         num: 5       
      }
    }])
      .exec((err, stores) => {
        if (err)
          res.status(400).send('Failed to verify the stores\n' + res.json(err));
        else
          res.json(stores);
      })
    } 

// Geocoding using node-geocoder
exports.nodegeocoder = (req, res) => {
  geocoder.geocode(req.params.address)
  .then(data => {
    res.json(data);
  },reason => {
    console.log('Geocoding rejected\n',reason)
  })
  .catch(err => {
    console.log('Geocoding failed\n' + err);
  });
}
