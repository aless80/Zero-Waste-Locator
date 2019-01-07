module.exports.port = process.env.PORT || 4000;

module.exports.mongoStores = 'mongodb://localhost:27017/stores';

// Connects to the MongoDB database collections
if(process.env.NODE_ENV === 'production'){
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