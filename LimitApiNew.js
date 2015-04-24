/**
 * Created by pawan on 3/12/2015.
 */
var restify = require('restify');
var stringify=require('stringify');
var redis=require('redis');
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var uuid = require('node-uuid');
var DbConn = require('DVP-DBModels');
var log4js=require('log4js');
var config = require('config');

var port = config.Redis.port;
var ip=config.Redis.ip;
var hpath=config.Host.hostpath;

log4js.configure(hpath+'/config/log4js_config.json', { cwd: './logs' });
var log = log4js.getLogger("limapi");

var client = redis.createClient(ip,port);
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
log.info("\n.............................................Limit Api Starts....................................................\n");


function LimitIncrement(req,callback)
{
    log.info("\n.............................................Limit increment Starts....................................................\n");
    try {
        log.info("Inputs :- LimitID : "+req);
        lock(req, 1000, function (done) {


            DbConn.LimitInfo
                .find({
                    where: {LimitId: req}, attributes: ['MaxCount']
                }
            )
                .complete(function (err, result) {
                    if (err) {
                        log.error('Error in searching LimitID : '+req+" Error : "+err);
                        console.log('An error occurred while searching maxlimit for ID:' + req, err);

                        setTimeout(function () {
                            log.info('Lock is releasing');// Simulate some task
                            console.log("Releasing lock now");

                            done(function () {
                                log.info('Lock is released, Available for others to use');
                                console.log("Lock has been released, and is available for others to use");

                            });
                        }, 1000);
                        //var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, null);
                        callback(err,false);

                    } else {
                        if (!result) {
                            log.error('No record for LimitID : '+req);
                            console.log('No user with the Extension has been found.');
                            ///logger.info( 'No user found for the requirement. ' );

                            setTimeout(function () {
                                log.info('Lock is releasing');// Simulate some task
                                console.log("Releasing lock now");

                                done(function () {
                                    log.info('Lock is released, Available for others to use');
                                    console.log("Lock has been released, and is available for others to use");

                                });
                            }, 1000);

                            callback('No record', false);

                        }

                        else {



                            try {
                                log.info('Record found for LimitID: '+req+" and Check on redis : "+req);
                                client.get(req, function (err, reply) {
                                    if (err) {
                                        log.error('Error in searching LimitID : '+req+"in redis. Error : "+err);
                                        console.log("Error found in searching key : " + req + "in REDIS..");

                                        setTimeout(function () {
                                            log.info('Lock is releasing');// Simulate some task
                                            console.log("Releasing lock now");

                                            done(function () {
                                                log.info('Lock is released, Available for others to use');
                                                console.log("Lock has been released, and is available for others to use");

                                            });
                                        }, 1000);
                                        //var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, null);
                                        callback(err, false);
                                    }
                                    else {
                                        log.info('Redis returns : '+reply)

                                        log.info("Record's Max count : "+result.MaxCount+" and current count : "+reply);
                                        if (result.MaxCount > parseInt(reply)) {

                                            log.info("Record's Max count : "+result.MaxCount+" > current count : "+reply);

                                            console.log('true in checking');
                                            console.log('max ' + result.MaxCount);
                                            console.log('now current ' + reply);

                                            try {
                                                log.info("Going to make the increment current count of "+req);
                                                client.incr(req, function (err, res) {
                                                    if (err) {
                                                        log.error("Error in Incrementing on redis : "+err);
                                                        console.log('Error in incermenting');
                                                        setTimeout(function () { log.info('Lock is releasing');
                                                            // Simulate some task
                                                            console.log("Releasing lock now");

                                                            done(function () {
                                                                log.info('Lock is released, Available for others to use');
                                                                console.log("Lock has been released, and is available for others to use");

                                                            });
                                                        }, 1000);
                                                        // var jsonString = messageFormatter.FormatMessage(err, "ERROR found in incrementing", false, null);
                                                        callback(err, false);
                                                    }
                                                    else {
                                                        log.info("incrementing is succeeded. New current :  "+res);
                                                        console.log('Successive in incermenting');
                                                        console.log('new current ' + res);
                                                        setTimeout(function () {
                                                            log.info('Lock is releasing');
                                                            console.log("Releasing lock now");

                                                            done(function () {
                                                                log.info('Lock is released, Available for others to use');
                                                                console.log("Lock has been released, and is available for others to use");

                                                            });
                                                        }, 1000);
                                                        //var jsonString = messageFormatter.FormatMessage(null, "SUCCESS New Current Value : "+res, true, null);
                                                        callback(undefined, true);
                                                    }
                                                });
                                            }
                                            catch (ex) {
                                                console.log('Exception in incerment');
                                                log.fatal('Exception : '+ex);
                                                //var jsonString = messageFormatter.FormatMessage(ex, "Catch exception in incrementing", false, null);
                                                callback(ex, false);
                                            }

                                        }
                                        else {
                                            log.info("Maximum limit reached");
                                            console.log("Maximum limit reached");
                                            setTimeout(function () {     // Simulate some task
                                                console.log("Releasing lock now");
                                                log.info('Lock is releasing');

                                                done(function () {
                                                    log.info('Lock is released, Available for others to use');
                                                    console.log("Lock has been released, and is available for others to use");

                                                });
                                            }, 1000);
                                            //var jsonString = messageFormatter.FormatMessage(parseInt(reply), "Maximum limit released", false, null);
                                            callback(undefined, false);

                                        }
                                    }
                                })
                            }

                            catch (ex) {
                                // var jsonString = messageFormatter.FormatMessage(ex, "Exception in getting current value", false, null);
                                log.fatal('Exception : '+ex);
                                callback(ex, false);
                            }
                        }

                    }

                });

        });
    }
    catch(ex)
    {
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception in Entering to function Increment", false, null);
        log.fatal('Exception : '+ex);
        callback(ex,false);
    }
}

