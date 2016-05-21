
var express = require('express') ;
var config = require('./config') ;
var Url = require('./db') ;
var app = express();

app.get('/*', function(req, res) {
  var longUrl = req.originalUrl.substring(1) ;
  console.log(longUrl)
  var dataObject = {} ;
  if (! isUrlValid(longUrl) ) {
    dataObject.error = "The passed Url is not valid !"
  } else {
    //dataObject = shortUrl(longUrl);
    Url.findOne({_id: longUrl}, function (err, doc){
      if (doc){
      // URL already shortened => redirect to old URL
        res.redirect(doc.long_url);
      } else {
        //  new URL 
        var newUrl = Url({
        long_url: longUrl
        });
        
        // save the new link
        newUrl.save(function(err) {
          if (err){
            console.log(err);
          }
        });
        
        var shortUrl = config.url + "/" + newUrl._id ;
        dataObject.longUrl = longUrl ;
        dataObject.shortUrl = shortUrl ;
        res.send(dataObject);
      }
      
    })
    
  }
})

app.listen(process.env.PORT);

/**
 * this function will check if the url passed in parameters is valid or not
 * 
 * returns true if Url is valid, false otherwise.
 **/
function isUrlValid(longUrl) {
  return true ;
}


