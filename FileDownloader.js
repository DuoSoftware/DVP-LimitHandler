/**
 * Created by pawan on 3/25/2015.
 */
var http = require('http');
var express = require('express')
    , app = express();
app.listen(2000);
console.log('Express started on port %d', 80);

/*
app.get('/download',function(req,res)
{

    var file = 'C:/Users/pawan/AppData/Local/Temp/upload_ca117bc6669cf397eb4c6b15821a067e';
    res.download(file); // Set disposition and send it.

});
*/

var fs = require('fs');

var file = fs.createWriteStream("file.mp3");
var request = http.get("C:/Users/pawan/AppData/Local/Temp/upload_ca117bc6669cf397eb4c6b15821a067e", function(response) {
    response.pipe(file);
});