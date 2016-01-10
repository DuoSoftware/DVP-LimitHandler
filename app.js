/**
 * Created by pawan on 2/23/2015.
 */

var restify = require('restify');
var schedule=require('./SheduleApi.js');
var limit = require('./LimitApi.js');
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var log4js=require('log4js');
var config = require('config');

var port = config.Host.port || 3000;
var version=config.Host.version;
var hpath=config.Host.hostpath;
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var uuid = require('node-uuid');



log4js.configure(config.Host.logfilepath, { cwd: hpath });
var log = log4js.getLogger("app");
fs = require('fs');

var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
});

//restify.CORS.ALLOW_HEADERS.push('Accept-Encoding');
//restify.CORS.ALLOW_HEADERS.push('Accept-Language');
restify.CORS.ALLOW_HEADERS.push('authorization');
//restify.CORS.ALLOW_HEADERS.push('Access-Control-Request-Method');



RestServer.use(restify.CORS());
RestServer.use(restify.fullResponse());

//Server listen
RestServer.listen(port, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);




});
//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());




//.......................................post............................................................................

RestServer.get('/DVP/API',function(req,res,next) {

    res.end("HIT");
    return next();
});


RestServer.post('/DVP/API/'+version+'/LimitAPI/Schedule/Appointment',function(req,res,next) {


    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }
    var Company=1;
    var Tenant=1;

    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.InitialData] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }

    try {

        var Days=SetDays(req.body.DaysOfWeek);
        console.log("Got Days "+Days);

        logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] - [HTTP]  - Request received -  Data -  ',reqId,req.body);
        schedule.CreateAppointment(req.body,Days.toString(),Company,Tenant,reqId,function(err,resz)
        {

            if(err)
            {


                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {

        logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [HTTP]  - Exception occurred when service started : CreateAppointment -  Data  ',reqId,JSON.stringify(req.body),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Schedule',function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;


    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.CreateSchedule] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }

    try {

        logger.debug('[DVP-LimitHandler.CreateSchedule] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,JSON.stringify(req.body));
        schedule.CreateSchedule(req.body,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.CreateSchedule] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.CreateSchedule] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {
        //log.fatal("Exception found in AddSchedule : "+ex);
        logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [HTTP]  - Exception occurred when service started : NewSchedule -  Data - ',reqId,req.body,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.CreateSchedule] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/InitialData',function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }



    var Company=1;
    var Tenant=1;


    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.InitialData] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }


    try {

        logger.debug('[DVP-LimitHandler.InitialData] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,JSON.stringify(req.body));
       schedule.CreateSchedule(req.body.Schedule,Company,Tenant,reqId,function(errScedule,resSchedule)
         {
         if(errScedule)
         {

         var jsonString = messageFormatter.FormatMessage(errScedule, "ERROR/EXCEPTION", false, undefined);
         logger.debug('[DVP-LimitHandler.InitialData] - [%s] - Request response : %s ',reqId,jsonString);
         res.end(jsonString);
         }
         else
         {

             var Apps=req.body.Appointment;

         var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resSchedule);
         logger.debug('[DVP-LimitHandler.InitialData] - [%s] - Request response : %s ',reqId,jsonString);
         //res.end(jsonString);

             if(req.body.Appointment && Apps.length>0)
             {


                 try {


                     var ErrorList=[];

                     var AppBody=req.body.Appointment;
                     var x=(AppBody.length-1);

                     for(var index in AppBody)
                     {
                         var Days=SetDays(AppBody[index].DaysOfWeek);

                         AppBody[index].ScheduleId=resSchedule.id;

                         logger.debug('[DVP-LimitHandler.InitialData] - [%s] - [HTTP]  - Request received -  Data -  ',reqId,req.body);
                         schedule.CreateAppointment(AppBody[index],Days.toString(),Company,Tenant,reqId,function(errApp,resApp)
                         {

                             if(errApp)
                             {
                                 var jsonString = messageFormatter.FormatMessage(errApp, "ERROR/EXCEPTION", false, undefined);
                                 logger.debug('[DVP-LimitHandler.InitialData] - [%s] - Request response : %s ',reqId,jsonString);
                                 if(index>=x)
                                 {
                                     ErrorList.push(AppBody[index]);


                                     var jsonErrorList = messageFormatter.FormatMessage(ErrorList, "Operation Succeed,Error Appointments", false, undefined);

                                     res.end(jsonErrorList);
                                 }

                             }
                             else
                             {
                                 var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resApp);
                                 logger.debug('[DVP-LimitHandler.InitialData] - [%s] - Request response : %s ',reqId,jsonString);

                                 if(index>=x)
                                 {

                                     if(ErrorList.length>0)
                                     {
                                         var jsonErrorList = messageFormatter.FormatMessage(ErrorList, "Operation Succeed,Error Appointments found ", true, undefined);
                                         res.write(jsonErrorList);
                                         var jsonScheduleList = messageFormatter.FormatMessage(undefined, "Operation Succeed ", true, resSchedule);
                                         res.end(jsonScheduleList);
                                     }
                                     else
                                     {
                                         var jsonScheduleList = messageFormatter.FormatMessage(undefined, "Operation Succeed", true, resSchedule);
                                         res.end(jsonScheduleList);
                                     }



                                 }


                             }

                         });

                     }






                 }
                 catch(ex)
                 {

                     logger.error('[DVP-LimitHandler.InitialData] - [%s] - [HTTP]  - Exception occurred when service started : CreateAppointment -  Data  ',reqId,JSON.stringify(req.body),ex);
                     var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
                     logger.debug('[DVP-LimitHandler.InitialData] - [%s] - Request response : %s ',reqId,jsonString);
                     res.end(jsonString);
                 }
             }
             else
             {
                 var jsonString = messageFormatter.FormatMessage(undefined, "Scedule Adding Succeeded, No Appointment details received.", true, resSchedule);
                 logger.debug('[DVP-LimitHandler.InitialData] - [%s] - Request response : %s ',reqId,jsonString);
                  res.end(jsonString);
             }


         }

         });



    }
    catch(ex)
    {
        //log.fatal("Exception found in AddSchedule : "+ex);
        logger.error('[DVP-LimitHandler.InitialData] - [%s] - [HTTP]  - Exception occurred when service started : NewSchedule -  Data - ',reqId,req.body,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.InitialData] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Schedule/:id',function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;
    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.InitialData] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }



    try {

        //var ID=parseInt(req.params.id);
        logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] - [HTTP]  - Request received -  Data - id %s Other %s ',reqId,req.params.id,JSON.stringify(req.body));
        schedule.UpdateSchedule(req.params.id,req.body,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
        });


    }
    catch(ex)
    {

        logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] - [HTTP]  - Exception occurred when service started : UpdateSchedule -  Data - id %s Other %s ',reqId,req.params.id,JSON.stringify(req.body),ex);

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Schedule/:sid/AddAppointment/:appid',function(req,res,next) {

    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;

    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.InitialData] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }


    try {
        logger.debug('[DVP-LimitHandler.AssignAppointment] - [%s] - [HTTP]  - Request received -  Data - Schedule %d Appointment %d ',reqId,req.params.sid,req.params.appid);
        schedule.AssignAppointment(req.params.sid,req.params.appid,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {


                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.AssignAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.AssignAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
        });


    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [HTTP]  - Exception occurred when service started : UpdateSceduleId -  Data - Schedule %s Appointment %s ',reqId,eq.params.sid,req.params.appid,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false,undefined);
        logger.debug('[DVP-LimitHandler.AssignAppointment] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Schedule/Appointment/:id',function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;

    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.InitialData] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }


    try {
        logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] - [HTTP]  - Request received -  Appointment %s Data %s',reqId,req.params.id,JSON.stringify(req.body));
        schedule.UpdateAppointment(req.params.id,req.body,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {

        logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] - [HTTP]  - Exception occurred when service started : UpdateAppointmentData -  Appointment %s Data %s',reqId,req.params.id,JSON.stringify(req.body),ex);

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/Increment/:key',function(req,res,next) {

    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }
    try {
        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,req.params.key);
        limit.LimitIncrement(req.params.key,reqId,function(err,resz)
        {

            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.erro('[DVP-LimitHandler.LimitIncrement] - [%s] - [HTTP]  - Exception occurred when starting : LimitIncrement -  Data - %s ',reqId,req.params.key,ex);
        var jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.LimitIncrement] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/Decrement/:key',function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }
    try {
        logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,req.params.key);


        limit.LimitDecrement(req.params.key,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] - Request response : ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] - Request response : ',reqId,jsonString);
                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {

        logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [HTTP]  - Exception occurred while requesting method : LimitDecrement  -  Data - ',reqId,req.params.key,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.LimitDecrement] - [%s] - Request response : ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit',function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {
        console.log("reqID error");
    }
    try
    {
        logger.debug('[DVP-LimitHandler.CreateLimit] - [%s] - [HTTP]  - Request received -  Data  ',reqId);

        var obj=req.body;

        limit.CreateLimit(obj,reqId,function(errSave,resSave)
        {
            if(errSave)
            {

                var jsonString = messageFormatter.FormatMessage(errSave, "ERROR/EXCEPTION", false, undefined);
                logger.error('[DVP-LimitHandler.CreateLimit] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {


                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resSave);
                logger.debug('[DVP-LimitHandler.CreateLimit] - [%s] - Request response %s: ',reqId,jsonString);
                res.end(jsonString);
            }


        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.CreateLimit] - [%s] - [HTTP]  - Exception occurred while requesting method : NewLimitRecord  -  Data - %s ',reqId,req.params.key,ex);

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.CreateLimit] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/Max/:lid',function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;

    try {
        logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] - [HTTP]  - Request received -  Data - LimitId %s others %s ',reqId,req.params.lid,JSON.stringify(req.body));


        limit.UpdateMaxLimit(req.params.lid,req.body,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {


                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {

        logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [HTTP]  - Exception occurred while requesting method : UpdateMaxLimit  -  Data - LimitId %s others  ',reqId,req.params.lid,req.body,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/:lid/Activate/:status',function(req,res,next) {


    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;

    try {
        logger.debug('[DVP-LimitHandler.ActivateLimit] - [%s] - [HTTP]  - Request received -  Data - Limit ID %s others %s',reqId,req.params.LID,JSON.stringify(req.body));
        limit.ActivateLimit(req.params.lid,req.params.status,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.ActivateLimit] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.ActivateLimit] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.ActivateLimit] - [%s] - [HTTP]  - Exception occurred whe startiong request : UpdateEnableState -  Data - Limit ID %s others %s',reqId,req.params.LID,JSON.stringify(req.body),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.ActivateLimit] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/Restore',function(req,res,next) {


    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;

    try {
        logger.debug('[DVP-LimitHandler.RestoreLimit] - [%s] - [HTTP]  - Request received - ',reqId);
        limit.ReloadRedis(reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.RestoreLimit] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(err, "SUCCESS/Error List", true, resz);
                logger.debug('[DVP-LimitHandler.RestoreLimit] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.RestoreLimit] - [%s] - [HTTP]  - Exception occurred when starting request : RestoreLimit ',reqId);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.RestoreLimit] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

//.......................................get.............................................................................

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/ValidAppointment/:scheduleID',function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;

    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.InitialData] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }


    try {
        logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,req.params.scheduleID);


        schedule.PickValidAppointment(req.params.scheduleID,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [HTTP]  - Exception occurred when requesting : PickValidAppointment -  Data - %s ',reqId,req.params.scheduleID,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();

});

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/UnAssignedAppointments',function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;

    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.InitialData] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }

    try {
        logger.debug('[DVP-LimitHandler.PickUnassignedAppointment] - [%s] - [HTTP]  - Request received -   ',reqId);


        schedule.PickUnassignedAppointments(req.params.scheduleID,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.PickUnassignedAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.PickUnassignedAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickUnassignedAppointment] - [%s] - [HTTP]  - Exception occurred when requesting : PickUnassignedAppointment - ',reqId,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickUnassignedAppointment] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();

});

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/:id/ValidAppointment/:date/:time',function(req,res,next) {
    //dt = 2015-09-09
    //dy = Friday
    //tm = 11:20 (24Hrs)


    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {
        logger.debug('[DVP-LimitHandler.CheckAvailables] - [%s] - [HTTP]  - Request received   -  Data - Date %s Time %s',reqId,req.params.date,req.params.time);
        var Dt=req.params.date;
        var Tm=req.params.time;
        var Cmp=1;
        var Ten=1;



        schedule.CheckAvailables(req.params.id,Dt,Tm,Cmp,Ten,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.CheckAvailables] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.CheckAvailables] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);

            }
        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - [HTTP]  - Exception occurred when requesting : PickValidAppointment -  Data - %s ',reqId,JSON.stringify(req.body),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.CheckAvailables] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/:id',function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;

    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.PickScheduleById] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }


    try {
        logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.id);



        schedule.PickSchedule(req.params.id,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - Request response : %s ',reqId,"APS");

                res.end(jsonString);
            }
            else
            {


                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - Request response : %s ',reqId,jsonString);

                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [HTTP]  - Error when request starts : PickScheduleById  Data - Id %s',reqId,req.params.id,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedules',function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;


    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.PickAllSchedules] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }


    try {
        logger.debug('[DVP-LimitHandler.PickAllSchedules] - [%s] - [HTTP]  - Request received ',reqId);



        schedule.PickSchedules(Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.PickAllSchedules] - [%s] - Request response : %s ',reqId,jsonString);

                res.end(jsonString);
            }
            else
            {


                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.PickAllSchedules] - [%s] - Request response : %s ',reqId,jsonString);

                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickAllSchedules] - [%s] - [HTTP]  - Error when request starts : PickAllSchedules ',reqId,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickAllSchedules] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/:id/Action',function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;
    try {
        logger.debug('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.id);


        schedule.PickScheduleAction(req.params.id,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [HTTP]  - Exception occurred on request : PickScheduleActionById   -  Data - Id %s',reqId,req.params.id,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickScheduleActionById] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................


RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/:id/Appointments',function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company= 1;
    var Tenant=1;

    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.PickAppointmentById] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }

    try {
        logger.debug('[DVP-LimitHandler.PickAppointmentById] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.id);


        schedule.PickAppointment(req.params.id,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.PickAppointmentById] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.PickAppointmentById] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [HTTP]  - Exception occurred on request : PickAppointmentById   -  Data - Id %s',reqId,req.params.id,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickAppointmentById] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();

});

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/Appointment/:id/Action',function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }
    var Company=1;
    var Tenant=1;

    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.Schedules] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }


    try {
        logger.debug('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.id);


        schedule.PickAppointmentAction(req.params.id,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.PickAppointmentAction] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.PickAppointmentAction] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [HTTP]  - Exception occurred on request : PickAppointmentAction   -  Data - Id %s',reqId,req.params.id,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickAppointmentAction] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/'+version+'/LimitAPI/Limit/Current/:Rid',function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {
        logger.debug('[DVP-LimitHandler.CurrentLimit] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.Rid);



        limit.GetCurrentLimit(req.params.Rid,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.CurrentLimit] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.CurrentLimit] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.CurrentLimit] - [%s] - [HTTP]  - Exception occurred on request : CurrentLimit   -  Data - Id %s',reqId,req.params.Rid,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.CurrentLimit] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }

    return next();

});

