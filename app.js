/**
 * Created by pawan on 2/23/2015.
 */

var restify = require('restify');
//var sre = require('swagger-restify-express');
var schedule=require('./SheduleApi.js');
var group=require('./SipUserGroupManagement.js');
var limit=require('./LimitApiNew.js');



var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
},function(req,res)
{

});
//Server listen
RestServer.listen(8081, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);
/*
    for(i=1; i <=20000; i++)
    {
        var body1 = {
            SipUsername: 'usr'+i,
            Password: 'pwd'+i,
            Enabled: true,
            ExtraData: 'extra'+i,
            EmailAddress: 'a@'+i,
            GuRefId: 'ref'+i,
            CompanyId: 1,
            TenantId: 3,
            ObjClass: 'clz'+i,
            ObjType: 'typ'+i,
            ObjCategory: 'cat'+i,
            AddUser: 'usr'+i,
            UpdateUser: 'updusr'+i
        }

        var tt = {
            body : body1
        }

        var dd = {
            end : function()
            {}
        }


       usr.SaveSip(tt,dd,err);
        //group.AddSipUserGroup(i,resz);

        var grpId = 1;
        if(i%2 == 1)
        {
            grpId = 2;
        }

        var r = {
            ExtensionId : i,
            GroupId : grpId
        }
        gruop.MapExtensionID(r, rese);
    }
    */
});
//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());






//.......................................post............................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/add_schedule',function(req,res,err)
{

    try {
        schedule.AddSchedule(req,res,err);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "AddSchedule failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/Update_Schedule',function(req,res,err)
{

    try {
        schedule.UpdateScheduleData(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateScheduleData failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/update_scheduleID',function(req,res,err)
{

    try {
        schedule.UpdateScheduleID(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateScheduleID failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/update_scheduleid_Appointment',function(req,res,err)
{

    try {
        schedule.UpdateScheduleIDAppointment(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateScheduleIDAppointment failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/update_appoinment_data',function(req,res,err)
{

    try {
        schedule.UpdateAppoinmentData(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateAppoinmentData failed", false, res);
        res.end(jsonString);
    }

});

//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/add_sipuser_group',function(req,res,err)
{

    try {
        group.AddSipUserGroup(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "AddSipUserGroup failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/map_extensionid',function(req,res,err)
{

    try {
        group.MapExtensionID(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "MapExtensionID failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/fill_usrgrp',function(req,res,err)
{

    try {
        group.FillUsrGrp(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "FillUsrGrp failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/update_sipuser_group',function(req,res,err)
{

    try {
        group.UpdateSipUserGroup(req.body,res);


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "UpdateSipUserGroup failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/limit_increment',function(req,res,err)
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

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/limit_decrement',function(req,res,err)
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

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/add_new_limit_record',function(req,res,err)
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

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/update_maxlimit',function(req,res,err)
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

});
//.......................................................................................................................

//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/update_enability',function(req,res,err)
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

});


//.......................................get.............................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/find_valid_appoinment/:app',function(req,res,err)
{

    try {
        schedule.FindValidAppoinment(req.params.app,res,err);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "FindValidAppoinment failed", false, res);
        res.end(jsonString);
    }


});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/check_availables',function(req,res,err)
{

    try {
        schedule.CheckAvailables(req.body,res);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "CheckAvailables failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_app_through_schedule',function(req,res,err)
{

    try {
        schedule.PickAppThroughSchedule(req.body,res);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "PickAppThroughSchedule failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_schedule',function(req,res,err)
{

    try {
        schedule.PickSchedule(req.body,res);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "PickSchedule failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_schedule_action',function(req,res,err)
{

    try {
        schedule.PickScheduleAction(req.body,res);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "PickScheduleAction failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_apointment',function(req,res,err)
{

    try {
        schedule.PickApointment(req.body,res);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "PickApointment failed", false, res);
        res.end(jsonString);
    }


});

//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_apointment_action',function(req,res,err)
{

    try {
        schedule.PickApointmentAction(req.body,res);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "PickApointmentAction failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_apointment_action',function(req,res,err)
{


    try {
        schedule.PickApointmentAction(req.body,res);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "PickApointmentAction failed", false, res);
        res.end(jsonString);
    }

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/get_group_data/:name',function(req,res,err)
{

    try {
        group.GetGroupData(req.params.name,res);
        return next();


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetGroupData failed", false, res);
        res.end(jsonString);
        return next();
    }




});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/get_group_endpoints',function(req,res,err)
{

    try {
        group.GetGroupEndpoints(req.params.name,res);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetGroupEndpoints failed", false, res);
        res.end(jsonString);

    }

});

//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/endpoint_groupid',function(req,res,err)
{



    try {
        group.EndpointGroupID(req.body,res);
        return next();



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "EndpointGroupID failed", false, res);
        res.end(jsonString);

    }
});

//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/AllRecWithCompany/:CompanyId',function(req,res,err)
{


    try {
        group.AllRecWithCompany(req.params.CompanyId,res,err);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "AllRecWithCompany failed", false, res);
        res.end(jsonString);

    }



});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/get_all_users_in_group/:companyid',function(req,res,err)
{


    try {
        group.GetAllUsersInGroup(req.params.companyid, res, err);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetAllUsersInGroup failed", false, res);
        res.end(jsonString);

    }



});
//.......................................................................................................................
RestServer.get('/dvp/:version/limit_handler/testme/:id',function(req,res,err)
{

    try {
        group.Testme(req.params.id,res,err);



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Testme failed", false, res);
        res.end(jsonString);

    }



});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/limitapi/get_current_limit',function(req,res,err)
{
    try {
        limit.GetCurrentLimit(req.body,function(err,res)
        {
            var jsonString = messageFormatter.FormatMessage(ex, "GetCurrentLimit succeeded", true, res);
            res.end(jsonString);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetCurrentLimit failed", false, res);
        res.end(jsonString);
    }



});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/limitapi/get_max_limit',function(req,res,err)
{
    try {
        limit.GetMaxLimit(req.body,function(err,res)
        {
            var jsonString = messageFormatter.FormatMessage(ex, "GetMaxLimit succeeded", true, res);
            res.end(jsonString);
        });



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "GetMaxLimit failed", false, res);
        res.end(jsonString);
    }



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