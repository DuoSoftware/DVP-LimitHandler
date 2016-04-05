/**
 * Created by pawan on 3/12/2015.
 */

var redis=require('redis');
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var uuid = require('node-uuid');
var DbConn = require('dvp-dbmodels');
var config = require('config');
var port = config.Redis.port;
var ip = config.Redis.ip;
var password = config.Redis.password;

var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;


var client = redis.createClient(port,ip);

client.auth(password, function (error) {
    console.log("Redis Auth Error : "+error);
});
client.on("error", function (err) {
    console.log("Error " + err);
    client=null;

});

var lock = require("redis-lock")(client);




function LimitIncrement(req,reqId,callback)
{

    var reqMax=req+"_max";

    logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  LimitIncrement starting  - Data %s',reqId,req);
    try {

        lock(req, 1000, function (done) {

            logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [PGSQL] -  Lock started for %s ',reqId,req);


            try {

                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [PGSQL] -  Record found for LimitID %s  ',reqId,req);
                if(client)
                {
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


                            if(!reply)
                            {
                                logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis has no records for  LimitID %s  - Data %s',reqId,req);
                                callback(new Error("No records for  LimitID"+req),undefined);
                            }
                            else
                            {
                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis returned records for  LimitID %s  - Data %s',reqId,req,JSON.stringify(reply));

                                if(client)
                                {
                                    client.get(reqMax,function(errMax,resMax)
                                    {
                                        if(errMax)
                                        {
                                            logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error in searching Limit_max %s  ',reqId,reqMax,errMax);
                                            callback(errMax, undefined);
                                            done(function () {

                                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId);

                                            });

                                        }
                                        else
                                        {


                                            if(!resMax)
                                            {
                                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis has no records for  LimitID %s  - Max count %s',reqId,req);
                                                callback(new Error("No MaxLimit found for Limit "+req),undefined);
                                            }
                                            else
                                            {
                                                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis returned records for  LimitID %s  - Max count %s',reqId,req,reqMax);
                                                if (parseInt(resMax) > parseInt(reply)) {


                                                    logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s]  -  Redis record"s Max count %s >  Current count %s   ',reqId,resMax,reply);

                                                    console.log('true in checking');
                                                    console.log('max ' + resMax);
                                                    console.log('now current ' + reply);

                                                    try {

                                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s]  -  Going to increase current count of ',reqId,req);

                                                        if(client)
                                                        {
                                                            client.incr(req, function (errIncr, resIncr) {
                                                                if (errIncr) {

                                                                    logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error in incrementing count of LimitID %s ',reqId,req,errIncr);
                                                                    //setTimeout(function () { log.info('Lock is releasing');

                                                                    logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is releasing  ',reqId);
                                                                    callback(errIncr, undefined);
                                                                    done(function () {

                                                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId)

                                                                    });
                                                                    //}, 1000);

                                                                }
                                                                else {

                                                                    logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Count increment is succeeded of LimitId %s current count : %s  ',reqId,req,resIncr);
                                                                    // setTimeout(function () {
                                                                    callback(undefined, resIncr);
                                                                    done(function () {

                                                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId)

                                                                    });
                                                                    //  }, 1000);

                                                                }
                                                            });
                                                        }
                                                        else
                                                        {
                                                            callback(new Error("no Redis connection"),undefined);
                                                        }

                                                    }
                                                    catch (ex) {

                                                        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] -  Exception occurred while count increment starting   ',reqId,ex);
                                                        callback(ex, undefined);
                                                    }

                                                }
                                                else {

                                                    logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s]  -  Redis record"s Max count %s <  Current count %s  - Maximum limit reached ',reqId,resMax,reply);

                                                    //setTimeout(function () {     // Simulate some task
                                                    callback(new Error("Maxcount <=Redis value"), false);
                                                    done(function () {
                                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  Lock is released  ',reqId);

                                                    });
                                                    // }, 1000);


                                                }
                                            }

                                        }



                                    });
                                }
                                else
                                {
                                    callback(new Error("no Redis connection"),undefined);
                                }


                            }







                        }
                    })
                }
                else
                {
                    callback(new Error("No redis Connection"),undefined);
                }

            }

            catch (ex) {



                logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Exception occurred when getting current limit  ',reqId,ex);
                callback(ex, undefined);

                done(function () {

                    logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] -  Exception  ',reqId,ex);

                });
            }






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
            if(client)
            {
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
                        if(!reply)
                        {
                            logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [REDIS] -  No record for Key %s  ',reqId,req);
                            callback(new Error("No record for Key"+req),undefined);
                        }
                        else
                        {
                            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Decrement is starting  ',reqId);
                            if (parseInt(reply) > 0) {

                                try{

                                    logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  current value of %s > 0  ',reqId,req);

                                    if(client)
                                    {
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
                                    else
                                    {
                                        callback(new Error("no Redis Connection"),undefined);
                                    }


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


                    }

                });
            }
            else
            {
                callback(new Error("No redis Connection"),undefined);
            }

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

function CreateLimit(req,Company,Tenant,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.CreateLimit] - [%s] -  UpdateEnability starting ',reqId);
    try
    {
        var rand = "number" + uuid.v4().toString();
        var randMax=rand+"_max";
        var maxCnt=parseInt(req.MaxCount);
        console.log(req.MaxCount);
    }

    catch(ex)
    {

        logger.error('[DVP-LimitHandler.CreateLimit] - [%s] -  Exception in creating UUID ',reqId,ex);
        callback(ex, undefined);
    }

    if(req)
    {
        try{

            logger.debug('[DVP-LimitHandler.CreateLimit] - [%s] -  Checking record for LimitId %s'   ,reqId,rand);
            DbConn.LimitInfo.find({where: [{LimitId: rand},{CompanyId:Company},{TenantId:Tenant}]}).then(function(LimitObject)
            {

                if(!LimitObject)
                {
                    logger.debug('[DVP-LimitHandler.CreateLimit] - [%s] - [PGSQL] -  No record found for LimitId %s'   ,reqId,rand);
                    try {
                        var NewLimobj = DbConn.LimitInfo
                            .build(
                            {
                                LimitId: rand,
                                LimitDescription: req.LimitDescription,
                                ObjClass: "OBJCLZ",
                                ObjType: "OBJTYP",
                                ObjCategory: "OBJCAT",
                                CompanyId: Company,
                                TenantId: Tenant,
                                MaxCount: req.MaxCount,
                                Enable: req.Enable


                            }
                        )
                    }
                    catch(ex)
                    {
                        logger.error('[DVP-LimitHandler.CreateLimit] - [%s] - [PGSQL] -  Exception occurred while creating data record of LimitId %s'   ,reqId,rand,ex);
                        callback(ex,undefined);
                    }
                    NewLimobj.save().then(function(resSave)
                    {
                        logger.debug('[DVP-LimitHandler.CreateLimit] - [%s] - [REDIS] -  Setting redis key of LimitId %s'   ,reqId,rand);


                        try
                        {
                            client.mset(rand,0,randMax,maxCnt,function(errSet,resSet)
                            {
                                if(errSet)
                                {
                                    logger.error('[DVP-LimitHandler.CreateLimit] - [%s] - [REDIS] -  Error in setting redis keys of LimitId %s'   ,reqId,rand,errSet);

                                }
                                else
                                {
                                    logger.debug('[DVP-LimitHandler.CreateLimit] - [%s] - [REDIS] -  Setting redis keys of LimitId %s is succeeded'   ,reqId,rand);
                                }
                            });



                        }
                        catch(ex)
                        {
                            callback(ex,undefined);
                        }

                        callback(undefined,resSave);

                    }).catch(function(errSave)
                    {
                        logger.error('[DVP-LimitHandler.CreateLimit] - [%s] - [PGSQL] -  error occurred while saving data record of LimitId %s'   ,reqId,rand,errSave);

                        callback(errSave, undefined);

                    });


                }
                else
                {
                    logger.error('[DVP-LimitHandler.CreateLimit] - [%s] - [PGSQL] -  Records are already in db of LimitId %s'   ,reqId,rand);
                    callback(new Error("Already in DB"), undefined);
                }
            }).catch(function(err)
            {
                logger.error('[DVP-LimitHandler.CreateLimit] - [%s] - [PGSQL] -  Error occurred while searching for LimitId %s',reqId,rand,err);
                callback(err,undefined);
            });


        }
        catch(ex)
        {
            logger.error('[DVP-LimitHandler.CreateLimit] - [%s] - [PGSQL] -  Exceptions occurred while searching records of LimitId %s'   ,reqId,rand,ex);
            callback(ex, undefined);
        }
    }
    else
    {
        logger.error('[DVP-LimitHandler.CreateLimit] - [%s] - Empty Request',reqId);
        callback(new Error("Empty Request"),undefined);
    }




}