RestServer.get('/DVP/API/'+version+'/LimitAPI/Limit/MaxLimit/:Rid',function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;

    try {
        var auth = req.header('authorization');
        var authInfo = auth.split("#");

        if (authInfo.length >= 2) {
            Tenant = authInfo[0];
            Company = authInfo[1];
        }
    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.InitialData] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }

    try {
        logger.debug('[DVP-LimitHandler.MaxLimit] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.Rid);

        limit.GetMaxLimit(req.params.Rid,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.MaxLimit] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.MaxLimit] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }


        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.MaxLimit] - [%s] - [HTTP]  - Exception occurred on request : MaxLimit   -  Data - Id %s',reqId,req.params.Rid,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.MaxLimit] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }

    return next();

});

RestServer.get('/DVP/API/'+version+'/LimitAPI/Limit/Info',function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;

    try {
        var auth = req.header('authorization');
        var authInfo = auth.split("#");

        if (authInfo.length >= 2) {
            Tenant = authInfo[0];
            Company = authInfo[1];
        }
    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.InitialData] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }

    try {
        logger.debug('[DVP-LimitHandler.LimitInfo] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.Rid);

        limit.GetLimitInfo(reqId,Company,Tenant,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.LimitInfo] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.LimitInfo] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }


        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.LimitInfo] - [%s] - [HTTP]  - Exception occurred on request : MaxLimit   -  Data - Id %s',reqId,req.params.Rid,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.LimitInfo] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }

    return next();

});

