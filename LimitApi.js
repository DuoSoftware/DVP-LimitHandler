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
var async= require('async');
var underscore =  require('underscore');
var httpReq = require('request');
var util=require('util');

var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var redisCacheHandler = require('dvp-common/CSConfigRedisCaching/RedisHandler.js');


var notificationServiceURL=config.ExternalUrls.NotificationService.domain;
var notificationServiceVersion=config.ExternalUrls.NotificationService.version;

var userServiceURL=config.ExternalUrls.UserService.domain;
var userServiceVersion=config.ExternalUrls.UserService.version;


var token=config.Token;


var client = redis.createClient(port,ip);

client.auth(password, function (error) {
    console.log("Redis Auth Error : "+error);
});
client.on("error", function (err) {
    console.log("Error " + err);


});

var lock = require("redis-lock")(client);




/*function LimitIncrement(req,reqId,callback)
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
 }*/

function LimitDecrement(req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  LimitDecrement starting  ',reqId);

    //logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] - [PGSQL] -  Lock started ',reqId,req);

    try {
        client.get(req, function (err, reply) {
            if (err) {


                logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error in searching Limit  ', reqId, req, err);
                callback(err, undefined);


            }
            else {
                if (!reply) {
                    logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [REDIS] -  No record for Key %s  ', reqId, req);
                    callback(new Error("No record for Key" + req), undefined);
                }
                else {
                    //logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Decrement is starting  ', reqId);
                    if (parseInt(reply) > 0) {

                        try {

                            logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  current value of %s > 0  ', reqId, req);


                            try {
                                client.decr(req, function (err, result) {
                                    if (err) {

                                        logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [REDIS] -  Errors occurred while decrementing count of   ', reqId, req, err);
                                        callback(err, undefined);



                                    }
                                    else {


                                        logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] -  Decrement succeeded of   ', reqId, req);
                                        callback(undefined, result);




                                    }

                                });
                            } catch (e)
                            {
                                callback(e,undefined);
                            }




                        }
                        catch (ex) {

                            logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [REDIS] -  Exception occurred when decrement is starting of %s', reqId, req, ex);
                            callback(ex, undefined);



                        }
                    }
                    else {
                        //logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] - [REDIS] -  Decrement denied of  current value is 0', reqId, req);
                        callback(new Error("Limit = 0 "), undefined);


                    }
                }


            }

        });
    } catch (e)
    {
        callback(e,undefined);
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
                        redisCacheHandler.addLimitToCache(resSave.LimitId, resSave.CompanyId, resSave.TenantId, resSave);
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

            DbConn.LimitInfo.find({where: [{LimitId: LID},{CompanyId:Company},{TenantId:Tenant}]}).then(function (lim)
            {
                if(lim)
                {
                    lim.updateAttributes({MaxCount: maxLim}).then(function (resLimit)
                    {
                        redisCacheHandler.addLimitToCache(resLimit.LimitId, Company, Tenant, resLimit);
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

                    }).catch(function(err)
                    {
                        logger.error('[DVP-LimitHandler.UpdateMaxLimit] PGSQL Update extension with recording status failed', err);
                        callback(err, false);
                    });

                }
                else
                {
                    callback(new Error('Limit record not found'), false);
                }

            }).catch(function(err)
            {
                logger.error('[DVP-LimitHandler.UpdateMaxLimit] - [%s] - Get Extension PGSQL query failed', reqId, err);
                callback(err, false);
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

function UpdateMaxLimitWithSwitch(LID,max,Company,Tenant,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] -  UpdateMaxLimit starting  - Data :-  ID : %s Max : $s',reqId,LID,max);

    if(max && LID)
    {
        var maxLim = parseInt(max);
        try {

            DbConn.LimitInfo.find({where: [{LimitId: LID},{TenantId:Tenant}]}).then(function (lim)
            {
                if(lim)
                {
                    lim.updateAttributes({MaxCount: maxLim, CompanyId: Company}).then(function (resLimit)
                    {
                        redisCacheHandler.addLimitToCache(resLimit.LimitId, Company, Tenant, resLimit);
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

                    }).catch(function(err)
                    {
                        logger.error('[DVP-LimitHandler.UpdateMaxLimit] PGSQL Update extension with recording status failed', err);
                        callback(err, false);
                    });

                }
                else
                {
                    callback(new Error('Limit record not found'), false);
                }

            }).catch(function(err)
            {
                logger.error('[DVP-LimitHandler.UpdateMaxLimit] - [%s] - Get Extension PGSQL query failed', reqId, err);
                callback(err, false);
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

            DbConn.LimitInfo.find({where: [{LimitId: LID},{CompanyId:Company},{TenantId:Tenant}]}).then(function (lim)
            {
                if(lim)
                {
                    lim.updateAttributes({Enable: status}).then(function (resLimit) {

                        redisCacheHandler.addLimitToCache(resLimit.LimitId, Company, Tenant, resLimit);

                        if(!resLimit)
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
                else
                {
                    callback(new Error('Limit record not found'), false);
                }

            }).catch(function(err)
            {
                logger.error('[DVP-LimitHandler.UpdateMaxLimit] - [%s] - Get Extension PGSQL query failed', reqId, err);
                callback(err, false);
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

            logger.debug('[DVP-LimitHandler.LimitInfo] - [%s] - [PGSQL]  - LimitInfo - %s  ',reqId,JSON.stringify(resLimit));
            callback(undefined,resLimit);


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


function LimitIncrement(req,companyData,reqId,callback)
{

    var reqMax=req+"_max";
    var compInfo = companyData.tenant + ':' + companyData.company;

    //logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] -  LimitIncrement starting  - Data %s',reqId,req);
    try {


        try {

            //logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [PGSQL] -  Record found for LimitID %s  ',reqId,req);

            try {
                client.get(req, function (err, reply) {
                    if (err) {

                        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error in searching LimitID %s  ', reqId, req, err);
                        callback(err, undefined);

                    }
                    else {


                        if (!reply) {
                            logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis has no records for  LimitID %s  - Data %s', reqId, req);
                            callback(new Error("No records for  LimitID" + req), undefined);
                        }
                        else {
                            //logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis returned records for  LimitID %s  - Data %s', reqId, req, JSON.stringify(reply));


                            try {
                                client.incr(req, function (errIncr, resIncr) {

                                    if (errIncr) {
                                        //logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error increment Limit %s  ', reqId, req, errIncr);
                                        callback(errIncr, undefined);
                                    }
                                    else {
                                        client.get(reqMax, function (errMax, resMax) {
                                            if (errMax) {
                                                logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Error in searching Limit_max %s  ', reqId, reqMax, errMax);
                                                callback(errMax, undefined);

                                            }
                                            else {

                                                if (!resMax) {
                                                    //logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis has no records for  LimitID %s  - Max count %s', reqId, req);
                                                    callback(new Error("No MaxLimit found for Limit " + req), undefined);
                                                }
                                                else {
                                                    //logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis returned records for  LimitID %s  - Max count %s', reqId, req, reqMax);

                                                    if(parseInt(resIncr)==parseInt(resMax) )
                                                    {
                                                        sendNotification(compInfo, function (errNotify,resNotify) {
                                                            callback(errNotify,resIncr);
                                                        });
                                                    }


                                                    if (parseInt(resMax) >= parseInt(resIncr)) {

                                                        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s]  -  Redis record"s Max count %s >  Current count %s   ', reqId, resMax, reply);
                                                        console.log('true in checking');
                                                        console.log('max ' + resMax);
                                                        console.log('now current ' + resIncr);
                                                        callback(undefined, resIncr);

                                                    }
                                                    else
                                                    {

                                                        //logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s]  -  Redis record"s Max count %s <  Current count %s  - Maximum limit reached ', reqId, resMax, reply);


                                                        try {
                                                            client.decr(req, function (errDecr, resDecr) {
                                                                sendNotification(compInfo, function (errNotify,resNotify) {

                                                                    if (errDecr) {
                                                                        callback(errDecr, undefined);
                                                                    }
                                                                    else {
                                                                        //logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Redis returned records for  LimitID %s  - Current Limit %s', reqId, req, resDecr);

                                                                        callback(undefined, resDecr);
                                                                    }
                                                                });

                                                            });
                                                        } catch (e) {
                                                            callback(e, undefined);
                                                        }

                                                        // }, 1000);


                                                    }
                                                }

                                            }


                                        });
                                    }

                                });
                            } catch (e) {
                                callback(e,undefined);
                            }


                        }


                    }
                })
            } catch (e)
            {
                callback(e,undefined);
            }



        }

        catch (ex) {

            logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Exception occurred when getting current limit  ',reqId,ex);
            callback(ex, undefined);

        }







    }
    catch(ex)
    {

        logger.error('[DVP-LimitHandler.LimitIncrement] - [%s] - [REDIS] -  Exception occurred when starting method :LimitIncrement',reqId,ex);
        callback(ex,undefined);
    }
}

function MultiKeyIncrementer(keyString,condition,reqId,callbackData)
{
    console.log(keyString);
    var keyIds = keyString;
    var checkArray=[];

    keyIds.forEach(function (key) {
        if (key) {
            checkArray.push(function createContact(callback) {

                var max_key=key+"_max";

                client.get(max_key,function (errKey,resKey) {
                    if(errKey || !resKey)
                    {
                        console.log("max getting error of "+max_key);
                        var obj = {
                            key:key,
                            rvtSt:false,
                            Availability:false
                        };
                        callback(new Error("Error in Getting Max limit of key : "+key),obj);
                    }
                    else
                    {
                        client.incr(key, function (errIncr,resIncr) {
                            if(errIncr ||!resIncr)
                            {
                                console.log("Incrementing error of "+key);
                                var obj = {
                                    key:key,
                                    rvtSt:false,
                                    Availability:false
                                };
                                callback(new Error("Error in value incrementing of key : "+key),obj);
                            }
                            else
                            {
                                if(resKey>=resIncr)
                                {
                                    console.log("Increment suites "+key);
                                    var obj = {
                                        key:key,
                                        rvtSt:false,
                                        Availability:true
                                    };
                                    callback(null,obj);
                                }
                                else
                                {
                                    console.log("Increment not suites "+key);
                                    client.decr(key, function (errDecr,resDecr) {

                                        if(errDecr )
                                        {
                                            console.log("Decrement error "+key);
                                            var obj = {
                                                key:key,
                                                rvtSt:true,
                                                Availability:false
                                            };
                                            callback(new Error("Error in reverting key record : "+key),obj);
                                        }
                                        else if(resDecr==0)
                                        {
                                            console.log("Decrement done Value =0  "+key);
                                            var obj = {
                                                key:key,
                                                rvtSt:false,
                                                Availability:false
                                            };
                                            callback(undefined,obj);
                                        }
                                        else
                                        {
                                            console.log("Decrement Done "+key);
                                            var obj = {
                                                key:key,
                                                rvtSt:false,
                                                Availability:false
                                            };
                                            callback(undefined,obj);
                                        }

                                    });
                                }
                            }
                        });
                    }
                });


            });
        }
    });


    async.parallel(checkArray, function (err,res) {
        // console.log("e "+err);
        var resultCount=res.length;

        if(err)
        {
            console.log("e "+err);
            callbackData(err,undefined);
        }
        else
        {
            console.log("r "+JSON.stringify(res));
            var descKeys=[];
            var avblSt=true;
            var avblKeys=[];
            var decdCount=0;

            if(condition=="AND")
            {

                res.forEach(function (item) {

                    if(item.rvtSt )
                    {
                        console.log("Going to decr "+item.key);
                        descKeys.push(item.key);
                        avblSt=false;


                    }
                    else
                    {

                        if(item.Availability)
                        {
                            avblKeys.push(item.key);
                        }
                        else
                        {
                            avblSt=false;
                            decdCount++;

                        }
                    }


                });

                if(decdCount == resultCount)
                {
                    console.log("Unavailable. Keys already decremented");
                    callbackData(new Error("Keys Unavailable "),undefined);
                }

                if(descKeys.length>0)
                {
                    MultipleDecrementer(descKeys,reqId, function (errDecr,resDecr) {
                        console.log("Err arr "+JSON.stringify(errDecr));
                        console.log("Res arr "+JSON.stringify(resDecr));

                        callbackData(new Error("Keys not available"),undefined);



                    });
                }


                if(avblKeys.length==resultCount)
                {
                    callbackData(undefined,"Success");
                }
                else
                {
                    MultipleDecrementer(avblKeys,reqId, function (errAvblDecr,resAvblDecr)
                    {

                        if(errAvblDecr.length>0)
                        {
                            callbackData(new Error("Errors In Key fixing operation "+avblKeys),undefined);
                        }
                        else
                        {
                            console.log(avblSt);

                            if(!avblSt)
                            {
                                console.log("Keys not available");
                                callbackData(new Error('Keys Unavailable '+avblKeys),undefined);

                            }
                            else
                            {
                                console.log("Available Keys,Success");
                                callbackData(undefined,"Success");

                            }
                        }
                    });

                }

            }
            else
            {
                console.log("Not AND condition");
                callbackData(new Error("Errors In Condition : "+condition),undefined);
            }
        }
    });

};

function MultipleDecrementer(keys,reqId,callback)
{
    var errArr=[];
    var resArr=[];
    var i=0;
    keys.forEach(function (item) {
        i++;
        LimitDecrement(item,reqId, function (e,r) {
            if(e || r==-1)
            {
                errArr.push(item);
            }
            else
            {
                resArr.push(item);
            }

            if(i==keys.length)
            {
                callback(errArr,resArr);
            }
        });

    });

};

function MultiKeyDecrementer(keys,condition,reqId,callbackData)
{
    var keyIds = keys;
    var checkArray=[];

    keyIds.forEach(function (key) {
        if (key) {
            checkArray.push(function createContact(callback) {

                client.get(key,function (errKey,resKey) {
                    if(errKey || !resKey)
                    {
                        console.log("Key getting error "+errKey+" of "+key);
                        var obj = {
                            key:key,
                            rvtSt:false,
                            Availability:false
                        };
                        callback(new Error("Key "+key+" not found. Error :"+errKey),obj);
                    }
                    else
                    {
                        client.decr(key, function (errDecr,resDecr) {
                            if(errDecr )
                            {
                                console.log("resp decr "+resDecr+" "+key);
                                console.log("Decrementing error "+errDecr+" of "+key);
                                var obj = {
                                    key:key,
                                    rvtSt:false,
                                    Availability:false
                                };
                                callback(new Error("Error in Decrementing key :  "+key+" .Error : "+errDecr),obj);
                            }
                            else
                            {
                                if(resDecr>=0)
                                {
                                    console.log("Decrement suites "+key);
                                    var obj = {
                                        key:key,
                                        rvtSt:false,
                                        Availability:true
                                    };
                                    callback(null,obj);
                                }
                                else
                                {
                                    console.log("Decrement not suites "+key);
                                    client.incr(key, function (errIncr,resIncr) {

                                        if(errIncr)
                                        {
                                            console.log("resp incr "+resIncr+" "+key);
                                            console.log("Increment error "+errIncr+" of "+key);
                                            var obj = {
                                                key:key,
                                                rvtSt:true,
                                                Availability:false
                                            };
                                            callback(new Error("Reverting updated key "+key+" failed. Error : "+errIncr),obj);
                                        }
                                        else
                                        {
                                            console.log("Increment Done "+key);
                                            var obj = {
                                                key:key,
                                                rvtSt:false,
                                                Availability:false
                                            };
                                            callback(null,obj);
                                        }

                                    });
                                }
                            }
                        });
                    }
                });


            });
        }
    });

    async.parallel(checkArray, function (err,res) {
        // console.log("e "+err);
        var resultCount=res.length;

        if(err)
        {
            console.log("e "+err);
            callbackData(err,undefined);
        }
        else
        {
            console.log("r "+JSON.stringify(res));
            var incrKeys=[];
            var avblSt=true;
            var avblKeys=[];
            var incdCount=0;
            if(condition=="AND")
            {

                res.forEach(function (item) {

                    if(item.rvtSt)
                    {
                        console.log("Going to decr "+item.key);
                        incrKeys.push(item.key);
                        avblSt=false;

                    }
                    else
                    {
                        if(item.Availability)
                        {
                            avblKeys.push(item.key);
                        }
                        else
                        {
                            avblSt=false;
                            incdCount++;
                        }
                    }

                });


                if(incdCount == resultCount)
                {
                    console.log("Unavailable. Keys already Incremented");
                    callbackData(new Error("Keys unavailable."),undefined);
                }

                if(incrKeys.length>0)
                {
                    MultipleIncrementer(incrKeys,reqId, function (errDecr,resDecr) {
                        console.log("Err arr "+JSON.stringify(errDecr));
                        console.log("Res arr "+JSON.stringify(resDecr));

                        //callbackData(errDecr,resDecr);
                        callbackData(new Error("Keys unavailable."),undefined);


                    });
                }

                if(avblKeys.length==resultCount)
                {
                    callbackData(undefined,"Success");
                }

                else

                {
                    MultipleIncrementer(avblKeys,reqId, function (errAvblIncr,resAvblIncr)
                    {
                        if(errAvblIncr.length>0)
                        {
                            callbackData(new Error("Keys unavailable "),undefined);
                        }
                        else
                        {
                            console.log(avblSt);
                            if(!avblSt)
                            {
                                console.log("Keys not available");
                                callbackData(new Error('Keys unavailable '),undefined);
                            }
                            else
                            {
                                console.log("Available Keys,Success");
                                callbackData(undefined,"Success");

                            }
                        }
                    });


                }


            }
            else
            {
                callbackData(new Error("Errors In Condition "+condition),undefined);
            }
        }
    });

}

function MultipleIncrementer(keys,reqId,callback)
{
    var errArr=[];
    var resArr=[];
    var i=0;
    keys.forEach(function (item) {
        i++;
        LimitIncrement(item,reqId, function (e,r) {
            if(e)
            {
                errArr.push(item);
            }
            else
            {
                resArr.push(item);
            }

            if(i==keys.length)
            {
                callback(errArr,resArr);
            }
        });

    });

};


function sendNotification(compInfo,callback)
{


    var httpUrl = util.format('http://%s/DVP/API/%s/Organisation', userServiceURL, userServiceVersion);
    var options = {
        url: httpUrl,
        method: 'GET',
        headers:{
            'authorization':"bearer "+token,
            'companyinfo':compInfo
        }

    };

    try
    {
        httpReq(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("no errrs in request 200 ok");


                var messageData =
                {
                    To:JSON.parse(body).Result.ownerId,
                    Message:"You are reached maximum limit",
                    From:"Limit Service"
                }


                var httpUrl = util.format('http://%s/DVP/API/%s//NotificationService/Notification/initiate', notificationServiceURL, notificationServiceVersion);
                var options = {
                    url: httpUrl,
                    method: 'POST',
                    json: messageData,
                    headers:{
                        'authorization':"bearer "+token,
                        'eventname':"message",
                        'companyinfo':compInfo
                    }


                };

                try
                {
                    httpReq(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("no errrs in request 200 ok");
                            callback(undefined,"Success");

                        }
                        else {
                            console.log("error in request  " + error);
                            callback(error,undefined);

                        }
                    });
                }
                catch (ex) {
                    console.log("exception" + ex);
                    callback(ex,undefined);


                }


            }
            else {
                console.log("error in request  " + error);
                callback(error,undefined);


            }
        });
    }
    catch (ex) {
        console.log("exception" + ex);
        callback(ex,undefined);


    }


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
module.exports.MultiKeyIncrementer = MultiKeyIncrementer;
module.exports.MultiKeyDecrementer = MultiKeyDecrementer;
module.exports.UpdateMaxLimitWithSwitch = UpdateMaxLimitWithSwitch;


