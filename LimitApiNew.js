/**
 * Created by pawan on 3/12/2015.
 */
var restify = require('restify');
var stringify=require('stringify');
var redis=require('redis');
var messageFormatter = require('./DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var uuid = require('node-uuid');
var DbConn = require('./DVP-DBModels');

var client = redis.createClient(6379,"192.168.2.33");
client.on("error", function (err) {
    console.log("Error " + err);
});
var lock = require("redis-lock")(client);

/*
var obj={

    "LimitId" :"number:093ca5a9-9347-4203-a82d-cd02fc75f8c7",
    "CompanyId":"1",
    "Enable":0

}
UpdateEnability(obj,function(err,res)
{
    console.log(res);
});
*/
/*
GetObj('number:82939c80-df2f-4058-9281-d3ccfd43b091',function(err,res)
{
console.log(res);
});
 */





function LimitIncrement(req,callback)
{
    try {
        lock(req, 10000, function (done) {
            DbConn.LimitInfo
                .find({
                    where: {LimitId: req}, attributes: ['MaxCount']
                }
            )
                .complete(function (err, result) {
                    if (!!err) {
                        console.log('An error occurred while searching maxlimit for ID:' + req, err);
                        //logger.info( 'Error found in searching : '+err );
                        //var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                        // res.end(jsonString);
                        setTimeout(function () {     // Simulate some task
                            console.log("Releasing lock now");

                            done(function () {
                                console.log("Lock has been released, and is available for others to use");

                            });
                        }, 1000);
                        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, null);
                        callback(null,jsonString);

                    } else if (!result) {
                        console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );

                        setTimeout(function () {     // Simulate some task
                            console.log("Releasing lock now");

                            done(function () {
                                console.log("Lock has been released, and is available for others to use");

                            });
                        }, 1000);
                        var jsonString = messageFormatter.FormatMessage(result, "EMPTY", false, null);
                        callback(null,jsonString);
                        //console.log("An error occurred in date searching process ");
                        //var jsonString = messageFormatter.FormatMessage(err, "EMPTY", ERROR, result);
                        // res.end(jsonString);


                    } else {
                        try {

                            client.get(req, function (err, reply) {
                                if (err) {

                                    console.log("Error found in searching key : " + req + "in REDIS..");
                                    setTimeout(function () {     // Simulate some task
                                        console.log("Releasing lock now");

                                        done(function () {
                                            console.log("Lock has been released, and is available for others to use");

                                        });
                                    }, 1000);
                                    var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, null);
                                    callback(null, jsonString);
                                }
                                else {
                                    if (result.MaxCount > parseInt(reply)) {
                                        console.log('true in checking');
                                        console.log('max ' + result.MaxCount);
                                        console.log('now current ' + reply);

                                        try {
                                            client.incr(req, function (err, res) {
                                                if (err) {

                                                    setTimeout(function () {     // Simulate some task
                                                        console.log("Releasing lock now");

                                                        done(function () {
                                                            console.log("Lock has been released, and is available for others to use");

                                                        });
                                                    }, 1000);
                                                    var jsonString = messageFormatter.FormatMessage(err, "ERROR found in incrementing", false, null);
                                                    callback(null, jsonString);
                                                }
                                                else {
                                                    console.log('new current ' + res);
                                                    setTimeout(function () {     // Simulate some task
                                                        console.log("Releasing lock now");

                                                        done(function () {
                                                            console.log("Lock has been released, and is available for others to use");

                                                        });
                                                    }, 1000);
                                                    var jsonString = messageFormatter.FormatMessage(null, "SUCCESS New Current Value : "+res, true, null);
                                                    callback(null, jsonString);
                                                }
                                            });
                                        }
                                        catch(ex)
                                        {
                                            var jsonString = messageFormatter.FormatMessage(ex, "Catch exception in incrementing", false, null);
                                            callback(null, jsonString);
                                        }

                                    }
                                    else {
                                        console.log("Maximum limit reached");
                                        setTimeout(function () {     // Simulate some task
                                            console.log("Releasing lock now");

                                            done(function () {
                                                console.log("Lock has been released, and is available for others to use");

                                            });
                                        }, 1000);
                                        var jsonString = messageFormatter.FormatMessage(parseInt(reply), "Maximum limit released", false, null);
                                        callback(null, jsonString);

                                    }
                                }
                            })
                        }

                        catch(ex)
                        {
                            var jsonString = messageFormatter.FormatMessage(ex, "Exception in getting current value", false, null);
                            callback(null, jsonString);
                        }
                    }

                });

        });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in Entering to function Increment", false, null);
        callback(null,jsonString);
    }
}

