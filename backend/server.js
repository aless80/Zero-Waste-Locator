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
mongoose.connect('mongodb://localhost:27017/stores');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});


// Fetches all documents.
router.route('/stores').get((req, res) => {
  Store.find((err, stores) => {
    if (err)
      console.log(err);
    else
      res.json(stores);
  });
});

// Fetches a single document by _id.
router.route('/stores/:id').get((req, res) => {
  Store.findById(req.params.id, (err, store) => {
    if (err)
      console.log(err);
    else
      res.json(store);
  });
});

// Adds a document.
router.route('/stores/add').post((req, res) => {
  let store = new Store(req.body);
  store.save()
    .then(store => {
      res.status(200).json({'store': 'Added Successfully'});
    })
    .catch(err => {
      res.status(400).send('Failed to create new record');
    });
});

// Updates an existing document.
router.route('/stores/update/:id').post((req, res) => {
  Store.findById(req.params.id, (err, store) => {
    if (!store)
      return next(new Error('Could not load document'));
    else {
      store.title = req.body.title;
      store.responsible = req.body.responsible;
      store.description = req.body.description;
      store.severity = req.body.severity;
      store.status = req.body.status;

      store.save().then(store => {
        res.json('Update Complete');
      }).catch(err => {
        res.status(400).send('Update failed');
      });
    }
  });
});

// Deletes a single document by _id.
router.route('/stores/delete/:id').get((req, res) => {
  Store.findByIdAndRemove({_id: req.params.id }, (err, store) => {
    if (err)
      res.json(err);
    else
      res.json('Removed Successfully');
   });
});

app.use('/', router);

// Establishes which port the backend runs on.
app.listen(4000, () => console.log('Express server running on port 4000'));