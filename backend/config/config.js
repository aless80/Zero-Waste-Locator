// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv')
    const result = dotenv.config({path:'./.env'})
}

// Back- and front-end URLs
module.exports.port = process.env.NODE_PORT || 4000;
module.exports.host = process.env.NODE_HOST || 'localhost';
module.exports.protocol = process.env.NODE_PROTOCOL || 'http';
module.exports.ng_url = process.env.NG_URL || 'http://localhost:4000';

// MongoDB database
module.exports.mongoDB = process.env.MONGODB || 'mongodb://localhost:27017/stores';
module.exports.mongoDBsecret = process.env.MONGODBsecret || 'my secret';

/*
// Connects to the MongoDB database collections
if(process.env.NODE_ENV === 'production'){
}
*/