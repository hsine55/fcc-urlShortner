var config = require('./config') ;

// setting up the database
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);
var Schema = mongoose.Schema;

var urlSchema = new Schema({
  long_url: String,
  created_at: Date
});

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;