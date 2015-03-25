/**
 * Created by pawan on 3/25/2015.
 */
var http = require('http');
var express = require('express')
    , app = express();
app.listen(7001);
console.log('Express started on port %d', 80);


app.get('/download',function(req,res)
{




    var file = 'C:/Users/pawan/AppData/Local/Temp/upload_7a1cbd8a26675071fd78f5124b326407';
    res.download(file); // Set disposition and send it.



});