function LimitDecrement(req,callback)
{
    log.info("\n.............................................Limit Decrement Starts....................................................\n");
    try {
        log.info("Inputs :- Key : "+req);
        lock(req, 10000, function (done) {
            client.get(req, function (err, reply) {
                if (err) {

                    log.error("Error in getting current value of : " +req+" in redis");

                    setTimeout(function () {
                        log.info('Releasing lock now');
                        console.log("Decrement happened");
                        console.log("Releasing lock now");

                        done(function () {
                            log.info('Lock has been released, and is available for others to use');
                            console.log("Lock has been released, and is available for others to use");

                        });
                    }, 1000);
                    //var jsonString = messageFormatter.FormatMessage(err, "Error found in getting current limit", false, null);
                    callback(null, false);
                }
                else {
                    log.info("Decrement is starting,current value is : "+reply);
                    if (parseInt(reply) > 0) {

                        try{
                            log.info("Current value > 0");
                            client.decr(req, function (err, result) {
                                if (err) {
                                    log.error("Decrementing error occurs : "+err);
                                    console.log('Error in decermententing');
                                    setTimeout(function () {
                                        log.info('Releasing lock now');// Simulate some task
                                        console.log("Releasing lock now");

                                        done(function () {
                                            log.info('Lock has been released, and is available for others to use');
                                            console.log("Lock has been released, and is available for others to use");

                                        });
                                    }, 1000);
                                    var jsonString = messageFormatter.FormatMessage(err, "ERROR found in decrementing", false, null);
                                    callback(null, false);
                                }
                                else {
                                    log.info('Decrementing succeeded');
                                    //console.log('Succesive in incermenting');
                                    setTimeout(function () {     // Simulate some task

                                        log.info('Releasing lock now');
                                        console.log("Releasing lock now");

                                        done(function () {
                                            log.info('Lock has been released, and is available for others to use');
                                            console.log("Lock has been released, and is available for others to use");

                                        });
                                    }, 1000);
                                    var jsonString = messageFormatter.FormatMessage(err, "Decrement Success", true, null);
                                    callback(null, true);
                                }

                            });

                        }
                        catch(ex)
                        {
                            log.fatal('Exception : '+ex);
                            console.log('Exception in incermenting');
                            var jsonString = messageFormatter.FormatMessage(ex, "Exception in decrementing", false, null);
                            callback(null, false);
                        }
                    }
                    else {
                        log.info('Decrement denied.Curremt linit is 0');
                        console.log("Decrement denied ..... Current value is 0");
                        setTimeout(function () {
                            log.info('Releasing lock now');// Simulate some task
                            console.log("Releasing lock now");

                            done(function () {
                                log.info('Lock has been released, and is available for others to use');
                                console.log("Lock has been released, and is available for others to use");

                            });
                        }, 1000);
                        var jsonString = messageFormatter.FormatMessage(parseInt(reply), "Current limit is 0", false, null);
                        callback(null, false);
                    }
                }

            });
        });
    }
    catch(ex)
    {
        log.fatal('Exception : '+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in entering to decrement function", false, null);
        callback(null, false);
    }
}

function AddNewLimitRecord(req,callback)
{
    log.info("\n.............................................Add new LimitRecord Starts....................................................\n");
    log.info("Inputs:- "+req);
    try {
        var rand = "number" + uuid.v4().toString();
        log.info("New UUID : "+rand);
    }
    catch(ex)
    {
        log.fatal("Exception in creating UUID : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in generating UUID ", false, null);
        callback(ex, undefined);
    }

    try{

        DbConn.LimitInfo.findAll({where: [{LimitId: rand}]}).complete(function (err, LimitObject) {

            if(err)
            {
                log.error("Error in Searching Limitrecord for : "+req);
                callback(err,undefined);
            }
            else
            {
                if(!LimitObject)
                {
                    try {
                        var NewLimobj = DbConn.LimitInfo
                            .build(
                            {
                                LimitId: rand,
                                LimitDescription: req.LimitDescription,
                                ObjClass:req.ObjClass,
                                ObjType: req.ObjType,
                                ObjCategory: req.ObjCategory,
                                MaxCount: req.MaxCount,
                                Enable: req.EndTime,
                                CompanyId: obj.CompanyId,
                                TenantId: obj.TenantId
                                // AddTime: new Date(2009, 10, 11),
                                //  UpdateTime: new Date(2009, 10, 12),
                                // CSDBCloudEndUserId: jobj.CSDBCloudEndUserId


                            }
                        )
                    }
                    catch(ex)
                    {
                        log.fatal("Exception : "+ex);
                        callback(ex,undefined);
                    }
                    NewLimobj.save().complete(function (err,result) {
                        if (err) {

                            log.error("Error found in saving to DB : "+err);
                            console.log("..................... Error found in saving.................................... : " + err);
                            var jsonString = messageFormatter.FormatMessage(err, "ERROR found in saving to PG", false, null);
                            callback(null, jsonString);


                        }
                        else {
                            log.info("New Limit info is recorded successfully : "+result);
                            var status = 1;
                            console.log("..................... Saved Successfully ....................................");
                            log.info("Setting redis key : "+rand);
                            client.set(rand,0,function(err,reply)
                            {
                                console.log(rand);
                                if(err)
                                {
                                    log.error("Error in Setting redis key : "+rand);
                                    //var jsonString = messageFormatter.FormatMessage(err, "Error Found in Saving to redis : "+rand, false, null);
                                    callback(err, false);
                                }
                                else
                                {
                                    log.info("Successfully completed ; Setting redis key : "+rand);
                                    //var jsonString = messageFormatter.FormatMessage(err, "Successfully saved to redis : "+rand, true, null);
                                    callback(null, true);
                                }

                            });
                        }


                    });
                }
                else
                {
                    log.error("Record in already in DB ");
                    var jsonString = messageFormatter.FormatMessage(err, "ERROR found", false, null);
                    callback(null, jsonString);
                }
            }


        });
    }
    catch(ex)
    {
        log.fatal("Exception: "+ex);
        var jsonString = messageFormatter.FormatMessage(err, "Exception found", false, null);
        callback(null, jsonString);
    }

}

function GetCurrentLimit(req,callback)
{
    log.info("\n.............................................Get current Limit Starts....................................................\n");
    try{

        log.info("Inputs:- Key: "+req);
        client.get(req,function(err,result)
        {
            if(err)
            {
                log.error("Error in searching key : "+req+" Error : "+err);
                var jsonString = messageFormatter.FormatMessage(err, "Error in searching key :   "+req, false, null);
                callback(err, undefined);
            }
            else
            {
                log.info("Current limit found : "+result);
                var jsonString = messageFormatter.FormatMessage(err, "Successfully generates result : "+result, true, null);
                callback(undefined, result);
            }

        });

    }
    catch(ex)
    {
        log.fatal("Exception : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in Entering to search current limit of :   "+req, false, null);
        callback(ex, undefined);
    }
}

function GetMaxLimit(req,callback)
{
    log.info("\n.............................................Get Current Limit Starts....................................................\n");
    try{

        log.info("Inputs:- ID : "+req);
        DbConn.LimitInfo.findAll({where: [{LimitId: req}],attributes:['MaxCount']}).complete(function (err, LimitObject) {

            if(err)
            {
                log.error("Error in searching record "+err);
                var jsonString = messageFormatter.FormatMessage(err, "ERROR found", false, null);
                callback(err, undefined);
            }
            else
            {
                if(LimitObject)
                {
                    log.info("Records found : "+JSON.stringify(LimitObject));
                    var jsonString = messageFormatter.FormatMessage(err, "Record already in DB", true, LimitObject);
                    callback(undefined,JSON.stringify(LimitObject));
                }
                else
                {
                    log.error("No record found");
                    var jsonString = messageFormatter.FormatMessage(err, "No Record in DB", false, null);
                    callback('Error', undefined);
                }
            }

        });

    }
    catch(ex)
    {
        log.fatal('Exception : '+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in Entering to search current limit of :   "+req, false, null);
        callback(ex, undefined);
    }
}

function UpdateMaxLimit(req,callback)
{
    log.info("\n.............................................Update max Limit Starts....................................................\n");
    try {
        log.info("Inputs : - Key : "+req);
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
                log.info("Max limit is updated : "+result);
                console.log(".......................updation is succeeded ....................");
                var jsonString = messageFormatter.FormatMessage(null, "Maxlimit successfully updated for : "+req.LimitId, true, result);
                callback(null, result);

            }).error(function (err) {
                //logger.info('updation error found in saving. : ' + err);
                log.info("Error in updating max limit");
                console.log("updationfailed ! " + err);
                //handle error here
                var jsonString = messageFormatter.FormatMessage(err, "updation", false, null);
                callback(err, undefined);

            });

    }
    catch (ex)
    {
        log.fatal("Exception : "+ex);
        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, obj);
        res.end(jsonString);
    }
}

function UpdateEnability(req,callback)
{
    log.info("\n.............................................Update enable status   Limit Starts....................................................\n");
    try {
        log.info("Inputs : - ID : "+req);
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
                log.info("Updation succeeded : "+result);
                console.log(".......................Updation is succeeded ....................");
                var jsonString = messageFormatter.FormatMessage(null, "Maxlimit successfully updated for : "+req.LimitId, true, result);
                callback(undefined, true);

            }).error(function (err) {
                //logger.info('updation error found in saving. : ' + err);
                log.error("Updation error : "+err);
                console.log("updationfailed ! " + err);
                //handle error here
                var jsonString = messageFormatter.FormatMessage(err, "updation", false, null);
                callback(err, false);

            });

    }
    catch (ex)
    {
        log.fatal("Exception : "+ex);
        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, obj);
        res.end(jsonString);
    }
}


function GetObj(key,obj) {


    // Simulate a 1 second long operation
    client.set('number:82939c80-df2f-4058-9281-d3ccfd43b091',0,function (error, reply) {
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
module.exports.GetObj = GetObj;
