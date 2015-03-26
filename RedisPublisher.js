/**
 * Created by pawan on 3/26/2015.
 */

var redis=require('redis');
var messageFormatter = require('./DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var DbConn = require('./DVP-DBModels');



var client = redis.createClient(6379,"192.168.2.33");
client.on("error", function (err) {
    console.log("Error " + err);
});


function RedisPublish(SID,AID)
{
    client.publish("CSCOMMAND:"+SID+":profile",AID);
}

module.exports.RedisPublish = RedisPublish;
