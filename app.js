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
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/limit_increment',function(req,res,err)
{
    limit.LimitIncrementt(req.body,function(err,res)
    {

    });

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/limit_decrement',function(req,res,err)
{
    limit.LimitDecrement(req.body,function(err,res)
    {

    });

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/add_new_limit_record',function(req,res,err)
{
    limit.AddNewLimitRecord(req.body,function(err,res)
    {

    });

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/update_maxlimit',function(req,res,err)
{
    limit.UpdateMaxLimit(req.body,function(err,res)
    {

    });

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/update_maxlimit',function(req,res,err)
{
    limit.UpdateMaxLimit(req.body,function(err,res)
    {

    });

});
//.......................................................................................................................

RestServer.post('/dvp/:version/limit_handler/limitapi/update_enability',function(req,res,err)
{
    limit.UpdateEnability(req.body,function(err,res)
    {

    });

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

        group.GetAllUsersInGroup(req.params.companyid, res, err);



});
//.......................................................................................................................
RestServer.get('/dvp/:version/limit_handler/testme/:id',function(req,res,err)
{
group.Testme(req.params.id,res,err);



});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/limitapi/get_current_limit',function(req,res,err)
{
    limit.GetCurrentLimit(req.body,function(err,res)
    {

    });

});
//.......................................................................................................................

RestServer.get('/dvp/:version/limit_handler/limitapi/get_max_limit',function(req,res,err)
{
    limit.GetMaxLimit(req.body,function(err,res)
    {

    });

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