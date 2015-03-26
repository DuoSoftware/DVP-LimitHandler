/**
 * Created by pawan on 2/23/2015.
 */

var restify = require('restify');
//var sre = require('swagger-restify-express');
var schedule=require('./SheduleApi.js');
var group=require('./SipUserGroupManagement.js');
var limit=require('./LimitApiNew.js');
var fl=require('./FileHandlerApi.js');
var messageFormatter = require('./DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var CS=require('./CallServerChooser.js');
var RP=require('./RedisPublisher.js');




var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
},function(req,res)
{

});
//Server listen
RestServer.listen(8081, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);

});
//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());

//.......................................post............................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/add_appointment',function(req,res,next)
{

    try {
        schedule.AddAppointment(req,function(err,resz)
        {
            res.end(resz);
        });

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "AddAppointment failed", false, res);
        res.end(jsonString);
    }
    return next();
});


RestServer.post('/dvp/:version/limit_handler/schedule/add_schedule',function(req,res,next)
{

    try {
        schedule.AddSchedule(req,function(err,resz)
        {
            res.end(resz);
        });


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "AddSchedule failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/Update_Schedule',function(req,res,next)
{

    try {
        schedule.UpdateScheduleData(req.body,function(err,resz)
        {
            res.end(resz);
        });


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateScheduleData failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/update_scheduleID',function(req,res,next)
{

    try {
        schedule.UpdateScheduleID(req.body,function(err,resz)
        {
            res.end(resz);
        });


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateScheduleID failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/update_scheduleid_Appointment',function(req,res,next)
{

    try {
        schedule.UpdateScheduleIDAppointment(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateScheduleIDAppointment failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/update_appoinment_data',function(req,res,next)
{

    try {
        schedule.UpdateAppoinmentData(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateAppoinmentData failed", false, res);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/add_sipuser_group',function(req,res,next)
{

    try {
        group.AddSipUserGroup(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "AddSipUserGroup failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/map_extensionid',function(req,res,next)
{

    try {
        group.MapExtensionID(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "MapExtensionID failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/fill_usrgrp',function(req,res,next)
{

    try {
        group.FillUsrGrp(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "FillUsrGrp failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/update_sipuser_group',function(req,res,next)
{

    try {
        group.UpdateSipUserGroup(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateSipUserGroup failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/limit_increment',function(req,res,next)
{

    try {
        limit.LimitIncrement(req.body,function(err,res)
        {
            var jsonString = messageFormatter.FormatMessage(ex, "LimitIncrement Succeeded", true, res);
            res.end(jsonString);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "LimitIncrement failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/limit_decrement',function(req,res,next)
{


    try {
        limit.LimitDecrement(req.body,function(err,res)
        {
            var jsonString = messageFormatter.FormatMessage(ex, "LimitDecrement succeeded", true, res);
            res.end(jsonString);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "LimitDecrement failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/add_new_limit_record',function(req,res,next)
{



    try {
        limit.AddNewLimitRecord(req.body,function(err,res)
        {
            var jsonString = messageFormatter.FormatMessage(ex, "AddNewLimitRecord succeeded", true, res);
            res.end(jsonString);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "AddNewLimitRecord failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/update_maxlimit',function(req,res,next)
{
    try {
        limit.UpdateMaxLimit(req.body,function(err,res)
        {
            var jsonString = messageFormatter.FormatMessage(ex, "UpdateMaxLimit succeeded", true, res);
            res.end(jsonString);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateMaxLimit failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/update_enability',function(req,res,next)
{


    try {
        limit.UpdateEnability(req.body,function(err,res)
        {
            var jsonString = messageFormatter.FormatMessage(ex, "UpdateEnability succeeded", true, res);
            res.end(jsonString);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateEnability failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/filehandler/upload_file',function(req,res,next)
{


    try {
        fl.AddToCouchBase(req.body,function(err,res)
        {
            var jsonString = messageFormatter.FormatMessage(ex, "Upload succeeded", true, res);
            res.end(jsonString);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Upload failed", false, res);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/filehandler/upload_file_remote/:cmp/:ten',function(req,res,next)
{


    try {

        var fileKey = Object.keys(req.files)[0];
        var file = req.files[fileKey];
        console.log(file.path);


        try {
            CS.ProfileTypeCallserverChooser(req.params.cmp,req.params.ten,function(err,resz)
            {
                if(err==null && resz>0)
                {
                    fl.SaveUploadFileDetails(req.params.cmp,req.params.ten,file,function(err,respg)
                    {
                        if(err==null && respg!=null) {


                            RP.RedisPublish(resz,respg);
                            res.end("Success");

                        }
                        else
                        {
                            res.end(-1);
                        }
                    });

                }
                else
                {
                    res.end(-1);
                }


            });



        }
        catch(ex)
        {
            var jsonString = messageFormatter.FormatMessage(ex, "GetMaxLimit failed", false, res);
            res.end(jsonString);
        }





    }
    catch(ex)
    {
        //var jsonString = messageFormatter.FormatMessage(ex, "Upload failed", false, res);
       // res.end(jsonString);
        var jsonString = messageFormatter.FormatMessage(ex, "Upload not succeeded:exception found", false, null);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/filehandler/Download_file_remote',function(req,res,next)
{


    try {

        fl.downF();
        res.end();

    }
    catch(ex)
    {

        var jsonString = messageFormatter.FormatMessage(ex, "Upload not succeeded:exception found", false, null);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................


RestServer.get('/dvp/:version/limit_handler/filehandler/download_file/:id',function(req,res,next)
{
    try {

        fl.DownloadFileByID(res,req.params.id,function(err,resz)
        {

        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetMaxLimit failed", false, res);
        res.end(jsonString);
    }

    return next();

});

//.......................................................................................................................


RestServer.post('/dvp/:version/limit_handler/filehandler/Profile_TypeCallserver_Chooser',function(req,res,next)
{
    try {
        CS.ProfileTypeCallserverChooser(req,function(err,resz)
        {
            if(err==null)
            {

                res.end(resz);
            }


        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetMaxLimit failed", false, res);
        res.end(jsonString);
    }

    return next();

});

//.......................................get.............................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/find_valid_appoinment/:app',function(req,res,next)
{

    try {
        schedule.FindValidAppoinment(req.params.app,res,err);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "FindValidAppoinment failed", false, res);
        res.end(jsonString);
    }
    return next();

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/check_availables/:dt/:dy/:tm',function(req,res,next)
{

    try {
        var obj="";
         var Dt=req.params.dt;
        var Dy=req.params.dy;
        var Tm=req.params.tm;


        schedule.CheckAvailables(Dt,Dy,Tm,res);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "CheckAvailables failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_app_through_schedule/:cmp/:tent/:dt/:dy/:tm',function(req,res,next)
{

    try {
        schedule.PickAppThroughSchedule(req.params.cmp,req.params.tent,req.params.dt,req.params.dy,req.params.tm,function(err,resz)
        {
            res.end(resz);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "PickAppThroughSchedule failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_schedule',function(req,res,next)
{

    try {
        schedule.PickSchedule(req.body,function(err,resz)
        {
            res.end(resz);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "PickSchedule failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_schedule_action',function(req,res,next)
{

    try {
        schedule.PickScheduleAction(req.body,function(err,res)
        {
            res.end(resz);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "PickScheduleAction failed", false, res);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_apointment',function(req,res,next)
{

    try {
        schedule.PickApointment(req.body,function(err,res)
        {
            res.end(resz);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "PickApointment failed", false, res);
        res.end(jsonString);
    }
    return next();

});

//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_apointment_action',function(req,res,next)
{

    try {
        schedule.PickApointmentAction(req.body,function(err,resz)
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
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_apointment_action',function(req,res,next)
{


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
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/get_group_data/:name',function(req,res,next)
{

    try {
        group.GetGroupData(req.params.name,function(err,resz)
        {
            res.end(resz);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetGroupData failed", false, res);
        res.end(jsonString);
        return next();
    }

    return next();


});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/get_group_endpoints',function(req,res,next)
{

    try {
        group.GetGroupEndpoints(req.params.name,function(err,resz)
        {
            res.end(resz);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetGroupEndpoints failed", false, res);
        res.end(jsonString);

    }
    return next();
});

//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/endpoint_groupid',function(req,res,next)
{



    try {
        group.EndpointGroupID(req.body,function(err,resz)
        {
            res.end(resz);
        });




    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "EndpointGroupID failed", false, res);
        res.end(jsonString);

    }
    return next();
});

//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/AllRecWithCompany/:CompanyId',function(req,res,next)
{


    try {
        group.AllRecWithCompany(req.params.CompanyId,function(err,resz)
        {
            res.end(resz);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "AllRecWithCompany failed", false, res);
        res.end(jsonString);

    }

    return next();

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/get_all_users_in_group/:companyid',function(req,res,next)
{


    try {
        group.GetAllUsersInGroup(req.params.companyid, function(err,resz)
        {
            res.end(resz);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetAllUsersInGroup failed", false, res);
        res.end(jsonString);

    }

    return next();

});
//.......................................................................................................................
RestServer.get('/dvp/:version/limit_handler/testme/:id',function(req,res,next)
{

    try {
        group.Testme(req.params.id,function(err,res)
        {
            res.end(resz);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Testme failed", false, res);
        res.end(jsonString);

    }

    return next();

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/limitapi/get_current_limit',function(req,res,next)
{
    try {
        limit.GetCurrentLimit(req.body,function(err,resz)

        {
           res.end(resz);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetCurrentLimit failed", false, res);
        res.end(jsonString);
    }

    return next();

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/limitapi/get_max_limit',function(req,res,next)
{
    try {
        limit.GetMaxLimit(req.body,function(err,resz)
        {

            res.end(resz);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetMaxLimit failed", false, res);
        res.end(jsonString);
    }

    return next();

});

RestServer.get('/dvp/:version/limit_handler/filehandler/get_file_meta/:id',function(req,res,next)
{
    try {
        fl.GetAttachmentMetaDataByID(req.params.id,function(err,resz)
        {

            res.end(resz);
        });



    }
    catch(ex)
    {
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