function GetCurrentLimit(key,reqId,callback)
{
    try{
        if(client)
        {
            client.get(key,function(err,result)
            {
                if(err)
                {
                    logger.error('[DVP-LimitHandler.CurrentLimit] - [%s] - [REDIS]  - Error occurred while picking current limit of %s  ',reqId,key,err);
                    callback(err, undefined);
                }
                else
                {
                    if(!result)
                    {
                        logger.error('[DVP-LimitHandler.CurrentLimit] - [%s] - [REDIS]  - No Limit info found for %s ',reqId,key);
                        callback(new Error("No Limit info found for "+key),undefined);
                    }
                    else
                    {
                        logger.debug('[DVP-LimitHandler.CurrentLimit] - [%s] - [REDIS]  - Current limit of %s successfully received %s ',reqId,key,result);
                        callback(undefined, result);
                    }

                }

            });
        }
        else
        {
            callback(new Error("No redis connection"),undefined);
        }


    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.CurrentLimit] - [%s] - Exception occurred when starting method :  CurrentLimit for Id %s ',reqId,key,ex);
        callback(ex, undefined);
    }
}

function GetMaxLimit(key,reqId,callback)
{
    if(key)
    {
        var reqMax=key+"_max";
        try{

            lock(key, 1000, function (done) {

                if(client)
                {
                    client.get(reqMax, function (errMax, resMax) {

                        if (errMax) {
                            logger.error('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  - Error in getting value of key %s ',reqId,key,errMax);
                            callback(errMax, undefined);

                            done(function () {

                                logger.debug('[DVP-LimitHandler.MaxLimit] - [%s] -  Lock is released  ',reqId);

                            });
                        }
                        else {

                            if(!resMax)
                            {
                                logger.error('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  - No limit info found for key %s ',reqId,key);

                                callback(new Error("No limit info found for "+key),undefined);

                                done(function () {

                                    logger.debug('[DVP-LimitHandler.MaxLimit] - [%s] -  Lock is released  ',reqId);

                                });
                            }
                            else
                            {
                                logger.debug('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  - Limit Info received for key %s ',reqId,key);

                                callback(undefined, resMax);

                                done(function () {

                                    logger.debug('[DVP-LimitHandler.MaxLimit] - [%s] -  Lock is released  ',reqId);

                                });
                            }



                        }


                    });
                }
                else
                {
                    callback(new Error("no Redis connection"),undefined);
                }



            });

        }
        catch(ex)
        {
            logger.error('[DVP-LimitHandler.MaxLimit] - [%s] - [PGSQL]  -Exception occurred when starting : GetMaxLimit ',reqId,key,ex);
            callback(ex, undefined);
        }
    }
    else
    {
        logger.error('[DVP-LimitHandler.MaxLimit] - [%s] - Limit Key is Undefined');
        callback(new Error("Limit Key is Undefined"), undefined);
    }

}