function LimitDecrement(req,callback)
{
    try {
        lock(req, 10000, function (done) {
            client.get(req, function (err, reply) {
                if (err) {
                    setTimeout(function () {     // Simulate some task
                        console.log("Releasing lock now");

                        done(function () {
                            console.log("Lock has been released, and is available for others to use");

                        });
                    }, 1000);
                    var jsonString = messageFormatter.FormatMessage(err, "Error found in getting current limit", false, null);
                    callback(null, jsonString);
                }
                else {
                    if (parseInt(reply) > 0) {

                        try{
                            client.decr(req, function (err, result) {
                                if (err) {
                                    setTimeout(function () {     // Simulate some task
                                        console.log("Releasing lock now");

                                        done(function () {
                                            console.log("Lock has been released, and is available for others to use");

                                        });
                                    }, 1000);
                                    var jsonString = messageFormatter.FormatMessage(err, "ERROR found in decrementing", false, null);
                                    callback(null, jsonString);
                                }
                                else {
                                    setTimeout(function () {     // Simulate some task
                                        console.log("Releasing lock now");

                                        done(function () {
                                            console.log("Lock has been released, and is available for others to use");

                                        });
                                    }, 1000);
                                    var jsonString = messageFormatter.FormatMessage(err, "Decrement Success", true, null);
                                    callback(null, jsonString);
                                }

                            });

                        }
                        catch(ex)
                        {
                            var jsonString = messageFormatter.FormatMessage(ex, "Exception in decrementing", false, null);
                            callback(null, jsonString);
                        }
                    }
                    else {
                        console.log("Decrement denied ..... Current value is 0");
                        setTimeout(function () {     // Simulate some task
                            console.log("Releasing lock now");

                            done(function () {
                                console.log("Lock has been released, and is available for others to use");

                            });
                        }, 1000);
                        var jsonString = messageFormatter.FormatMessage(parseInt(reply), "Current limit is 0", false, null);
                        callback(null, jsonString);
                    }
                }

            });
        });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in entering to decrement function", false, null);
        callback(null, jsonString);
    }
}

function AddNewLimitRecord(req,callback)
{
    try{
       // var obj=req.body;
    }
    catch(ex)
    {

    }
    try {
        var rand = "number:" + uuid.v4().toString();
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in generating UUID ", false, null);
        callback(null, jsonString);
    }

    try{
        DbConn.LimitInfo.findAll({where: [{LimitId: rand}]}).complete(function (err, ScheduleObject) {
            if (!err && ScheduleObject.length==0) {
                // console.log(cloudEndObject);

                var AppObject = DbConn.LimitInfo
                    .build(
                    {
                        LimitId: rand,
                        //LimitDescription: obj.Action,

                        MaxCount: 3
                        //Enable: obj.EndTime,

                        ///ObjType: obj.ObjType,
                       // ObjCategory: obj.ObjCategory,
                       // CompanyId: obj.CompanyId,
                       // TenantId: obj.TenantId
                        // AddTime: new Date(2009, 10, 11),
                        //  UpdateTime: new Date(2009, 10, 12),
                        // CSDBCloudEndUserId: jobj.CSDBCloudEndUserId


                    }
                )

                AppObject.save().complete(function (err,result) {
                    if (!err) {
                        //  ScheduleObject.addAppointment(AppObject).complete(function (errx, AppInstancex) {

                        var status = 1;


                        // res.write(status.toString());
                        // res.end();
                        //});

                        console.log("..................... Saved Successfully ....................................");


                        client.set(rand,0,function(err,reply)
                        {
                            if(err)
                            {
                                var jsonString = messageFormatter.FormatMessage(err, "Error Found in Saving to redis : "+rand, false, null);
                                callback(null, jsonString);
                            }
                            else
                            {
                                var jsonString = messageFormatter.FormatMessage(err, "Successfully saved to redis : "+rand, true, null);
                                callback(null, jsonString);
                            }

                        });



                    }
                    else {
                        console.log("..................... Error found in saving.................................... : " + err);
                        var jsonString = messageFormatter.FormatMessage(err, "ERROR found in saving to PG", false, null);
                        callback(null, jsonString);
                    }


                });




            }
            else if (ScheduleObject) {
                console.log("................................... Given Cloud End User is invalid ................................ ");
                var jsonString = messageFormatter.FormatMessage(err, "Record already in DB", false, null);
                callback(null, jsonString);
            }
            else {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR found", false, null);
                callback(null, jsonString);
            }


        });
    }
    catch(ex)
    {

    }

}

