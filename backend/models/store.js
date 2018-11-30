import mongoose from 'mongoose';

const Schema = mongoose.Schema;
//Issue changed to -> Store
let Store = new Schema({
    //lat: {type: Number, required: true},
    //lng: {type: Number, required: true},
    coords: {type: [Number], required: true}, // [Long, Lat]
    address: {type: String, required: true},
    street_num: {type: String},
    locality: {type: String},
    zip: {type: String, required: true},
    country: {type: String, required: true, default: 'Norway'},
    descr: {type: String, default: ''},
    type: {type: String, default: ''},
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date, default: Date.now},
    username: {type: String, default: 'admin'},
});

/*
//See https://scotch.io/tutorials/making-mean-apps-with-google-maps-part-i
// Sets the created_at parameter equal to the current time
Store.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
Store.index({location: '2dsphere'});
*/
export default mongoose.model('Store', Store);