function UpdateMaxLimit(LID,max,Company,Tenant,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  UpdateMaxLimit starting  - Data :-  ID : %s Max : $s',reqId,LID,max);

    if(max && LID)
    {
        var maxLim = parseInt(max);
        try {

            DbConn.LimitInfo
                .update(
                {
                    MaxCount: maxLim


                },
                {
                    where: [{LimitId: LID},{CompanyId:Company},{TenantId:Tenant}]
                }
            ).then(function (resLimit) {

                    if(resLimit==0)
                    {
                        logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  Maximum limit is successfully updated to %s of %s  - Data %s',reqId,max,LID);

                        callback(new Error("No Limit to Update"), undefined);
                    }
                    else
                    {
                        logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  Maximum limit is successfully updated to %s of %s  - Data %s',reqId,max,LID);

                        if(client)
                        {
                            client.set(LID,maxLim,function(errSet,resSet)
                            {
                                if(errSet)
                                {
                                    callback(errSet,undefined);
                                }
                                else
                                {
                                    callback(undefined,resSet);
                                }
                            });
                        }
                        else
                        {
                            callback(new Error("No redis connection"),undefined) ;
                        }

                    }


                }).catch(function (errLimit) {

                    logger.error('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  Maximum limit of %s is unsuccessful when updating to %s   ',reqId,LID,max,errLimit);
                    callback(errLimit, undefined);

                });

        }
        catch (ex)
        {
            logger.error('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  Exception occurred when updating Maximum limit of %s to %s  ',reqId,LID,max,ex);

            callback(ex,undefined);
        }
    }
    else
    {
        callback(new Error("Empty request Body or Undefined LimitID"),undefined);
    }


}

