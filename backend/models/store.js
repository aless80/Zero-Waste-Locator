import mongoose from 'mongoose';

const Schema = mongoose.Schema;
//Issue changed to -> Store
let Store = new Schema({
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    address: {
        type: String
    },
    zip: {
        type: String,
    },
    country: {
        type: String,
        default: 'Norway'
    },
});

export default mongoose.model('Store', Store);