function GetCurrentLimit(req,callback)
{
    try{


        client.get(req,function(err,result)
        {
           if(err)
           {
               var jsonString = messageFormatter.FormatMessage(err, "Error in searching key :   "+req, false, null);
               callback(null, jsonString);
           }
            else
           {
               var jsonString = messageFormatter.FormatMessage(err, "Successfully generates result : "+result, true, null);
               callback(null, jsonString);
           }

        });

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in Entering to search current limit of :   "+req, false, null);
        callback(null, jsonString);
    }
}

function GetMaxLimit(req,callback)
{
    try{


        DbConn.LimitInfo.findAll({where: [{LimitId: req}],attributes:['MaxCount']}).complete(function (err, ScheduleObject) {
            if (!err && ScheduleObject.length>0)
            {
                var jsonString = messageFormatter.FormatMessage(err, "Record already in DB", true, ScheduleObject);


                callback(ScheduleObject.toString(), jsonString);
            }
            else if (ScheduleObject.length==0) {
                console.log("................................... Given Cloud End User is invalid ................................ ");
                var jsonString = messageFormatter.FormatMessage(err, "No Record in DB", false, null);
                callback(null, jsonString);
            }
            else {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR found", false, null);
                callback(null, jsonString);
            }


        });

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in Entering to search current limit of :   "+req, false, null);
        callback(null, jsonString);
    }
}

function UpdateMaxLimit(req,callback)
{
    try {
        DbConn.LimitInfo
            .update(
            {
                MaxCount: req.MaxCount


            },
            {
                where: [{LimitId: req.LimitId,CompanyId:req.CompanyId}]
            }
        ).then(function (result) {
                //logger.info('Successfully Updated. ');
                console.log(".......................updation is succeeded ....................");
                var jsonString = messageFormatter.FormatMessage(null, "Maxlimit successfully updated for : "+req.LimitId, true, result);
                callback(null, jsonString);

            }).error(function (err) {
                //logger.info('updation error found in saving. : ' + err);
                console.log("updationfailed ! " + err);
                //handle error here
                var jsonString = messageFormatter.FormatMessage(err, "updation", false, null);
                callback(null, jsonString);

            });

    }
    catch (ex)
    {
        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, obj);
        res.end(jsonString);
    }
}

function UpdateEnability(req,callback)
{
    try {
        DbConn.LimitInfo
            .update(
            {
                Enable: req.Enable


            },
            {
                where: [{LimitId: req.LimitId,CompanyId:req.CompanyId}]
            }
        ).then(function (result) {
                //logger.info('Successfully Updated. ');
                console.log(".......................Updation is succeeded ....................");
                var jsonString = messageFormatter.FormatMessage(null, "Maxlimit successfully updated for : "+req.LimitId, true, result);
                callback(null, jsonString);

            }).error(function (err) {
                //logger.info('updation error found in saving. : ' + err);
                console.log("updationfailed ! " + err);
                //handle error here
                var jsonString = messageFormatter.FormatMessage(err, "updation", false, null);
                callback(null, jsonString);

            });

    }
    catch (ex)
    {
        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, obj);
        res.end(jsonString);
    }
}


function GetObj(key,obj) {


    // Simulate a 1 second long operation
    client.get('number:82939c80-df2f-4058-9281-d3ccfd43b091',function (error, reply) {
        if (error) {


            console.log( error);



        }
        else {

            console.log(reply);





        }
    });





};

module.exports.LimitIncrement = LimitIncrement;
module.exports.LimitDecrement = LimitDecrement;
module.exports.AddNewLimitRecord = AddNewLimitRecord;
module.exports.GetCurrentLimit = GetCurrentLimit;
module.exports.GetMaxLimit = GetMaxLimit;
module.exports.UpdateMaxLimit = UpdateMaxLimit;
module.exports.UpdateEnability = UpdateEnability;