function ActivateLimit(LID,status,Company,Tenant,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.ActivateLimit] - [%s] -  ActivateLimit starting   Data - Limit ID %s others %s',reqId,LID,status);

    if(LID)
    {
        try {

            DbConn.LimitInfo
                .update(
                {
                    Enable: status


                },
                {
                    where: [{LimitId: LID},{CompanyId:Company},{TenantId:Tenant}]
                }
            ).then(function (resLimit) {

                    if(resLimit==0)
                    {
                        logger.error('[DVP-LimitHandler.ActivateLimit] - [%s] - [PGSQL] -  No Limit record found to update ');

                        callback(new Error("No Limit record found to update"), undefined);
                    }
                    else
                    {
                        logger.debug('[DVP-LimitHandler.ActivateLimit] - [%s] - [PGSQL] -  Updating of  Enable status is succeeded of LimitId %d to %s ',reqId,LID,status);

                        callback(undefined, resLimit);
                    }


                }).error(function (errLimit) {

                    logger.error('[DVP-LimitHandler.ActivateLimit] - [%s] - [PGSQL] -  Updating of  Enable status is unsuccessful of LimitId %d to %s ',reqId,LID,status,errLimit);

                    callback(errLimit, undefined);

                });

        }
        catch (ex)
        {
            logger.error('[DVP-LimitHandler.ActivateLimit] - [%s] -  Exception occurred when method starts : ActivateLimit - data LimitID %s others %s',reqId,LID,status,ex);
            callback(ex,undefined);
        }
    }
    else
    {
        logger.error('[DVP-LimitHandler.ActivateLimit] - [%s] -  LimitID is Undefined');
        callback(new Error("LimitID is Undefined"),undefined);
    }

}

