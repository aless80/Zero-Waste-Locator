const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//Issue changed to -> Store
let Store = new Schema({
    coords: {type: [Number], required: true},
    address: {type: String, required: true},
    street_num: {type: String},
    locality: {type: String},
    zip: {type: String, required: true},
    country: {type: String, required: true, default: 'Norway'},
    descr: {type: String, default: ''},
    types: {type: [String], default: ''},
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date, default: Date.now},
    username: {type: String, default: 'admin'},
    rating: {
        total: {type: Number, default: 0},
        count: {type: Number, default: 0}
      }
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
//Store.index({location: '2dsphere'});

module.export = mongoose.model('Store', Store);