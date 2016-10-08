/**
 * Created by pawan on 2/23/2015.
 */

var restify = require('restify');
var schedule=require('./SheduleApi.js');
var limit = require('./LimitApi.js');
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var config = require('config');

var port = config.Host.port || 3000;
var version=config.Host.version;
var hpath=config.Host.hostpath;
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var uuid = require('node-uuid');

//var jwt = require('restify-jwt');
//var secret = require('dvp-common/Authentication/Secret.js');
var jwt = require('restify-jwt');
var secret = require('dvp-common/Authentication/Secret.js');
var authorization = require('dvp-common/Authentication/Authorization.js');



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
RestServer.use(jwt({secret: secret.Secret}));


// Security...............................................................................................................................................

//RestServer.use(jwt({secret: secret.Secret}));
//.............................................................................................
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

RestServer.post('/DVP/API/'+version+'/LimitAPI/Schedule',authorization({resource:"schedule", action:"write"}),function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {

        logger.debug('[DVP-LimitHandler.CreateSchedule] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,JSON.stringify(req.body));

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;



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

RestServer.post('/DVP/API/'+version+'/LimitAPI/Schedule/Appointment',authorization({resource:"appointment", action:"write"}),function(req,res,next) {


    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }



    try {


        logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] - [HTTP]  - Request received -  Data -  ',reqId,req.body);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

        var Days=SetDays(req.body.DaysOfWeek);

        schedule.CreateAppointment(req.body,Days,Company,Tenant,reqId,function(err,resz)
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

RestServer.post('/DVP/API/'+version+'/LimitAPI/InitialData',authorization({resource:"schedule", action:"write"}),function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }


    try {

        logger.debug('[DVP-LimitHandler.InitialData] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,JSON.stringify(req.body));

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

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

RestServer.post('/DVP/API/'+version+'/LimitAPI/Schedule/:id',authorization({resource:"schedule", action:"write"}),function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {

        logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] - [HTTP]  - Request received -  Data - id %s Other %s ',reqId,req.params.id,JSON.stringify(req.body));

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

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

RestServer.post('/DVP/API/'+version+'/LimitAPI/Schedule/:sid/AddAppointment/:appid',authorization({resource:"schedule", action:"write"}),function(req,res,next) {

    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }


    try {
        logger.debug('[DVP-LimitHandler.AssignAppointment] - [%s] - [HTTP]  - Request received -  Data - Schedule %d Appointment %d ',reqId,req.params.sid,req.params.appid);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

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

RestServer.post('/DVP/API/'+version+'/LimitAPI/Schedule/Appointment/:id',authorization({resource:"appointment", action:"write"}),function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }


    try {
        logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] - [HTTP]  - Request received -  Appointment %s Data %s',reqId,req.params.id,JSON.stringify(req.body));

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;
        var Days=SetDays(req.body.DaysOfWeek);

        schedule.UpdateAppointment(req.params.id,req.body,Days,Company,Tenant,reqId,function(err,resz)
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

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit',authorization({resource:"limit", action:"write"}),function(req,res,next) {
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

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;


        var obj=req.body;

        limit.CreateLimit(obj,Company,Tenant,reqId,function(errSave,resSave)
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

RestServer.put('/DVP/API/'+version+'/LimitAPI/Limit/:lid/Activate/:status',authorization({resource:"limit", action:"write"}),function(req,res,next) {


    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }



    try {
        logger.debug('[DVP-LimitHandler.ActivateLimit] - [%s] - [HTTP]  - Request received -  Data - Limit ID %s others %s',reqId,req.params.LID,JSON.stringify(req.body));

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;



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

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/Increment/:key',authorization({resource:"limit", action:"write"}),function(req,res,next) {

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

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        limit.LimitIncrement(req.params.key,req.user,reqId,function(err,resz)
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

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/MultipleKeys/Increment',authorization({resource:"limit", action:"write"}),function(req,res,next) {

    var reqId='';
    var bodyData;
    var keyList;

    //console.log(req.body);
    console.log("Hit "+typeof (req.body));
    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }
    try {


        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        if(typeof(req.body)=="string")
        {
            logger.debug('[DVP-LimitHandler.MultiKeyIncrementer] - [HTTP]  - Request received as String -  Data - %s',req.body);

            var reqObj=JSON.parse(req.body);
            if(typeof (reqObj)=="object")
            {
                bodyData=reqObj;
                keyList=reqObj.keys;
            }
            else
            {
                bodyData=JSON.parse(reqObj);
                keyList=bodyData.keys;
            }

        }
        else
        {
            logger.debug('[DVP-LimitHandler.MultiKeyIncrementer] - [%s] - [HTTP]  - Request received as Object  -  Data - %s',JSON.stringify(req.body));
            bodyData=req.body;
            keyList=bodyData.keys;
        }



        limit.MultiKeyIncrementer(keyList,bodyData.condition,reqId,function(err,resz)
        {

            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err,err.message , false, undefined);
                logger.debug('[DVP-LimitHandler.MultiKeyIncrementer] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.MultiKeyIncrementer] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.MultiKeyIncrementer] - [%s] - [HTTP]  - Exception occurred when starting : MultiKeyIncrement -  Data - %s ',reqId,req.body.keys,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.MultiKeyIncrementer] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/MultipleKeys/Increment/test',function(req,res,next) {

    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }
    try {
        logger.debug('[DVP-LimitHandler.MultiKeyIncrementer] - [%s] - [HTTP]  - Request received -  Data - %s',reqId,JSON.stringify(req.body));

        limit.MultiKeyIncrementer(req.body.keys,req.body.condition,reqId,function(err,resz)
        {

            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.MultiKeyIncrementer] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.MultiKeyIncrementer] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.MultiKeyIncrement] - [%s] - [HTTP]  - Exception occurred when starting : MultiKeyIncrement -  Data - %s ',reqId,req.body.keys,ex);
        var jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.MultiKeyIncrement] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/Decrement/:key',authorization({resource:"limit", action:"write"}),function(req,res,next) {
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

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }


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

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/MultipleKeys/Decrement',authorization({resource:"limit", action:"write"}),function(req,res,next) {

    var reqId='';
    var bodyData;
    var keyList;

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }
    try {

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }
        if(typeof(req.body)=="string")
        {

            logger.debug('[DVP-LimitHandler.MultiKeyDecrement] - [%s] - [HTTP]  - Request received as string -  Data - %s ',reqId,req.body);
            var reqObj=JSON.parse(req.body);

            if(typeof (reqObj)=="object")
            {
                bodyData=reqObj;
                keyList=reqObj.keys;
            }
            else
            {
                bodyData=JSON.parse(reqObj);
                keyList=bodyData.keys;
            }
        }
        else
        {
            logger.debug('[DVP-LimitHandler.MultiKeyDecrement] - [%s] - [HTTP]  - Request received as Object -  Data - %s %s',reqId,req.body.keys,req.body.condition);

            bodyData=req.body;
            keyList=bodyData.keys;
        }

        limit.MultiKeyDecrementer(keyList,bodyData.condition,reqId,function(err,resz)
        {

            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, err.message, false, undefined);
                logger.debug('[DVP-LimitHandler.MultiKeyDecrement] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.MultiKeyDecrement] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.MultiKeyDecrement] - [%s] - [HTTP]  - Exception occurred when starting : LimitIncrement -  Data - %s ',reqId,req.body.keys,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.MultiKeyDecrement] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/MultipleKeys/Decrement/test',function(req,res,next) {

    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }
    try {
        logger.debug('[DVP-LimitHandler.MultiKeyDecrement] - [%s] - [HTTP]  - Request received -  Data - %s %s',reqId,req.body.keys,req.body.condition);

        /*if(!req.user.company || !req.user.tenant)
         {
         throw new Error("Invalid company or tenant");
         }*/

        limit.MultiKeyDecrementer(req.body.keys,req.body.condition,reqId,function(err,resz)
        {

            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.MultiKeyDecrement] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.MultiKeyDecrement] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.MultiKeyDecrement] - [%s] - [HTTP]  - Exception occurred when starting : LimitIncrement -  Data - %s ',reqId,req.body.keys,ex);
        var jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.MultiKeyDecrement] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});
// update swagger
RestServer.put('/DVP/API/'+version+'/LimitAPI/Limit/:lid/Max/:max',authorization({resource:"limit", action:"write"}),function(req,res,next) {
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }



    try {
        logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] - [HTTP]  - Request received -  Data - LimitId %s others %s ',reqId,req.params.lid,req.params.max);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

        limit.UpdateMaxLimit(req.params.lid,req.params.max,Company,Tenant,reqId,function(err,resz)
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

        logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [HTTP]  - Exception occurred while requesting method : UpdateMaxLimit  -  Data - LimitId %s others  ',reqId,req.params.lid,req.params.max,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/'+version+'/LimitAPI/Limit/Restore',authorization({resource:"limit", action:"write"}),function(req,res,next) {


    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }



    try {
        logger.debug('[DVP-LimitHandler.RestoreLimit] - [%s] - [HTTP]  - Request received - ',reqId);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

        limit.ReloadRedis(Company,Tenant,reqId,function(err,resz)
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

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/ValidAppointment/:scheduleID',authorization({resource:"schedule", action:"read"}),function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }





    try {
        logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,req.params.scheduleID);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;


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

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/UnAssignedAppointments',authorization({resource:"appointment", action:"read"}),function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {
        logger.debug('[DVP-LimitHandler.PickUnassignedAppointment] - [%s] - [HTTP]  - Request received -   ',reqId);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

        schedule.PickUnassignedAppointments(Company,Tenant,reqId,function(err,resz)
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

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/:id/ValidAppointment/:date/:time',authorization({resource:"appointment", action:"read"}),function(req,res,next) {
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

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Cmp=req.user.company;
        var Ten=req.user.tenant;
        var Dt=req.params.date;
        var Tm=req.params.time;


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

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/:id',authorization({resource:"schedule", action:"read"}),function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }



    try {
        logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.id);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

        schedule.PickSchedule(req.params.id,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - Request response : %s ',reqId,"Got");

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

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedules',authorization({resource:"schedule", action:"read"}),function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {
        logger.debug('[DVP-LimitHandler.PickAllSchedules] - [%s] - [HTTP]  - Request received ',reqId);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

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

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/:id/Action',authorization({resource:"schedule", action:"read"}),function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }


    try {
        logger.debug('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.id);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

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

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/:id/Appointments',authorization({resource:"schedule", action:"read"}),function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }


    try {
        logger.debug('[DVP-LimitHandler.PickAppointmentById] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.id);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

        schedule.PickAppointmentsWithSchedules(req.params.id,Company,Tenant,reqId,function(err,resz)
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

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedule/Appointment/:id/Action',authorization({resource:"appointment", action:"read"}),function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {
        logger.debug('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.id);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

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

RestServer.get('/DVP/API/'+version+'/LimitAPI/Limit/Current/:Rid',authorization({resource:"limit", action:"read"}),function(req,res,next) {
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
        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }



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

RestServer.get('/DVP/API/'+version+'/LimitAPI/Limit/MaxLimit/:Rid',authorization({resource:"limit", action:"read"}),function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }


    try {
        logger.debug('[DVP-LimitHandler.MaxLimit] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.Rid);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        limit.GetMaxLimit(req.params.Rid,reqId,function(err,resz)
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

RestServer.get('/DVP/API/'+version+'/LimitAPI/Limit/Info',authorization({resource:"limit", action:"read"}),function(req,res,next) {

    var reqId='';
    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }


    try {
        logger.debug('[DVP-LimitHandler.LimitInfo] - [%s] - [HTTP]  - Request received   ',reqId);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;


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
        logger.error('[DVP-LimitHandler.LimitInfo] - [%s] - [HTTP]  - Exception occurred on request : ',reqId,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.LimitInfo] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }

    return next();

});

//.......................................................................................................................

RestServer.get('/DVP/API/'+version+'/LimitAPI/Schedules/byCompany',authorization({resource:"schedule", action:"read"}),function(req,res,next) {


    var reqId='';
    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }



    try {
        logger.debug('[DVP-LimitHandler.PickSchedulesByCompany] - [%s] - [HTTP]  - Request received   -  Data - Company %s',reqId,Company);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;


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
        logger.error('[DVP-LimitHandler.PickSchedulesByCompany] - [%s] - [HTTP]  - Error when request starts : PickSchedulesByCompany  Company  %s',reqId,Company,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickSchedulesByCompany] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/'+version+'/LimitAPI/Schedule/:id',authorization({resource:"schedule", action:"write"}),function(req,res,next) {


    var reqId='';
    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }


    try {
        logger.debug('[DVP-LimitHandler.DeleteSchedule] - [%s] - [HTTP]  - Request received   -  Data - Company %s ID %s',reqId,Company,req.params.id);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

        schedule.DeleteSchedule(req.params.id,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.DeleteSchedule] - [%s] - ',reqId);

                res.end(jsonString);
            }
            else
            {


                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.DeleteSchedule] - [%s] - Request response : %s ',reqId,jsonString);

                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.DeleteSchedule] - [%s] - [HTTP]  - Error when request starts : DeleteSchedule %s  Company  %s',reqId,req.params.id,Company,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.DeleteSchedule] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/'+version+'/LimitAPI/Appointment/:id',authorization({resource:"appointment", action:"write"}),function(req,res,next) {


    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }


    try {

        logger.debug('[DVP-LimitHandler.DeleteAppointment] - [%s] - [HTTP]  - Request received -  Data -  AppointmentID %s',reqId,req.params.id);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }


        schedule.DeleteAppointment(req.params.id,reqId,function(err,resz)
        {

            if(err)
            {


                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.DeleteAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.DeleteAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {

        logger.error('[DVP-LimitHandler.DeleteAppointment] - [%s] - [HTTP]  - Exception occurred when service started : DeleteAppointment -  Data  ',reqId,req.params.id,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.DeleteAppointment] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/'+version+'/LimitAPI/Appointment/:id',authorization({resource:"appointment", action:"read"}),function(req,res,next) {
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }



    try {
        logger.debug('[DVP-LimitHandler.PickAppointmentById] - [%s] - [HTTP]  - Request received   -  Data - Id %s',reqId,req.params.id);

        if(!req.user.company || !req.user.tenant)
        {
            throw new Error("Invalid company or tenant");
        }

        var Company=req.user.company;
        var Tenant=req.user.tenant;

        schedule.PickAppointment(req.params.id,Company,Tenant,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.PickAppointmentById] - [%s] - Request response : %s ',reqId,"Got");

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
        logger.error('[DVP-LimitHandler.PickAppointmentById] - [%s] - [HTTP]  - Error when request starts : PickAppointmentById  Data - Id %s',reqId,req.params.id,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickAppointmentById] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});



function SetDays(days)
{

    var WeekDays;


    console.log(days.length);

    if(days.length>0)
    {
        for (var i=0;i<days.length;i++)
        {
            if(i==0)
            {
                WeekDays=days[i];
                console.log(WeekDays,i);
            }
            else
            {
                WeekDays=WeekDays+','+days[i];
                console.log(WeekDays,i);
            }

            if(i==days.length-1)
            {
                console.log(WeekDays,i);
                return WeekDays;
            }
        }

    }
    else
    {
        return WeekDays;
    }




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


