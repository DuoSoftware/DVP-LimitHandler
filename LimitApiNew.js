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




function LimitIncrement(req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  LimitIncrement starting  - Data %s',reqId,req);
    try {

        lock(req, 1000, function (done) {

            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [PGSQL] -  Lock started for %s ',reqId,req);

            DbConn.LimitInfo
                .find({
                    where: {LimitId: req}, attributes: ['MaxCount']
                }
            )
                .complete(function (err, result) {
                    if (err) {

                        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [PGSQL] -  Error occurred while searching LimitId %s  ',reqId,req,err);

                        //setTimeout(function () {

                        callback(err,undefined);
                        done(function () {

                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId);

                        });
                        // }, 1000);
                        //


                    } else {
                        if (!result) {

                            logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [PGSQL] -  No record for LimitID %s  ',reqId,req,err);


                            // setTimeout(function () {
                            // logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is releasing  ',reqId);
                            callback(new Error('No record'), undefined);
                            done(function () {
                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId);

                            });
                            // }, 1000);



                        }

                        else {



                            try {

                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [PGSQL] -  Record found for LimitID %s  ',reqId,req,err);
                                client.get(req, function (err, reply) {
                                    if (err) {

                                        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error in searching LimitID %s  ',reqId,req,err);

                                        //setTimeout(function () {

                                        callback(err, undefined);
                                        done(function () {

                                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId);

                                        });
                                        // }, 1000);


                                    }
                                    else {

                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis returned records for  LimitID %s  - Data %s',reqId,req,JSON.stringify(reply));

                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis returned records for  LimitID %s  - Max count %s',reqId,req,result.MaxCount);

                                        if (result.MaxCount > parseInt(reply)) {


                                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s]  -  Redis record"s Max count %s >  Current count %s   ',reqId,result.MaxCount,reply);

                                            console.log('true in checking');
                                            console.log('max ' + result.MaxCount);
                                            console.log('now current ' + reply);

                                            try {

                                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s]  -  Going to increase current count of ',reqId,req);
                                                client.incr(req, function (err, res) {
                                                    if (err) {

                                                        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error in incrementing count of LimitID %s ',reqId,req,err);
                                                        //setTimeout(function () { log.info('Lock is releasing');

                                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is releasing  ',reqId);
                                                        callback(err, undefined);
                                                        done(function () {

                                                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId)

                                                        });
                                                        //}, 1000);

                                                    }
                                                    else {

                                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Count increment is succeeded of LimitId %s current count : %s  ',reqId,req,res);
                                                        // setTimeout(function () {
                                                        callback(undefined, res);
                                                        done(function () {

                                                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId)

                                                        });
                                                        //  }, 1000);

                                                    }
                                                });
                                            }
                                            catch (ex) {

                                                logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] -  Exception occurred while count increment starting   ',reqId,ex);
                                                callback(ex, undefined);
                                            }

                                        }
                                        else {

                                            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s]  -  Redis record"s Max count %s <  Current count %s  - Maximum limit reached ',reqId,result.MaxCount,reply);

                                            //setTimeout(function () {     // Simulate some task
                                            callback(new Error("Maxcount <=Redis value"), false);
                                            done(function () {
                                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId);

                                            });
                                            // }, 1000);


                                        }
                                    }
                                })
                            }

                            catch (ex) {

                                logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Exception occurred when getting current limit  ',reqId,ex);
                                callback(ex, undefined);
                            }
                        }

                    }

                });

        });
    }
    catch(ex)
    {

        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Exception occurred when starting method :LimitIncrement',reqId,ex);
        callback(ex,undefined);
    }
}

function LimitDecrement(req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  LimitDecrement starting  -',reqId);
    try {

        lock(req, 1000, function (done) {
            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] - [PGSQL] -  Lock started ',reqId,req);
            client.get(req, function (err, reply) {
                if (err) {


                    logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error in searching Limit  ',reqId,req,err);

                    //setTimeout(function () {


                    callback(err, undefined);
                    done(function () {
                        logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is released  ',reqId);

                    });
                    //}, 1000);


                }
                else {

                    logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Decrement is starting  ',reqId);
                    if (parseInt(reply) > 0) {

                        try{
                            log.info("Current value > 0");
                            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  current value of %s > 0  ',reqId,req);
                            client.decr(req, function (err, result) {
                                if (err) {

                                    logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [REDIS] -  Errors occurred while decrementing count of   ',reqId,req,err);
                                    //setTimeout(function () {

                                    callback(err, undefined);
                                    done(function () {
                                        logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is released  ',reqId);

                                    });
                                    // }, 1000);


                                }
                                else {
                                    log.info('Decrementing succeeded');

                                    logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Decrement succeeded of   ',reqId,req);
                                    //setTimeout(function () {     // Simulate some task


                                    callback(undefined, result);
                                    done(function () {
                                        logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is released  ',reqId);

                                    });
                                    // }, 1000);


                                }

                            });

                        }
                        catch(ex)
                        {

                            logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [REDIS] -  Exception occurred when decrement is starting of %s',reqId,req,ex);


                            callback(ex, undefined);
                            done(function () {
                                logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is released  ',reqId);

                            });


                        }
                    }
                    else {
                        logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] - [REDIS] -  Decrement denied of  current value is 0',reqId,req);

                        //setTimeout(function () {


                        callback(new Error("Limit = 0 "), undefined);

                        done(function () {
                            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is released  ',reqId);

                        });
                        // }, 1000);

                    }
                }

            });
        });
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Exception occurred when starting method :LimitDecrement',reqId,ex);

        callback(ex, undefined);
        done(function () {
            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Lock is released  ',reqId);

        });

    }
}

