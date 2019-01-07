var express = require('express')
var router = express.Router()
const controller = require('../controllers/store.controller.js');

// Retrieve all stores
router.get('/', controller.findAll);

// Retrieve one store by id
router.get('/get/:id', controller.findOne);

// Create a new store
router.post('/add', controller.create);

// Deletes a single store by _id.
router.get('/delete/:id', controller.delete);

// Updates an existing store
router.post('/update/:id', controller.update);

// Retrieve any store by field and value
router.post('fetch/:field', controller.fetchfield);

// Retrieve all distinct values in a field
router.get('/distinct/:field', controller.distinct);

// Check if store exists by address
router.get('/exists/:address', controller.exist);

// Not used in app: Get 5 documents in order of nearest to farthest
router.post('/near', controller.near);

// Node geocoder
router.get('/geopromise/:address', controller.nodegeocoder);

module.exports = router