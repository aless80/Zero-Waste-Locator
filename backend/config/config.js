// Load environment variables
import path from 'path';
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv')
    const result = dotenv.config({path:'../.env'})
}

module.exports.port = process.env.NODE_PORT || 4000;
module.exports.host = process.env.NODE_HOST || 'localhost';
module.exports.protocol = process.env.NODE_PROTOCOL || 'http';
module.exports.mongoDB = process.env.MONGODB || 'mongodb://localhost:27017/stores';
module.exports.ngport = process.env.NG_PORT || 4200;
module.exports.nghost = process.env.NG_HOST || 'localhost';
module.exports.ngprotocol = process.env.NG_PROTOCOL || 'http';

// Connects to the MongoDB database collections
if(process.env.NODE_ENV === 'production'){
    module.exports.port = 443;
    module.exports.host = 'myhost.com';
    module.exports.protocol = 'https';
    module.exports.ngport = 4200;
    module.exports.nghost = 'myhost.com';
    module.exports.ngprotocol = 'https';
    module.exports.mongoAuth = {
        URI: 'mongodb://abcdefg:abcdefg@ds215961.mlab.com:15961/meanauth-dev',
        secret: 'yoursecret'
    }
} else {
    module.exports.mongoAuth = {
        URI: 'mongodb://localhost:27017/meanauth',
        secret: 'yoursecret'
    }
}