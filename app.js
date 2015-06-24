/**
 * Created by pawan on 2/23/2015.
 */

var restify = require('restify');
var schedule=require('./SheduleApi.js');
var limit=require('./LimitApiNew.js');
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var log4js=require('log4js');
var config = require('config');

var port = config.Host.port || 3000;
var version=config.Host.version;
var hpath=config.Host.hostpath;
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var uuid = require('node-uuid');
var cors = require('cors');



log4js.configure(config.Host.logfilepath, { cwd: hpath });
var log = log4js.getLogger("app");
fs = require('fs');

var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
},function(req,res)
{

});
RestServer.use(cors());
//Server listen
RestServer.listen(port, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);

});
//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());




//.......................................post............................................................................

//RestServer.post('/dvp/'+version+'/limit_handler/schedule/add_appointment',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/LimitHandler/ScheduleApi/Appointment',function(req,res,next)
{
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {

        logger.debug('[DVP-LimitHandler.NewAppointment] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,JSON.stringify(req.body));
        schedule.AddAppointment(req,reqId,function(err,resz)
        {

            if(err)
            {


                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.NewAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.NewAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {

        logger.error('[DVP-LimitHandler.NewAppointment] - [%s] - [HTTP]  - Exception occurred when service started : NewAppointment -  Data - %s ',reqId,JSON.stringify(req.body),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.NewAppointment] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

//RestServer.post('/dvp/'+version+'/limit_handler/schedule/add_schedule',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/LimitHandler/ScheduleApi/Schedule',function(req,res,next)
{
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }


    try {

        logger.debug('[DVP-LimitHandler.NewSchedule] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,JSON.stringify(req.body));
        schedule.AddSchedule(req,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.NewSchedule] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.NewSchedule] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {
        //log.fatal("Exception found in AddSchedule : "+ex);
        logger.error('[DVP-LimitHandler.NewAppointment] - [%s] - [HTTP]  - Exception occurred when service started : NewSchedule -  Data - %s ',reqId,JSON.stringify(req.body),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.NewSchedule] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

//RestServer.post('/dvp/'+version+'/limit_handler/schedule/Update_Schedule',function(req,res,next)

RestServer.post('/DVP/API/'+version+'/LimitHandler/ScheduleApi/UpdateSchedule/:id',function(req,res,next)
{
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {

        var ID=parseInt(req.params.id);
        logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] - [HTTP]  - Request received -  Data - id %s Other %s ',reqId,req.params.id,JSON.stringify(req.body));
        schedule.UpdateScheduleData(ID,req.body,reqId,function(err,resz)
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

//RestServer.post('/dvp/'+version+'/limit_handler/schedule/update_scheduleID',function(req,res,next)

RestServer.post('/DVP/API/'+version+'/LimitHandler/ScheduleApi/ScheduleId/:SID/ToAppointment/:AID',function(req,res,next)
{

    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {
        logger.debug('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - [HTTP]  - Request received -  Data - Schedule %d Appointment %d ',reqId,req.params.SID,req.params.AID);
        schedule.UpdateScheduleIDAppointment(parseInt(req.params.SID),parseInt(req.params.AID),reqId,function(err,resz)
        {
            if(err)
            {


                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
        });


    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - [HTTP]  - Exception occurred when service started : UpdateSceduleId -  Data - Schedule %s Appointment %s ',reqId,req.params.SID,req.params.AID,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false,undefined);
        logger.debug('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    next();
});
//RestServer.post('/dvp/'+version+'/limit_handler/schedule/update_appoinment_data',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/LimitHandler/ScheduleApi/Appointment/:id',function(req,res,next)
{
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
        schedule.UpdateAppointmentData(req.params.id,req.body,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(JSON.stringify(err), "ERROR/EXCEPTION", false, undefined);
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

        logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] - [HTTP]  - Exception occurred when service started : UpdateAppointmentData -  Appointment %s Data %s',reqId,req.params.AID,JSON.stringify(req.body),ex);

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});


//RestServer.get('/dvp/'+version+'/limit_handler/limitapi/limit_increment/:key',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/LimitHandler/LimitApi/LimitIncrement/:key',function(req,res,next)
{

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

//RestServer.get('/dvp/'+version+'/limit_handler/limitapi/limit_decrement/:key',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/LimitHandler/LimitApi/LimitDecrement/:key',function(req,res,next)
{
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

//RestServer.post('/dvp/'+version+'/limit_handler/limitapi/add_new_limit_record',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/LimitHandler/LimitApi/LimitRecord',function(req,res,next)
{
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }
    try {
        logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,JSON.stringify(req.body));


        limit.AddNewLimitRecord(req.body,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {


                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] - Request response : ',reqId,jsonString);
                res.end(jsonString);
            }


        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.NewLimitRecord] - [%s] - [HTTP]  - Exception occurred while requesting method : NewLimitRecord  -  Data - %s ',reqId,req.params.key,ex);

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.NewLimitRecord] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});

//RestServer.post('/dvp/'+version+'/limit_handler/limitapi/update_maxlimit',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/LimitHandler/LimitApi/LimitMax/:LID',function(req,res,next)
{
    var reqId='';

    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }
    try {
        logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] - [HTTP]  - Request received -  Data - LimitId %s others %s ',reqId,req.params.LID,JSON.stringify(req.body));


        limit.UpdateMaxLimit(req.params.LID,req.body,reqId,function(err,resz)
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

        logger.error('[DVP-LimitHandler.LimitDecrement] - [%s] - [HTTP]  - Exception occurred while requesting method : UpdateMaxLimit  -  Data - LimitId %s others %s ',reqId,req.params.LID,JSON.stringify(req.body),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.UpdateMaxLimit] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});


//RestServer.post('/dvp/'+version+'/limit_handler/limitapi/Update_EnableState',function(req,res,next)

RestServer.post('/DVP/API/'+version+'/LimitHandler/LimitApi/EnableState/:LID',function(req,res,next)
{


    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {
        logger.debug('[DVP-LimitHandler.UpdateEnableState] - [%s] - [HTTP]  - Request received -  Data - Limit ID %s others %s',reqId,req.params.LID,JSON.stringify(req.body));
        limit.UpdateEnability(req.params.LID,req.body,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.UpdateEnableState] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.UpdateEnableState] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.UpdateEnableState] - [%s] - [HTTP]  - Exception occurred whe startiong request : UpdateEnableState -  Data - Limit ID %s others %s',reqId,req.params.LID,JSON.stringify(req.body),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.UpdateEnableState] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();
});



//.......................................get.............................................................................

//RestServer.get('/dvp/'+version+'/limit_handler/schedule/Pick_valid_Appointment',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/LimitHandler/ScheduleApi/ValidAppointment/:ScheduleID',function(req,res,next)
{
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    try {
        logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - [HTTP]  - Request received -  Data - %s ',reqId,JSON.stringify(req.body));


        schedule.FindValidAppointment(req.params.ScheduleID,reqId,function(err,resz)
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
        logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [HTTP]  - Exception occurred when requesting : PickValidAppointment -  Data - %s ',reqId,JSON.stringify(req.body),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }
    return next();

});

//RestServer.get('/dvp/'+version+'/limit_handler/schedule/check_availables/:dt/:dy/:tm',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/LimitHandler/ScheduleApi/CheckAvailablesFor/:dt/:tm',function(req,res,next)
{
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
        logger.debug('[DVP-LimitHandler.CheckAvailables] - [%s] - [HTTP]  - Request received   -  Data - Date %s  Day %s Time %s',reqId,req.params.dt,req.params.dy,req.params.tm);
        var Dt=req.params.dt;
        var Tm=req.params.tm;
        var Cmp=1;
        var Ten=1;



        schedule.CheckAvailables(Dt,Tm,Cmp,Ten,reqId,function(err,resz)
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

//RestServer.get('/dvp/'+version+'/limit_handler/schedule/pick_app_through_schedule/:cmp/:tent/:dt/:dy/:tm',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/LimitHandler/ScheduleApi/ApplicationThroughSchedule/:dt/:tm/:sid',function(req,res,next)

{
    var reqId='';


    try
    {
        reqId = uuid.v1();
    }
    catch(ex)
    {

    }

    var cmp=1;
    var tent=1;

    try {
        logger.debug('[DVP-LimitHandler.PickApplicationThroughSchedule] - [%s] - [HTTP]  - Request received   -  Data - Date %s  Day %s Time %s Company %s Tenant %s',reqId,req.params.dt,req.params.dy,req.params.tm,req.params.cmp,req.params.tent);

        //log.info("Inputs :- CompanyID :  "+req.params.cmp+" TenentID : "+req.params.tent+" Date : "+req.params.dt+" Day : "+req.params.dy+" Time : "+req.params.tm);
        schedule.PickAppThroughSchedule(cmp,tent,req.params.dt,req.params.tm,req.params.sid,reqId,function(err,resz)
        {
            if(err)
            {


                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-LimitHandler.PickApplicationThroughSchedule] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }
            else
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-LimitHandler.PickApplicationThroughSchedule] - [%s] - Request response : %s ',reqId,jsonString);
                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickApplicationThroughSchedule] - [%s] - [HTTP]  - Exception occurred when starting : PickAppThroughSchedule   -  Data - Date %s  Day %s Time %s Company %s Tenant %s',reqId,req.params.dt,req.params.dy,req.params.tm,req.params.cmp,req.params.tent,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.PickApplicationThroughSchedule] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);

    }
    return next();
});
//.......................................................................................................................

//RestServer.get('/dvp/'+version+'/limit_handler/schedule/pick_schedule/:id',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/LimitHandler/ScheduleApi/Schedule/:id',function(req,res,next)
{
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



        schedule.PickSchedule(req.params.id,reqId,function(err,resz)
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


//RestServer.get('/dvp/'+version+'/limit_handler/schedule/pick_schedule_action/:id',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/LimitHandler/ScheduleApi/ScheduleAction/:id',function(req,res,next)
{
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


        schedule.PickScheduleAction(req.params.id,reqId,function(err,resz)
        {
            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                res.end(err);
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

//RestServer.get('/dvp/'+version+'/limit_handler/schedule/pick_appointment/:id',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/LimitHandler/ScheduleApi/Appointment/:id',function(req,res,next)
{
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


        schedule.PickApointment(req.params.id,reqId,function(err,resz)
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

//.......................................................................................................................

//RestServer.get('/dvp/'+version+'/limit_handler/schedule/pick_apointment_action/:id',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/LimitHandler/ScheduleApi/AppointmentAction/:id',function(req,res,next)
{
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


        schedule.PickApointmentAction(req.params.id,reqId,function(err,resz)
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


//RestServer.get('/dvp/'+version+'/limit_handler/limitapi/get_current_limit/:Rid',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/LimitHandler/LimitApi/CurrentLimit/:Rid',function(req,res,next)
{
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
        logger.error('[DVP-LimitHandler.CurrentLimit] - [%s] - [HTTP]  - Exception occurred on request : CurrentLimit   -  Data - Id %s',reqId,req.params.id,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-LimitHandler.CurrentLimit] - [%s] - Request response : %s ',reqId,jsonString);
        res.end(jsonString);
    }

    return next();

});



//RestServer.get('/dvp/'+version+'/limit_handler/limitapi/get_max_limit/:Rid',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/LimitHandler/LimitApi/MaxLimit/:Rid',function(req,res,next)
{
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









