
var express = require('express') ;
var config = require('./config') ;
var Url = require('./db') ;
var app = express();

app.get('/*', function(req, res) {
  var longUrl = req.originalUrl.substring(1) ;
  Url.findOne({_id: longUrl}, function (err, doc){
    if (doc){
    // URL already shortened => redirect to old URL
      res.redirect(doc.long_url);
    } else {
      //  new URL
      var dataObject = {} ; //will contain the result
      dataObject.longUrl = longUrl ;
      if (! isUrlValid(longUrl) ) { // if url not valid we send it in the response with an error message
        dataObject.error = "The passed Url is not valid !"
        res.send(dataObject) ;
        return ;
      }
      //url is valid 
      Url.findOne({long_url: longUrl}, function (err, doc){
        if (doc) { // we already have an entry for this url so just configure the res and send it
          dataObject.shortUrl = config.url + "/" + doc._id ;
        } else { // create new entry
            dataObject.shortUrl = shortenUrl(longUrl) ;
        }
        res.send(dataObject);
      })

    }
  })
  
   
})

app.listen(process.env.PORT);

/**
 * this function will check if the url passed in parameters is valid or not
 * 
 * returns true if Url is valid, false otherwise.
 **/
function isUrlValid(longUrl) {
   var pattern = new RegExp('^https?://(www)\.[A-Za-z0-9_]+\.com$');
  return pattern.test(longUrl);
}

/**
 * this function will create a new entry in db for the long url passed in params
 * return the short url
 */
function shortenUrl(longUrl) {
  var newUrl = Url({
              long_url: longUrl
            });
  // save the new link in the db
  newUrl.save(function(err) {
    if (err){
      console.log(err);
    }
  });
  // the short url will just be the id of the saved url in the db. Todo : optimize this.  
  var shortUrl = config.url + "/" + newUrl._id ;
  return shortUrl ;
}
