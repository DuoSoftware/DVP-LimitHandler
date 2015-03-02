/**
 * Created by pawan on 2/23/2015.
 */

var restify = require('restify');
var sre = require('swagger-restify-express');
var schedule=require('./SheduleApi.js');
var group=require('./SipUserGroupManagement.js');

var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
},function(req,res)
{

});
//Server listen
RestServer.listen(8080, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);
});
//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());


//.......................................post............................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/add_schedule',function(req,res,err)
{
    schedule.AddSchedule(req,res,err);

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/Update_Schedule',function(req,res,err)
{
    schedule.UpdateScheduleData(req.body,res);

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/update_scheduleID',function(req,res,err)
{
    schedule.UpdateScheduleID(req.body,res);

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/update_scheduleid_Appointment',function(req,res,err)
{
    schedule.UpdateScheduleIDAppointment(req.body,res);

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/schedule/update_appoinment_data',function(req,res,err)
{
    schedule.UpdateAppoinmentData(req.body,res);

});

//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/add_sipuser_group',function(req,res,err)
{
    group.AddSipUserGroup(req.body,res);

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/map_extensionid',function(req,res,err)
{
    group.MapExtensionID(req.body,res);

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/fill_usrgrp',function(req,res,err)
{
    group.FillUsrGrp(req.body,res);

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/sipuser_group/update_sipuser_group',function(req,res,err)
{
    group.UpdateSipUserGroup(req.body,res);

});

//.......................................get.............................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/find_valid_appoinment/:app',function(req,res,err)
{
    schedule.FindValidAppoinment(req.params.app,res,err);

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/check_availables',function(req,res,err)
{
    schedule.CheckAvailables(req.body,res);

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_app_through_schedule',function(req,res,err)
{
    schedule.PickAppThroughSchedule(req.body,res);

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_schedule',function(req,res,err)
{
    schedule.PickSchedule(req.body,res);

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_schedule_action',function(req,res,err)
{
    schedule.PickScheduleAction(req.body,res);

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_apointment',function(req,res,err)
{
    schedule.PickApointment(req.body,res);

});

//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_apointment_action',function(req,res,err)
{
    schedule.PickApointmentAction(req.body,res);

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/schedule/pick_apointment_action',function(req,res,err)
{
    schedule.PickApointmentAction(req.body,res);

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/get_group_data/:name',function(req,res,err)
{
    group.GetGroupData(req.params.name,res);
    return next();


});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/get_group_endpoints',function(req,res,err)
{
    group.GetGroupEndpoints(req.body,res);

});

//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/endpoint_groupid',function(req,res,err)
{
    group.EndpointGroupID(req.body,res);
return next();
});

//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/AllRecWithCompany/:CompanyId',function(req,res,err)
{
    group.AllRecWithCompany(req.params.CompanyId,res,err);



});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/sipuser_group/get_all_users_in_group/:companyid',function(req,res,err)
{
    group.GetAllUsersInGroup(req.params.companyid,res,err);



});





sre.init(RestServer, {
        resourceName : 'LimitHandler',
        server : 'restify', // or express
        httpMethods : ['GET', 'POST', 'PUT', 'DELETE'],
        basePath : 'http://localhost:8080',
        ignorePaths : {
            GET : ['path1', 'path2'],
            POST : ['path1']
        }
    }
)