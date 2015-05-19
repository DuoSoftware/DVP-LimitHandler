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
var ip = config.Redis.ip;
var hpath=config.Host.hostpath;

log4js.configure(config.Host.logfilepath, { cwd: hpath });
var log = log4js.getLogger("limapi");
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;

var client = redis.createClient(port,ip);
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



function LimitIncrement(req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  LimitIncrement starting  - Data %s',reqId,req);
    try {
        //log.info("Inputs :- LimitID : "+req);
        lock(req, 1000, function (done) {

            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [PGSQL] -  Lock started for %s ',reqId,req);

            DbConn.LimitInfo
                .find({
                    where: {LimitId: req}, attributes: ['MaxCount']
                }
            )
                .complete(function (err, result) {
                    if (err) {
                        //log.error('Error in searching LimitID : '+req+" Error : "+err);
                        //console.log('An error occurred while searching maxlimit for ID:' + req, err);
                        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [PGSQL] -  Error occurred while searching LimitId %s  ',reqId,req,err);

                        setTimeout(function () {
                            //log.info('Lock is releasing');// Simulate some task
                            //console.log("Releasing lock now");
                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is releasing  ',reqId);

                            done(function () {
                               // log.info('Lock is released, Available for others to use');
                                //console.log("Lock has been released, and is available for others to use");
                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId);

                            });
                        }, 1000);
                        //var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, null);
                        callback(err,false);

                    } else {
                        if (!result) {
                            //log.error('No record for LimitID : '+req);
                            //console.log('No user with the Extension has been found.');
                            logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [PGSQL] -  No record for LimitID %s  ',reqId,req,err);
                            ///logger.info( 'No user found for the requirement. ' );

                            setTimeout(function () {
                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is releasing  ',reqId);

                                done(function () {
                                    logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId);

                                });
                            }, 1000);

                            callback('No record', false);

                        }

                        else {



                            try {
                                //log.info('Record found for LimitID: '+req+" and Check on redis : "+req);
                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [PGSQL] -  Record found for LimitID %s  ',reqId,req,err);
                                client.get(req, function (err, reply) {
                                    if (err) {
                                        //log.error('Error in searching LimitID : '+req+"in redis. Error : "+err);
                                        //console.log("Error found in searching key : " + req + "in REDIS..");
                                        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error in searching LimitID %s  ',reqId,req,err);

                                        setTimeout(function () {
                                            //log.info('Lock is releasing');// Simulate some task
                                            //console.log("Releasing lock now");
                                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is releasing  ',reqId);

                                            done(function () {
                                                //log.info('Lock is released, Available for others to use');
                                                //console.log("Lock has been released, and is available for others to use");
                                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId);

                                            });
                                        }, 1000);
                                        //var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, null);
                                        callback(err, false);
                                    }
                                    else {
                                        //log.info('Redis returns : '+reply)
                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis returned records for  LimitID %s  - Data %s',reqId,req,JSON.stringify(reply));

                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis returned records for  LimitID %s  - Max count %s',reqId,req,result.MaxCount);
                                        //log.info("Record's Max count : "+result.MaxCount+" and current count : "+reply);
                                        if (result.MaxCount > parseInt(reply)) {

                                            //log.info("Record's Max count : "+result.MaxCount+" > current count : "+reply);
                                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s]  -  Redis record"s Max count %s >  Current count %s   ',reqId,result.MaxCount,reply);

                                            console.log('true in checking');
                                            console.log('max ' + result.MaxCount);
                                            console.log('now current ' + reply);

                                            try {
                                                //log.info("Going to make the increment current count of "+req);
                                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s]  -  Going to increase current count of ',reqId,req);
                                                client.incr(req, function (err, res) {
                                                    if (err) {
                                                        //log.error("Error in Incrementing on redis : "+err);
                                                        //console.log('Error in incermenting');
                                                        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error in incrementing count of LimitID %s ',reqId,req,err);
                                                        setTimeout(function () { log.info('Lock is releasing');
                                                            // Simulate some task
                                                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is releasing  ',reqId);

                                                            done(function () {
                                                                //log.info('Lock is released, Available for others to use');
                                                                //console.log("Lock has been released, and is available for others to use");
                                                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId)

                                                            });
                                                        }, 1000);
                                                        // var jsonString = messageFormatter.FormatMessage(err, "ERROR found in incrementing", false, null);
                                                        callback(err, false);
                                                    }
                                                    else {
                                                        //log.info("incrementing is succeeded. New current :  "+res);
                                                        //console.log('Successive in incermenting');
                                                        //console.log('new current ' + res);
                                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Count increment is succeeded of LimitId %s current count : %s  ',reqId,req,res);
                                                        setTimeout(function () {
                                                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is releasing  ',reqId);

                                                            done(function () {
                                                                //log.info('Lock is released, Available for others to use');
                                                                //console.log("Lock has been released, and is available for others to use");
                                                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId)

                                                            });
                                                        }, 1000);
                                                        //var jsonString = messageFormatter.FormatMessage(null, "SUCCESS New Current Value : "+res, true, null);
                                                        callback(undefined, true);
                                                    }
                                                });
                                            }
                                            catch (ex) {
                                                //console.log('Exception in incerment');
                                                //log.fatal('Exception : '+ex);
                                                logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] -  Exception occurred while count increment starting   ',reqId,ex);
                                                //var jsonString = messageFormatter.FormatMessage(ex, "Catch exception in incrementing", false, null);
                                                callback(ex, false);
                                            }

                                        }
                                        else {
                                            //log.info("Maximum limit reached");
                                            //console.log("Maximum limit reached");
                                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s]  -  Redis record"s Max count %s <  Current count %s  - Maximum limit reached ',reqId,result.MaxCount,reply);

                                            setTimeout(function () {     // Simulate some task
                                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is releasing  ',reqId);

                                                done(function () {
                                                    logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId);

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
                                //log.fatal('Exception : '+ex);
                                logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Exception occurred when getting current limit  ',reqId,ex);
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
        //log.fatal('Exception : '+ex);
        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Exception occurred when starting method :LimitIncrement',reqId,ex);
        callback(ex,false);
    }
}

function LimitDecrement(req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  LimitDecrement starting  - Data %s',reqId,req);
    try {

        lock(req, 10000, function (done) {
            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] - [PGSQL] -  Lock started for %s ',reqId,req);
            client.get(req, function (err, reply) {
                if (err) {

                    log.error("Error in getting current value of : " +req+" in redis");
                    logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error in searching LimitID %s  ',reqId,req,err);

                    setTimeout(function () {
                        logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is releasing  ',reqId);

                        done(function () {
                            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is released  ',reqId);

                        });
                    }, 1000);
                    //var jsonString = messageFormatter.FormatMessage(err, "Error found in getting current limit", false, null);
                    callback(null, false);
                }
                else {
                    //log.info("Decrement is starting,current value is : "+reply);
                    logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Decrement is starting  ',reqId);
                    if (parseInt(reply) > 0) {

                        try{
                            log.info("Current value > 0");
                            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  current value of %s > 0  ',reqId,req);
                            client.decr(req, function (err, result) {
                                if (err) {
                                    //log.error("Decrementing error occurs : "+err);
                                    //console.log('Error in decermententing');
                                    logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [REDIS] -  Errors occurred while decrementing count of %s  ',reqId,req,err);
                                    setTimeout(function () {
                                        logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is releasing  ',reqId);

                                        done(function () {
                                            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is released  ',reqId);

                                        });
                                    }, 1000);
                                    var jsonString = messageFormatter.FormatMessage(err, "ERROR found in decrementing", false, null);
                                    callback(null, false);
                                }
                                else {
                                    log.info('Decrementing succeeded');
                                    //console.log('Succesive in incermenting');
                                    logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Decrement succeeded of %s   ',reqId,req);
                                    setTimeout(function () {     // Simulate some task

                                        logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is releasing  ',reqId);

                                        done(function () {
                                            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is released  ',reqId);

                                        });
                                    }, 1000);
                                    var jsonString = messageFormatter.FormatMessage(err, "Decrement Success", true, null);
                                    callback(null, true);
                                }

                            });

                        }
                        catch(ex)
                        {
                            //log.fatal('Exception : '+ex);
                            //console.log('Exception in incermenting');
                            logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [REDIS] -  Exception occurred when decrement is starting of %s',reqId,req,ex);
                            var jsonString = messageFormatter.FormatMessage(ex, "Exception in decrementing", false, null);
                            callback(null, false);
                        }
                    }
                    else {
                        logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] - [REDIS] -  Decrement denied of %s current value is 0',reqId,req);
                        console.log("Decrement denied ..... Current value is 0");
                        setTimeout(function () {
                            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is releasing  ',reqId);


                            done(function () {
                                logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is released  ',reqId);

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
        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Exception occurred when starting method :LimitDecrement',reqId,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in entering to decrement function", false, null);
        callback(null, false);
    }
}

function AddNewLimitRecord(req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] -  UpdateEnability starting  - Data %s',reqId,JSON.stringify(req));
    try
    {
        var rand = "number" + uuid.v4().toString();
    }

    catch(ex)
    {
        //log.fatal("Exception in creating UUID : "+ex);
        logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] -  Exception in creating UUID   - Data %s',reqId,JSON.stringify(req),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in generating UUID ", false, null);
        callback(ex, undefined);
    }

    try{

        logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] -  Checking record for LimitId %s'   ,reqId,rand,ex);
        DbConn.LimitInfo.findAll({where: [{LimitId: rand}]}).complete(function (err, LimitObject) {

            if(err)
            {
               // log.error("Error in Searching Limitrecord for : "+req);
                logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [PGSQL] -  Error occurred while searching for LimitId %s',reqId,rand,ex);
                callback(err,undefined);
            }
            else
            {
                if(!LimitObject)
                {
                    logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] - [PGSQL] -  No record found for LimitId %s'   ,reqId,rand);
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
                        logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [PGSQL] -  Exception occurred while creating data record of LimitId %s'   ,reqId,rand,ex);
                        callback(ex,undefined);
                    }
                    NewLimobj.save().complete(function (err,result) {
                        if (err) {

                            //log.error("Error found in saving to DB : "+err);
                            //console.log("..................... Error found in saving.................................... : " + err);
                            logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [PGSQL] -  error occurred while saving data record of LimitId %s'   ,reqId,rand,err);
                            var jsonString = messageFormatter.FormatMessage(err, "ERROR found in saving to PG", false, null);
                            callback(null, jsonString);


                        }
                        else {
                            //log.info("New Limit info is recorded successfully : "+result);
                            var status = 1;
                            //console.log("..................... Saved Successfully ....................................");
                            //log.info("Setting redis key : "+rand);
                            logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] - [REDIS] -  Setting redis key of LimitId %s'   ,reqId,rand);
                            client.set(rand,0,function(err,reply)
                            {
                                //console.log(rand);
                                if(err)
                                {
                                    logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [REDIS] -  Error in setting redis key of LimitId %s'   ,reqId,rand,err);
                                    //var jsonString = messageFormatter.FormatMessage(err, "Error Found in Saving to redis : "+rand, false, null);
                                    callback(err, false);
                                }
                                else
                                {
                                    logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] - [REDIS] -  Setting redis key of LimitId %s is succeeded'   ,reqId,rand);
                                    //var jsonString = messageFormatter.FormatMessage(err, "Successfully saved to redis : "+rand, true, null);
                                    callback(null, true);
                                }

                            });
                        }


                    });
                }
                else
                {
                    logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [PGSQL] -  Records are already in db of LimitId %s'   ,reqId,rand);
                    var jsonString = messageFormatter.FormatMessage(err, "ERROR found", false, null);
                    callback(null, jsonString);
                }
            }


        });
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [PGSQL] -  Exceptions occurred while searching records of LimitId %s'   ,reqId,rand,ex);
        var jsonString = messageFormatter.FormatMessage(err, "Exception found", false, null);
        callback(null, jsonString);
    }

}

function GetCurrentLimit(req,reqId,callback)
{
   // log.info("\n.............................................Get current Limit Starts....................................................\n");
    try{

        //log.info("Inputs:- Key: "+req);
        client.get(req,function(err,result)
        {
            if(err)
            {
                logger.error('[DVP-LimitHandler.CurrentLimit] - [%s] - [REDIS]  - Error occurred while picking current limit of %s  ',reqId,req,err);
                var jsonString = messageFormatter.FormatMessage(err, "Error in searching key :   "+req, false, null);
                callback(err, undefined);
            }
            else
            {
                logger.debug('[DVP-LimitHandler.CurrentLimit] - [%s] - [REDIS]  - Current limit of %s successfully received %s ',reqId,req,result);
                var jsonString = messageFormatter.FormatMessage(err, "Successfully generates result : "+result, true, null);
                callback(undefined, result);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.CurrentLimit] - [%s] - Exception occurred when starting method :  CurrentLimit for Id %s ',reqId,req,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in Entering to search current limit of :   "+req, false, null);
        callback(ex, undefined);
    }
}

function GetMaxLimit(req,reqId,callback)
{
    log.info("\n.............................................Get Current Limit Starts....................................................\n");
    try{

        //log.info("Inputs:- ID : "+req);
        DbConn.LimitInfo.findAll({where: [{LimitId: req}],attributes:['MaxCount']}).complete(function (err, LimitObject) {

            if(err)
            {
                logger.error('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  - Error occurred while searching LinitInfo of %s ',reqId,req,err);
                var jsonString = messageFormatter.FormatMessage(err, "ERROR found", false, null);
                callback(err, undefined);
            }
            else
            {
                if(LimitObject)
                {
                    logger.debug('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  - MaxLimit is %s ',reqId,LimitObject);
                    var jsonString = messageFormatter.FormatMessage(err, "Record already in DB", true, LimitObject);
                    callback(undefined,JSON.stringify(LimitObject));
                }
                else
                {
                    logger.error('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  - No record found for %s ',reqId,req);
                    var jsonString = messageFormatter.FormatMessage(err, "No Record in DB", false, null);
                    callback('Error', undefined);
                }
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  -Exception occurred when starting : GetMaxLimit ',reqId,req,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in Entering to search current limit of :   "+req, false, null);
        callback(ex, undefined);
    }
}

function UpdateMaxLimit(LID,req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  UpdateMaxLimit starting  - Data %s',reqId,JSON.stringify(req));
    try {
        //log.info("Inputs : - Key : "+req);
        DbConn.LimitInfo
            .update(
            {
                MaxCount: req.MaxCount


            },
            {
                where: [{LimitId: LID,CompanyId:req.CompanyId}]
            }
        ).then(function (result) {
                //logger.info('Successfully Updated. ');
                //log.info("Max limit is updated : "+result);
                //console.log(".......................updation is succeeded ....................");
                logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  Maximum limit is successfully updated to %s of %s  - Data %s',reqId,req.MaxCount,LID);
                var jsonString = messageFormatter.FormatMessage(null, "Maxlimit successfully updated for : "+LID, true, result);
                callback(null, result);

            }).error(function (err) {
                //logger.info('updation error found in saving. : ' + err);
                //log.info("Error in updating max limit");
                //console.log("updationfailed ! " + err);
                //handle error here
                logger.error('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  Maximum limit of %s is unsuccessful when updating to %s   ',reqId,LID,req.MaxCount,err);
                var jsonString = messageFormatter.FormatMessage(err, "updation", false, null);
                callback(err, undefined);

            });

    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  Exception occurred when updating Maximum limit of %s to %s  ',reqId,LID,req.MaxCount,ex);
        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, obj);
        res.end(jsonString);
    }
}

function UpdateEnability(LID,req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.UpdateEnableState] - [%s] -  UpdateEnability starting   Data - Limit ID %s others %s',reqId,LID,JSON.stringify(req));
    try {

        DbConn.LimitInfo
            .update(
            {
                Enable: req.Enable


            },
            {
                where: [{LimitId: LID,CompanyId:req.CompanyId}]
            }
        ).then(function (result) {
                //logger.info('Successfully Updated. ');
                //log.info("Updation succeeded : "+result);
                //console.log(".......................Updation is succeeded ....................");
                logger.debug('[DVP-LimitHandler.UpdateEnableState] - [%s] - [PGSQL] -  Updating of  Enable status is succeeded of LimitId %d to %s ',reqId,LID,req.Enable);
                var jsonString = messageFormatter.FormatMessage(null, "Maxlimit successfully updated for : "+req.LimitId, true, result);
                callback(undefined, true);

            }).error(function (err) {
                //logger.info('updation error found in saving. : ' + err);
                //log.error("Updation error : "+err);
               // console.log("updationfailed ! " + err);
                logger.error('[DVP-LimitHandler.UpdateEnableState] - [%s] - [PGSQL] -  Updating of  Enable status is unsuccessful of LimitId %d to %s ',reqId,LID,req.Enable,err);
                //handle error here
                var jsonString = messageFormatter.FormatMessage(err, "updation", false, null);
                callback(err, false);

            });

    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.UpdateEnableState] - [%s] -  Exception occurred when method starts : UpdateEnableState - data LimitID %s others %s',reqId,LID,JSON.stringify(req),ex);
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