//.......................................................................................................................

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/byCompany',function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var Company=1;
    var Tenant=1;

    try {
        if(req.header('authorization'))
        {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                Tenant = authInfo[0];
                Company = authInfo[1];
            }
        }
        else
        {
            Tenant = 1;
            Company = 1;
        }

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.PickSchedulesByCompany] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
    }


    try {
        logger.debug('[DVP-LimitHandler.PickSchedulesByCompany] - [%s] - [HTTP]  - Request received   -  Data - Company %s',reqId,Company);



        schedule.PickSchedulesByCompany(Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.PickSchedulesByCompany] - [%s] - ',reqId);

                res.end(jsonString);
            }
            else
            {


                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.PickSchedulesByCompany] - [%s] - Request response : %s ',reqId,jsonString);

                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [HTTP]  - Error when request starts : PickSchedulesByCompany  Company  %s',reqId,Company,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});


function SetDays(a)
{
    var IsFirst=0;
    var WeekDays='';


    console.log(a);


    for(var index in a)
    {

        //if(a[index]== true)
        if(a[index])
        {

            if(IsFirst==0)
            {
                WeekDays=index;
                IsFirst=1;

            }else
            {
                WeekDays=WeekDays+","+index;

            }


        }
        else
        {
           // continue;
        }

    }


    return WeekDays;
}

function Crossdomain(req,res,next){


    var xml='<?xml version=""1.0""?><!DOCTYPE cross-domain-policy SYSTEM ""http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd""> <cross-domain-policy>    <allow-access-from domain=""*"" />        </cross-domain-policy>';

    /*var xml='<?xml version="1.0"?>\n';

     xml+= '<!DOCTYPE cross-domain-policy SYSTEM "/xml/dtds/cross-domain-policy.dtd">\n';
     xml+='';
     xml+=' \n';
     xml+='\n';
     xml+='';*/
    req.setEncoding('utf8');
    res.end(xml);

}

function Clientaccesspolicy(req,res,next){


    var xml='<?xml version="1.0" encoding="utf-8" ?>       <access-policy>        <cross-domain-access>        <policy>        <allow-from http-request-headers="*">        <domain uri="*"/>        </allow-from>        <grant-to>        <resource include-subpaths="true" path="/"/>        </grant-to>        </policy>        </cross-domain-access>        </access-policy>';
    req.setEncoding('utf8');
    res.end(xml);

}

RestServer.get("/crossdomain.xml",Crossdomain);
RestServer.get("/clientaccesspolicy.xml",Clientaccesspolicy);


