/**
 * Created by pawan on 2/23/2015.
 */

var restify = require('restify');
//var sre = require('swagger-restify-express');
var schedule=require('./SheduleApi.js');
//vaup=require('./../DVP-SIPUserEndpointService/SipUserGroupManagement.js');
var limit=require('./LimitApiNew.js');
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var log4js=require('log4js');
var config = require('config');

var port = config.Host.port || 3000;
var version=config.Host.version;
var hpath=config.Host.hostpath;


log4js.configure(config.Host.logfilepath, { cwd: hpath });
var log = log4js.getLogger("app");
fs = require('fs');

var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
},function(req,res)
{

});
//Server listen
RestServer.listen(port, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);

});
//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());




//.......................................post............................................................................
//Done

//log done...............................................................................................................
RestServer.post('/dvp/'+version+'/limit_handler/schedule/add_appointment',function(req,res,next)
{
    log.info("\n.............................................Add appointment Starts....................................................\n");
    try {
        log.info("Inputs : "+req.body);
        schedule.AddAppointment(req,function(err,resz)
        {


            if(err)
            {
                log.error("Error in AddAppointment : "+err);
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(jsonString);
            }
            else if(resz)
            {
                log.info("Appointment saving Succeeded : "+resz);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        log.fatal("Exception found in AddAppointment : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(jsonString);
    }
    return next();
});

//Done
//log done...............................................................................................................
RestServer.post('/dvp/'+version+'/limit_handler/schedule/add_schedule',function(req,res,next)
{
    log.info("\n.............................................Add schedule Starts....................................................\n");
    try {
        log.info("Inputs : "+req.body);
        schedule.AddSchedule(req,function(err,resz)
        {
            if(err)
            {
                log.error("Error in AddSchedule : "+err);
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(jsonString);
            }
            else if(resz)
            {
                log.info("Schedule saving Succeeded : "+resz);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {
        log.fatal("Exception found in AddSchedule : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(jsonString);
    }
    return next();
});
//Done.......................................................................................................................
//log done...............................................................................................................
RestServer.post('/dvp/'+version+'/limit_handler/schedule/Update_Schedule',function(req,res,next)
{
    log.info("\n.............................................Update schedule Starts....................................................\n");

    try {
        log.info("Inputs : "+req.body);
        schedule.UpdateScheduleData(req.body,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Update Schedule : "+err);
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(jsonString);
            }
            else if(resz)
            {
                log.info("Schedule updating Succeeded : "+resz);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(jsonString);
            }
        });


    }
    catch(ex)
    {
        log.fatal("Exception found in Update Schedule : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(jsonString);
    }
    return next();
});
//Done.......................................................................................................................
//log done...............................................................................................................
RestServer.post('/dvp/'+version+'/limit_handler/schedule/update_scheduleID',function(req,res,next)
{
    log.info("\n.............................................Update schedule ID Starts....................................................\n");
    try {
        log.info("Inputs : "+req.body);
        schedule.UpdateScheduleID(req.body,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Update ScheduleID: "+err);
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(jsonString);
            }
            else if(resz)
            {
                log.info("ScheduleID updating Succeeded : "+resz);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(jsonString);
            }
        });


    }
    catch(ex)
    {
        log.fatal("Exception found in Update ScheduleID : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(jsonString);
    }
    return next();
});
//Done.......................................................................................................................
//log done...............................................................................................................
RestServer.post('/dvp/'+version+'/limit_handler/schedule/update_scheduleid_Appointment',function(req,res,next)
{
    log.info("\n.............................................Update scheduleID_Appointment Starts....................................................\n");
    try {
        log.info("Inputs : "+req.body);
        schedule.UpdateScheduleIDAppointment(req.body,function(err,resz)
        {
            if(err)
            {
                log.error("Error in ScheduleID_Appointment mapping : "+err);
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(jsonString);
            }
            else if(resz)
            {
                log.info("ScheduleID_Appointment mapping  Succeeded : "+resz);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(jsonString);
            }
        });


    }
    catch(ex)
    {
        log.fatal("Exception found in ScheduleID_Appointment mapping : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(jsonString);
    }
    return next();
});
//Done.......................................................................................................................
//log done...............................................................................................................
RestServer.post('/dvp/'+version+'/limit_handler/schedule/update_appoinment_data',function(req,res,next)
{
    log.info("\n.............................................Update Appointment Data Starts.................................\n");
    try {
        log.info("Inputs : "+req.body);
        schedule.UpdateAppoinmentData(req.body,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Updating Appointment data  : "+err);
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(jsonString);
            }
            else if(resz)
            {
                log.info("Updating Appointment data Succeeded : "+resz);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {
        log.fatal("Exception found in Updating Appointment data : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(jsonString);
    }
    return next();
});

//Done.......................................................................................................................
//log done...............................................................................................................
RestServer.get('/dvp/'+version+'/limit_handler/limitapi/limit_increment/:key',function(req,res,next)
{
    log.info("\n.............................................Limit Increment Starts.................................\n");
    try {
        console.log("HIT");
        limit.LimitIncrement(req.params.key,function(err,resz)
        {
            log.info("Inputs:- key :"+req.params.key);
            //var jsonString = messageFormatter.FormatMessage(err, "LimitIncrement Succeeded", true, kk);
            if(err)
            {
                log.error("Error in Limit Incrementing  : "+err);
                res.send(resz.toString());
                res.end();
            }else
            {
                log.info("Limit Incrementing Succeeded : "+resz);
                res.send(resz.toString());
                res.end();
            }

        });

    }
    catch(ex)
    {
        log.fatal("Exception found in Limit Incrementing : "+ex);
        res.end(ex);
    }
    return next();
});
//.......................................................................................................................
//Log done...............................................................................................................
RestServer.get('/dvp/'+version+'/limit_handler/limitapi/limit_decrement/:key',function(req,res,next)
{
    log.info("\n.............................................Limit Decrement Starts.................................\n");

    try {
        log.info("Inputs:- key :"+req.params.key);
        limit.LimitDecrement(req.params.key,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Limit Decrementing  : "+err);
                res.send(err.toString());
                res.end();
            }
            else
            {
                log.info("Limit Decrementing Succeeded : "+resz);
                res.send(resz.toString());
                res.end();
            }

        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Limit Decrementing : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "LimitDecrement failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................
//Log done...............................................................................................................
RestServer.post('/dvp/'+version+'/limit_handler/limitapi/add_new_limit_record',function(req,res,next)
{
    log.info("\n.............................................New Limit record adding Starts.................................\n");


    try {
        log.info("Inputs: "+req.body);
        limit.AddNewLimitRecord(req.body,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Adding new Limit record  : "+err);
                res.end(err.toString());
            }
            else
            {
                log.info("Adding new Limit record Succeeded : "+resz);

                res.end(JSON.stringify(resz));
            }
            // var jsonString = messageFormatter.FormatMessage(err, "AddNewLimitRecord succeeded", true, res);

        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Adding new Limit record : "+ex);

        var jsonString = messageFormatter.FormatMessage(ex, "AddNewLimitRecord failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................
//log done
RestServer.post('/dvp/'+version+'/limit_handler/limitapi/update_maxlimit',function(req,res,next)
{
    log.info("\n.............................................Update max limit Starts.................................\n");
    try {
        log.info("Inputs: "+req.body);
        limit.UpdateMaxLimit(req.body,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Update max limit  : "+err);
                var jsonString = messageFormatter.FormatMessage(err, "UpdateMaxLimit failed", false, resz);
                res.end(jsonString);
            }
            else
            {
                log.info("Update max limit Succeeded : "+resz);

                var jsonString = messageFormatter.FormatMessage(err, "UpdateMaxLimit succeeded", true, resz);
                res.end(jsonString);
            }

        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Update max limit : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateMaxLimit failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

//.......................................................................................................................
//log done
RestServer.post('/dvp/'+version+'/limit_handler/limitapi/Update_EnableState',function(req,res,next)
{
    log.info("\n.............................................Update EnableState Starts.................................\n");

    try {
        log.info("Inputs: "+req.body);
        limit.UpdateEnability(req.body,function(err,res)
        {
            if(err)
            {
                log.error("Error in Update EnableState  : "+err);
                var jsonString = messageFormatter.FormatMessage(err, "Update EnableState failed", false, res);
                res.end(jsonString);
            }
            else
            {
                log.info("Update EnableState succeeded : "+resz);
                var jsonString = messageFormatter.FormatMessage(err, "Update EnableState succeeded", true, res);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {
        log.fatal("Exception found in Update EnableState : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Update EnableState failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................


//.......................................get.............................................................................
//log done
RestServer.get('/dvp/'+version+'/limit_handler/schedule/Pick_valid_Appointment',function(req,res,next)
{
    log.info("\n.............................................Pick valid Appointment Starts.................................\n");
    try {
        log.info("Inputs: "+req);
        schedule.FindValidAppoinment(req,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Picking valid Appointment  : "+err);
                res.end(err.toString());
            }
            else
            {
                log.info("Picking valid Appointment succeeded : "+resz);
                res.end(JSON.stringify(resz));
            }
        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Picking valid Appointment  : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "FindValidAppoinment failed", false, res);
        res.end(jsonString);
    }
    return next();

});
//.......................................................................................................................
//log done
RestServer.get('/dvp/'+version+'/limit_handler/schedule/check_availables/:dt/:dy/:tm',function(req,res,next)
{
    log.info("\n.............................................Check available Appointments Starts.................................\n");
    try {
        var obj="";
        var Dt=req.params.dt;
        var Dy=req.params.dy;
        var Tm=req.params.tm;

        log.info("Inputs :- date :  "+Dt+" Day : "+Dy+" Time : "+Tm);

        schedule.CheckAvailables(Dt,Dy,Tm,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Checking available Appointments  : "+err);
                res.end(err.toString());
            }
            else
            {
                log.info("Checking available Appointments succeeded : "+resz);
                res.end(JSON.stringify(resz));

            }
        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Picking valid Appointment  : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "CheckAvailables failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.get('/dvp/'+version+'/limit_handler/schedule/pick_app_through_schedule/:cmp/:tent/:dt/:dy/:tm',function(req,res,next)
{
    log.info("\n.............................................Pick Appointments through Schedule Starts.................................\n");
    try {
        log.info("Inputs :- CompanyID :  "+req.params.cmp+" TenentID : "+req.params.tent+" Date : "+req.params.dt+" Day : "+req.params.dy+" Time : "+req.params.tm);
        schedule.PickAppThroughSchedule(req.params.cmp,req.params.tent,req.params.dt,req.params.dy,req.params.tm,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Picking Appointments through Schedule  : "+err);

                res.end(err);
            }
            else
            {
                log.info("Picking Appointments through Schedule succeeded : "+resz);
                res.end(resz);
            }

        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Picking Appointments through Schedule  : "+ex);
        res.end(ex);
    }
    return next();
});
//.......................................................................................................................

RestServer.get('/dvp/'+version+'/limit_handler/schedule/pick_schedule/:id',function(req,res,next)
{
    log.info("\n.............................................Pick Schedule Starts.................................\n");
    try {
        log.info("Inputs :- "+req.params.id);
        schedule.PickSchedule(req.params.id,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Picking Schedule  : "+err);
                res.end(err.toString());
            }
            else
            {
                log.info("Picking Schedule Succeeded: "+resz);

                res.end(JSON.stringify(resz));
            }

        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Picking Schedule  : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "PickSchedule failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.get('/dvp/'+version+'/limit_handler/schedule/pick_schedule_action/:id',function(req,res,next)
{
    log.info("\n.............................................Pick Schedule Action Starts.................................\n");
    try {
        log.info("Inputs :- "+req.params.id);
        schedule.PickScheduleAction(req.params.id,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Picking Schedule Action  : "+err);
                res.end(resz);
            }
            else
            {
                log.info("Picking Schedule Action Succeeded: "+resz);
                res.end(resz);
            }

        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Picking Schedule Action  : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "PickScheduleAction failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.get('/dvp/'+version+'/limit_handler/schedule/pick_appointment/:id',function(req,res,next)
{
    log.info("\n.............................................Pick Appointment Starts.................................\n");
    try {
        log.info("Inputs :- "+req.params.id);
        schedule.PickApointment(req.params.id,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Picking Appointment  : "+err);
                res.end(err);
            }
            else
            {
                log.info("Picking Appointment  Succeeded: "+resz);
                res.end(resz);
            }

        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Picking Appointment  : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "PickApointment failed", false, res);
        res.end(jsonString);
    }
    return next();

});

//.......................................................................................................................

RestServer.get('/dvp/'+version+'/limit_handler/schedule/pick_apointment_action/:id',function(req,res,next)
{
    log.info("\n.............................................Pick Appointment Action Starts.................................\n");

    try {
        log.info("Inputs : - "+req.body);
        schedule.PickApointmentAction(req.params.id,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Picking Appointment Action  : "+err);
                res.end(err);
            }
            else
            {
                log.info("Picking Appointment Action Succeeded: "+resz);
                res.end(resz);
            }

        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Picking Appointment Action  : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "PickApointmentAction failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................
/*
 RestServer.get('/dvp/:version/limit_handler/schedule/pick_apointment_action',function(req,res,next)
 {
 log.info("\n.............................................Pick Appointment Action Starts.................................\n");

 try {
 schedule.PickApointmentAction(req.body,function(err,res)
 {
 res.end(resz);
 });



 }
 catch(ex)
 {
 var jsonString = messageFormatter.FormatMessage(ex, "PickApointmentAction failed", false, res);
 res.end(jsonString);
 }
 return next();
 });
 */
//.......................................................................................................................




//.......................................................................................................................

RestServer.get('/dvp/'+version+'/limit_handler/limitapi/get_current_limit/:Rid',function(req,res,next)
{
    log.info("\n.............................................Get current limit Starts.................................\n");
    try {
        log.info("Inputs : - "+req.body);

        limit.GetCurrentLimit(req.params.Rid,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Get current limit  : "+err);
                res.end(err);
            }
            else
            {
                log.info("Getting current limit Succeeded: "+resz);
                res.end(resz);
            }

        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Getting current limit  : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "GetCurrentLimit failed", false, res);
        res.end(jsonString);
    }

    return next();

});
//.......................................................................................................................


RestServer.get('/dvp/'+version+'/limit_handler/limitapi/get_max_limit/:Rid',function(req,res,next)
{
    log.info("\n.............................................Get Max limit Starts.................................\n");
    try {
        limit.GetMaxLimit(req.params.Rid,function(err,resz)
        {
            if(err)
            {
                log.error("Error in Get max limit  : "+err);
                res.end(err);
            }
            else
            {
                log.info("Getting max limit Succeeded: "+resz);
                res.end(resz);
            }


        });



    }
    catch(ex)
    {
        log.fatal("Exception found in Getting max limit  : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "GetMaxLimit failed", false, res);
        res.end(jsonString);
    }

    return next();

});


RestServer.post('/dvp/t',function(req,res,next)
{
    log.info("\n.............................................Get Max limit Starts.................................\n");
    try {
        limit.GetObj(0,0);
        res.end();


    }
    catch(ex)
    {
        log.fatal("Exception found in Getting max limit  : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "GetMaxLimit failed", false, res);
        res.end(jsonString);
    }

    return next();

});



RestServer.get('/dvp/uuid',function(req,res,next)
{
   // log.info("\n.............................................Get Max limit Starts.................................\n");
    try {
fs.setheader()
        fs.readFile('/dt/uu', 'utf8', function (err,data) {
            if (err) {
                res.write(err);
                res.end();
            }
            else {
                console.log(data);
                res.write(data);
                res.end();
            }
        });


    }
    catch(ex)
    {
        log.fatal("Exception found in Getting max limit  : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "GetMaxLimit failed", false, res);
        res.end(jsonString);
    }

    return next();

});










/*
 sre.init(RestServer, {
 resourceName : 'LimitHandler',
 server : 'restify', // or express
 httpMethods : ['GET', 'POST', 'PUT', 'DELETE'],
 basePath : 'http://localhost:8081',
 ignorePaths : {
 GET : ['path1', 'path2'],
 POST : ['path1']
 }
 }
 )
 */