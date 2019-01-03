if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://abcdefg:abcdefg@ds215961.mlab.com:15961/meanauth-dev',
                    secret: 'yoursecret'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost:27017/meanauth',
                    secret: 'yoursecret'}
}