function AddNewLimitRecord(req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] -  UpdateEnability starting ',reqId);
    try
    {
        var rand = "number" + uuid.v4().toString();
    }

    catch(ex)
    {

        logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] -  Exception in creating UUID ',reqId,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in generating UUID ", false, null);
        callback(ex, undefined);
    }

    try{

        logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] -  Checking record for LimitId %s'   ,reqId,rand);
        DbConn.LimitInfo.findAll({where: [{LimitId: rand}]}).complete(function (err, LimitObject) {

            if(err)
            {

                logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [PGSQL] -  Error occurred while searching for LimitId %s',reqId,rand,err);
                callback(err,undefined);
            }
            else
            {
                if(LimitObject.length==0)
                {
                    logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] - [PGSQL] -  No record found for LimitId %s'   ,reqId,rand);
                    try {
                        var NewLimobj = DbConn.LimitInfo
                            .build(
                            {
                                LimitId: rand,
                                LimitDescription: req.LimitDescription,
                                ObjClass: "OBJCLZ",
                                ObjType: "OBJTYP",
                                ObjCategory: "OBJCAT",
                                CompanyId: 1,
                                TenantId: 1,
                                MaxCount: req.MaxCount,
                                Enable: req.Enable


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


                            logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [PGSQL] -  error occurred while saving data record of LimitId %s'   ,reqId,rand,err);

                            callback(err, undefined);


                        }
                        else {


                            logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] - [REDIS] -  Setting redis key of LimitId %s'   ,reqId,rand);
                            client.set(rand,0,function(err,reply)
                            {

                                if(err)
                                {
                                    logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [REDIS] -  Error in setting redis key of LimitId %s'   ,reqId,rand,err);

                                    callback(err, undefined);
                                }
                                else
                                {
                                    logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] - [REDIS] -  Setting redis key of LimitId %s is succeeded'   ,reqId,rand);
                                    callback(undefined, rand);
                                }

                            });
                        }


                    });
                }
                else
                {
                    logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [PGSQL] -  Records are already in db of LimitId %s'   ,reqId,rand);
                    callback(new Error("Already in DB"), undefined);
                }
            }


        });
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [PGSQL] -  Exceptions occurred while searching records of LimitId %s'   ,reqId,rand,ex);
        callback(ex, undefined);
    }

}

function GetCurrentLimit(key,reqId,callback)
{
    try{

        client.get(key,function(err,result)
        {
            if(err)
            {
                logger.error('[DVP-LimitHandler.CurrentLimit] - [%s] - [REDIS]  - Error occurred while picking current limit of %s  ',reqId,key,err);
                callback(err, undefined);
            }
            else
            {
                logger.debug('[DVP-LimitHandler.CurrentLimit] - [%s] - [REDIS]  - Current limit of %s successfully received %s ',reqId,key,result);
                callback(undefined, result);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.CurrentLimit] - [%s] - Exception occurred when starting method :  CurrentLimit for Id %s ',reqId,key,ex);
        callback(ex, undefined);
    }
}

function GetMaxLimit(key,reqId,callback)
{

    try{


        DbConn.LimitInfo.findAll({where: [{LimitId: key}],attributes:['MaxCount']}).complete(function (err, LimitObject) {

            if(err)
            {
                logger.error('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  - Error occurred while searching LinitInfo of %s ',reqId,key,err);
                callback(err, undefined);
            }
            else
            {
                if(LimitObject.length>0)
                {
                    logger.debug('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  - MaxLimit is  ',reqId,LimitObject.MaxCount);
                    callback(undefined,LimitObject);
                }
                else
                {
                    logger.error('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  - No record found for %s ',reqId,key);
                    callback(new Error('No limit Record'), undefined);
                }
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  -Exception occurred when starting : GetMaxLimit ',reqId,key,ex);
        callback(ex, undefined);
    }
}

function UpdateMaxLimit(LID,req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  UpdateMaxLimit starting  - Data %s',reqId,JSON.stringify(req));
    try {

        DbConn.LimitInfo
            .update(
            {
                MaxCount: req.MaxCount


            },
            {
                where: [{LimitId: LID}]
            }
        ).then(function (result) {

                logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  Maximum limit is successfully updated to %s of %s  - Data %s',reqId,req.MaxCount,LID);

                callback(undefined, result);

            }).error(function (err) {

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
                where: [{LimitId: LID}]
            }
        ).then(function (result) {

                logger.debug('[DVP-LimitHandler.UpdateEnableState] - [%s] - [PGSQL] -  Updating of  Enable status is succeeded of LimitId %d to %s ',reqId,LID,req.Enable);

                callback(undefined, result);

            }).error(function (err) {

                logger.error('[DVP-LimitHandler.UpdateEnableState] - [%s] - [PGSQL] -  Updating of  Enable status is unsuccessful of LimitId %d to %s ',reqId,LID,req.Enable,err);

                callback(err, undefined);

            });

    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.UpdateEnableState] - [%s] -  Exception occurred when method starts : UpdateEnableState - data LimitID %s others %s',reqId,LID,JSON.stringify(req),ex);
        callback(ex,undefined);
    }
}

module.exports.LimitIncrement = LimitIncrement;
module.exports.LimitDecrement = LimitDecrement;
module.exports.AddNewLimitRecord = AddNewLimitRecord;
module.exports.GetCurrentLimit = GetCurrentLimit;
module.exports.GetMaxLimit = GetMaxLimit;
module.exports.UpdateMaxLimit = UpdateMaxLimit;
module.exports.UpdateEnability = UpdateEnability;