function GetLimitInfo(reqId,Company,Tenant,callback)
{

    try{


        DbConn.LimitInfo.findAll({where: [{CompanyId:Company},{TenantId:Tenant}]}).then(function(resLimit)
        {
            if(resLimit.length>0)
            {
                logger.debug('[DVP-LimitHandler.LimitInfo] - [%s] - [PGSQL]  - LimitInfo - %s  ',reqId,JSON.stringify(resLimit));
                callback(undefined,resLimit);
            }
            else
            {
                logger.error('[DVP-LimitHandler.LimitInfo] - [%s] - [PGSQL]  - No record found');
                callback(new Error('No limit Record'), undefined);
            }
        }).catch(function(errLimit)
        {
            logger.error('[DVP-LimitHandler.LimitInfo] - [%s] - [PGSQL]  - Error occurred while searching LimitInfo of %s ',reqId,errLimit);
            callback(errLimit, undefined);
        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.LimitInfo] - [%s] - [PGSQL]  -Exception occurred when starting : GetLimitInfo ',reqId,ex);
        callback(ex, undefined);
    }

}

function ReloadRedis(Company,Tenant,reqId,callback)
{


    DbConn.LimitInfo.findAll({where:[{Enable:true},{CompanyId:Company},{TenantId:Tenant}]}).then(function(resLim)
    {

        if(resLim.length>0)
        {
            RedisSetter(resLim,reqId,function(errSet,resSet)
            {
                callback(errSet,resSet);
            })
        }
        else
        {
            callback(new Error("No active Limits found"),undefined);
        }

    }).catch(function(errLim)
    {
        callback(errLim,undefined);
    });
}

function RedisSetter(resLim,reqId,callback)
{
    var ErrArray=[];
    var cnt=resLim.length;
    var i=0;
    for (var index in resLim)
    {

        var MaxLimName=resLim[index].LimitId+"_max";
        var Lim=resLim[index].LimitId;
        var MaxLim=resLim[index].MaxCount;

        if(client)
        {
            client.mset(Lim,0,MaxLimName,MaxLim,function(errMset,resMset)
            {
                i++;

                if(errMset)
                {
                    ErrArray.push(Lim);
                }
                if(i==(cnt-1))
                {
                    callback(undefined,ErrArray);
                }

            });
        }
        else
        {
            callback(new Error("No redis connection"),undefined);
        }




    }
}

function RoleBackData(LimID,reqId,callback)
{
    DbConn.LimitInfo.destroy({where:[{LimitId:LimID}]}).then(function (resDel) {

        callback(undefined,resDel);
    }).catch(function (errDel) {
        callback(errDel,undefined);
    });


}



function IncrementMultipleKeys(LimIDs,Condition,reqId,callback)
{
    var releaseArray=[];
    var IncLimits =[];
    var incStatus=false;

    console.log(LimIDs);
    console.log(LimIDs.length);
    console.log(LimIDs[0]);
    console.log('\n');

    for(var i=0;i<LimIDs.length;i++)
    {
        var LimCode=LimIDs[i];
        console.log(LimIDs[i]);
        var reqMax=LimIDs[i]+"_max";
        console.log(reqMax);
        lock(LimIDs[i], 1000, function (done) {

            logger.debug('[DVP-LimitHandler.MultipleLimitIncrement] - [%s] - [PGSQL] -  Lock started for %s ',reqId,LimCode);
            releaseArray.push(done);
            console.log("In "+LimCode);
            if(client)
            {
                console.log("Client In ");
                console.log("Lim "+LimCode);
                console.log("Max "+reqMax);
                client.get(LimCode, function (err,reply) {

                    if(err)
                    {
                        logger.error('[DVP-LimitHandler.MultipleLimitIncrement] - [%s] - [REDIS] -  Error in searching LimitID %s  ',reqId,LimIDs[i],err);
                        callback(err,undefined);
                    }
                    else
                    {
                        console.log(reply);
                        if(!reply)
                        {
                            logger.error('[DVP-LimitHandler.MultipleLimitIncrement] - [%s] - [REDIS] -  Redis has no records for  LimitID %s  - Data %s',reqId,LimIDs[i]);
                            //callback(new Error("No records for  LimitID"+req),undefined);
                            callback(new Error("Empty"),undefined);
                        }
                        else
                        {
                            console.log("Got result");
                            if(reply[0] && reply[1])
                            {
                                if(Condition=="AND")
                                {
                                    if(reply[0]<reply[1])
                                    {
                                        if(i==(LimIDs.length-1))
                                        {

                                            for(var j=0;j<releaseArray.length;j++)
                                            {
                                                releaseArray[j](function()
                                                {

                                                });
                                                if(j==(releaseArray.length-1))
                                                {
                                                    callback(undefined,true);
                                                }
                                            }

                                        }
                                        else
                                        {
                                            //continue;
                                        }
                                    }
                                    else
                                    {
                                        callback(new Error("Invalid"),undefined);
                                    }
                                }
                                else
                                {
                                    if(reply[0]<reply[1])
                                    {
                                        for(var i=0;i<LimIDs.length;i++)
                                        {
                                            var incLims=LimIDs[i];
                                            client.incr(incLims, function (errInc,resInc) {

                                            });

                                            if(i==(LimIDs.length-1))
                                            {
                                                for(var j=0;j<releaseArray.length;j++)
                                                {
                                                    releaseArray[j](function()
                                                    {

                                                    });

                                                    if(j==(releaseArray.length-1))
                                                    {
                                                        callback(undefined,true);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        // continue;
                                    }


                                }

                            }
                            else
                            {
                                console.log("Null result");
                            }


                        }
                    }

                })
            }

        });

    }



}

function MultiKeyIncrementer (limIDs,condition,reqId,callback)
{
   /* var lockData=[];

    var keyData = limIDs;
    console.log(keyData);
    var keyCount=keyData.length;

    for(var i=0;i<keyCount;i++)
    {
        lockData.push(KeyLocker(keyData[i]));
        KeyValueChecker(keyData[i], function (e,r) {

            if(e)
            {
                console.log("Error "+e);
                //callback(e,undefined);
            }
            else
            {
                console.log("res "+r);
                if(r[0]<r[1])
                {
                    if(condition=="OR")
                    {
                        break;
                    }
                }
                else
                {

                }
                // callback(undefined,r);

            }

            if(i==(keyCount-1))
            {
                callback(e,r);
                lockData[0](function () {
                    console.log("released");
                })
            }
        });



    }*/

}

function KeyLocker(key)
{
    lock(key, 1000, function (done) {

        return done;


    });
}

function KeyValueChecker (key,callback)
{
    client.mget(key,key+"_max", function (err,res) {

        callback(err,res);
    });
}



module.exports.LimitIncrement = LimitIncrement;
module.exports.LimitDecrement = LimitDecrement;
module.exports.CreateLimit = CreateLimit;
module.exports.GetCurrentLimit = GetCurrentLimit;
module.exports.GetMaxLimit = GetMaxLimit;
module.exports.UpdateMaxLimit = UpdateMaxLimit;
module.exports.ActivateLimit = ActivateLimit;
module.exports.GetLimitInfo = GetLimitInfo;
module.exports.ReloadRedis = ReloadRedis;
module.exports.RoleBackData = RoleBackData;
module.exports.IncrementMultipleKeys = IncrementMultipleKeys;
module.exports.MultiKeyIncrementer = MultiKeyIncrementer;

