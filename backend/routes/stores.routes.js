var express = require('express')
var router = express.Router()
const controller = require('../controllers/store.controller.js');

// Retrieve all stores
router.get('/stores/', controller.findAll);

// Retrieve one store by id
router.get('/stores/get/:id', controller.findOne);

// Create a new store
router.post('/stores/add', controller.create);

// Deletes a single store by _id.
router.get('/stores/delete/:id', controller.delete);

// Updates an existing store
router.post('/stores/update/:id', controller.update);

// Retrieve any store by field and value
router.post('/stores/fetch/:field', controller.fetchfield);
//router.post('fetch/:field', controller.fetchfield);

// Retrieve all distinct values in a field
router.get('/stores/distinct/:field', controller.distinct);

// Check if store exists by address
router.get('/stores/exists/:address', controller.exist);

// Not used in app: Get 5 documents in order of nearest to farthest
router.post('/stores/near', controller.near);

// Node geocoder
router.get('/stores/geopromise/:address', controller.nodegeocoder);

module.exports = router