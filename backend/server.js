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





/*
Ja probleem is dat de code al klaar is voordat de promise resolved
Probeer eens de promise te returnen in de get functie
Dus na de var promise regels een return promise
*/


///Trying to use node-geocoder
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'YOUR API KEY ENABLED FOR SERVER USE ',
  formatter: null
};
var geocoder = NodeGeocoder(options);
// geocoding using node-geocoder
router.route('/stores/geopromise').get((request, response) => {
  geocoder.geocode('29 champs elysée paris').then(data => {
    console.log({ data });
    response.json(data);
  });
  /*
  .then(res => {
      console.log('Geocoding successful:' + res[0].streetName);
    },reason => {
      console.log('rejected',reason)
    })
  .catch(err => {
    console.log('Geocoding failed\n' + err);
  });
  response.json(promise)
  */
});





// Fetches all documents.
router.route('/stores').get((req, res) => {
  Store.find((err, stores) => {
    if (err)
      res.status(400).send('Failed to fetch stores\n' + res.json(err));
    else
      res.json(stores);
  });
});

// Fetches a single document by _id.
router.route('/stores/:id').get((req, res) => {
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
      store.type = req.body.type;
      store.username = req.body.username;
      store.save().then(store => {
        res.json('Update Complete');
      }).catch(err => {
        res.status(400).send('Update failed\n' + res.json(err));
      });
    }
  });
});

// Finds distinct values in field
router.route('/storesdistinct/:field').get((req, res) => { ///:field
  Store.distinct(req.params.field, (err, result) => { //req.params.field
    if (err)
      res.json([]);
      //res.status(400).send('Failed to fetch distinct values from stores\n' + res.json(err));
    else
      res.json(result)
  });
});

app.use('/', router);

// Establishes which port the backend runs on.
app.listen(4000, () => console.log('Express server running on port 4000'));
