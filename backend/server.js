import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Store from './models/store';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

// Connects to the MongoDB database collection.
mongoose.connect('mongodb://localhost:27017/stores', { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});


// Settings for node-geocoder
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'YOUR API KEY ENABLED FOR SERVER USE ',
  formatter: null
};
var geocoder = NodeGeocoder(options);

// Geocoding using node-geocoder
router.route('/stores/geopromise/:address').get((req, res) => {
  geocoder.geocode(req.params.address)
  .then(data => {
    res.json(data);
  },reason => {
    console.log('Geocoding rejected\n',reason)
  })
  .catch(err => {
    console.log('Geocoding failed\n' + err);
  });
});


// Fetches all documents.
router.route('/stores').get((req, res) => {
  console.log('/stores')
  Store.find((err, stores) => {
    if (err)
      res.status(400).send('Failed to fetch stores\n' + res.json(err));
    else
      res.json(stores);
  });
});

// Fetches a single document by _id.
router.route('/stores/get/:id').get((req, res) => {
  console.log('/stores/'+req.params.id)
  Store.findById(req.params.id, (err, store) => {
    if (err)
      res.status(400).send('Failed to fetch store\n' + res.json(err));
    else
      res.json(store);
  });
});

// Adds a document.
router.route('/stores/add').post((req, res) => {
  console.log('/stores/add')
  let store = new Store(req.body);
  store.save()
    .then(store => {
      res.status(200).json('Document Added Successfully');
    })
    .catch(err => {
      res.status(400).send('Failed to create new record\n' + res.json(err));
    });
});

// Deletes a single document by _id.
router.route('/stores/delete/:id').get((req, res) => {
  console.log('/stores/delete/',req.params.id)
  Store.findByIdAndRemove({_id: req.params.id }, (err, store) => {
    if (err)
      res.json(err);
    else
      res.json('Removed Successfully');
   });
});

// Updates an existing document.
router.route('/stores/update/:id').post((req, res) => {
  console.log('/stores/update/'+req.params.id)
  Store.findById(req.params.id, (err, store) => {
    if (!store)
      return next(new Error('Could not load document'));
    else {
      store.coords = req.body.coords;
      store.address = req.body.address;
      store.street_num = req.body.street_num;
      store.locality = req.body.locality;
      store.zip = req.body.zip;
      store.country = req.body.country;
      store.descr = req.body.descr;
      store.types = req.body.types;
      store.username = req.body.username;
      store.save().then(store => {
        res.json('Update Complete');
      }).catch(err => {
        res.status(400).send('Update failed\n' + res.json(err));
      });
    }
  });
});

// Finds distinct values in field. It also works with "types" files, which is an array
router.route('/stores/distinct/:field').get((req, res) => {
  console.log('/stores/distinct/'+req.params.field)
  Store.distinct(req.params.field)
    .exec((err, results) => {
        if (err)
          res.status(400).send('Failed to fetch distinct fields\n' + res.json(err));
        else
          res.json(results);
    })
});

// Check if document exists
router.route('/stores/exists/:address').get((req, res) => {
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
  });



// Get 5 documents in order of nearest to farthest
router.route('/stores/near').post((req, res) => {
  console.log('/stores/near ',req.body.coords)
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
  });


app.use('/', router);
// Establishes which port the backend runs on.
app.listen(4000, () => console.log('Express server running on port 4000'));
