
/**
 * Created by pawan on 2/12/2015.
 */


var DbConn = require('DVP-DBModels');
var restify = require('restify');
var sre = require('swagger-restify-express');
/*var context=require('./SIPUserEndpointService.js');
 var UACCreate=require('./CreateSipUACrec.js');
 var Extmgt=require('./ExtensionManagementAPI.js');
 var UACUpdate=require('./UpdateSipUserData.js');
 */
var stringify=require('stringify');
var moment=require('moment');
var dateutil=require('date-utils');
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var log4js=require('log4js');
var config = require('config');
var hpath=config.Host.hostpath;


log4js.configure(hpath+'config/log4js_config.json', { cwd: './logs' });
var log = log4js.getLogger("shdlapi");


/*
 var RestServer = restify.createServer({
 name: "myapp",
 version: '1.0.0'
 },function(req,res)
 {

 });
 //Server listen
 RestServer.listen(8080, function () {
 console.log('%s listening at %s', RestServer.name, RestServer.url);
 //console.log(moment().format('dddd'));


 });

 RestServer.use(restify.bodyParser());
 RestServer.use(restify.acceptParser(RestServer.acceptable));
 RestServer.use(restify.queryParser());


 */


/*
 function CheckAvailabilityDays(req,res,err)
 {
 DbConn.Schedule
 .find({where : {id:2},
 attributes:['Days']}
 )
 .complete(function(err, result) {
 if (!!err) {
 console.log('An error occurred while searching for Extension:', err);
 //logger.info( 'Error found in searching : '+err );

 } else if (!result) {
 console.log('No user with the Extension has been found.');
 ///logger.info( 'No user found for the requirement. ' );
 try
 {

 //DbSave.SaveNewSipUser(jobj.Context,jobj.Description,1,2,jobj.ObjClass,jobj.ObjType,jobj.ObjCategory,"AddUser1","UpdateUSer1",new Date(2015,01,12),new Date(2015,01,26),SaveSt);

 //call external save function, params = Json object and callback function

 console.log('................................. New SIP User is creating ..................................');

 //SaveUACRec(obj,SaveSt);

 }
 catch(ex)
 {
 console.log("An error occurred in data saving process ");
 //  logger.info( 'Error found in saving process ' );

 }

 } else {

 var days=result.Days;

 var DaysArray=days.split(",");
 //  var str = "123, 124, 234,252";
 //var arr = str.split(",").map(function (val) { return +val + 1; });

 var dt=moment(moment()).format('dddd');
 console.log('Today is :' +dt);

 if(DaysArray.indexOf(dt) > -1)
 {
 console.log('Today is a valid day...');
 }
 else
 {
 console.log('Today is  not a valid day...');
 }

 // console.log(dt);
 res.end();

 }
 });
 }



 function CheckAvailabilityDate(req,res,err)
 {
 /* DbConn.Schedule
 .find({where : {id:2},
 attributes:['St_Dt','Ed_Dt']}
 )
 .complete(function(err, result) {
 if (!!err) {
 console.log('An error occurred while searching for Extension:', err);
 //logger.info( 'Error found in searching : '+err );

 } else if (!result) {
 console.log('No user with the Extension has been found.');
 ///logger.info( 'No user found for the requirement. ' );
 try
 {

 //DbSave.SaveNewSipUser(jobj.Context,jobj.Description,1,2,jobj.ObjClass,jobj.ObjType,jobj.ObjCategory,"AddUser1","UpdateUSer1",new Date(2015,01,12),new Date(2015,01,26),SaveSt);

 //call external save function, params = Json object and callback function

 console.log('................................. New SIP User is creating ..................................');

 //SaveUACRec(obj,SaveSt);

 }
 catch(ex)
 {
 console.log("An error occurred in data saving process ");
 //  logger.info( 'Error found in saving process ' );

 }

 } else {
 if(result.St_Dt == null || result.Ed_Dt==null)
 {
 console.log('Null found');
 }
 else
 {
 var x = moment(moment()).isBetween(result.St_Dt, result.Ed_Dt);

 if (x) {
 console.log('Valid date : ' + x);
 }
 else {
 console.log('Invalid date : ' + x);
 }

 res.end();
 }
 }

 });








 }
 */

/*
 function CheckAvailabilityTime(req,res,err)
 {
 DbConn.Schedule
 .findAll({where : {St_Dt:'2014-12-31'},
 attributes:['St_tm','Ed_tm']}
 )
 .complete(function(err, result) {
 if (!!err) {
 console.log('An error occurred while searching for Extension:', err);
 //logger.info( 'Error found in searching : '+err );

 } else if (!result) {
 console.log('No user with the Extension has been found.');
 ///logger.info( 'No user found for the requirement. ' );
 try
 {

 //DbSave.SaveNewSipUser(jobj.Context,jobj.Description,1,2,jobj.ObjClass,jobj.ObjType,jobj.ObjCategory,"AddUser1","UpdateUSer1",new Date(2015,01,12),new Date(2015,01,26),SaveSt);

 //call external save function, params = Json object and callback function

 console.log('................................. New SIP User is creating ..................................');

 //SaveUACRec(obj,SaveSt);

 }
 catch(ex)
 {
 console.log("An error occurred in data saving process ");
 //  logger.info( 'Error found in saving process ' );

 }

 } else {

 for(var index in result){

 var dblCTm=moment().format("HH.mm");
 var dblStTm=result[index].St_tm;
 var dblEdTm=result[index].Ed_tm;



 if(dblCTm>=dblStTm && dblCTm<dblEdTm)
 {
 console.log('Now time is '+dblCTm);
 console.log('Strat time is '+dblStTm);
 console.log('End time is '+dblEdTm);

 break;
 }
 }


 }

 });



 }

 */

/*
 RestServer.post('/addschedule',function(req,res,err)
 {

 //FindValidAppoinment(req,res,err);
 // var dataz=req.body;
 //CheckAvailables(dataz);
 // AddSchedule(req,res,err);
 //PickAppThroughSchedule(req.body);

 PicApointment(req.body);







 });
 */


//post :- done
log.info("\n.............................................ScheduleApi Starts....................................................\n");
function AddSchedule(req,callback)
{
    log.info("\n.............................................AddSchedule Starts....................................................\n");

    try{
        var obj=req.body;
        log.info("Inputs :-  "+req.body);
    }
    catch(ex)
    {
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in object creating from req body", false, req);
        log.fatal("Exception on creating object from req.body "+ex);
        callback(ex,undefined);
    }

    try {
        DbConn.Schedule.find({where: [{id: obj.ScheduleName}]}).complete(function (err, ScheduleObject) {

            if (err) {
                log.error("Error in searching schedule : " + obj.id + " , Error : " + err);
                callback(err, undefined);
            }

            else
            {
                if (!ScheduleObject) {
                    // console.log(cloudEndObject);
                    log.info("No record found for given id : "+obj.id);
                    try {
                        var NewScheduleObject = DbConn.Schedule
                            .build(
                            {
                                ScheduleName: obj.ScheduleName,
                                Action: obj.Action,
                                ExtraData: obj.ExtraData,
                                ObjClass: obj.ObjClass,
                                ObjType: obj.ObjType,
                                ObjCategory: obj.ObjCategory,
                                CompanyId: obj.CompanyId,
                                TenantId: obj.TenantId
                                // AddTime: new Date(2009, 10, 11),
                                //  UpdateTime: new Date(2009, 10, 12),
                                // CSDBCloudEndUserId: jobj.CSDBCloudEndUserId


                            }
                        )
                    }
                    catch (ex) {
                        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in building appointment objecty", false, req);
                        log.fatal("Exception in creating New Schedule object : "+ex);
                        callback(ex, undefined);
                    }

                    NewScheduleObject.save().complete(function (err, result) {
                        if (!err) {
                            var status = 1;
                            log.info("Saving Succeeded : "+JSON.stringify(NewScheduleObject));
                            console.log("..................... Saved Successfully ....................................");
                            //  var jsonString = messageFormatter.FormatMessage(err, "AppObject saved successfully ", true, result);
                            callback(undefined, result);

                        }
                        else {
                            log.error("Error in Saving : "+err);
                            console.log("..................... Error found in saving.................................... : " + err);
                            //var jsonString = messageFormatter.FormatMessage(err, "AppObject saving error", false, result);
                            callback(err, undefined);

                        }


                    });


                }
                else  {
                    log.error("Record is already in db");
                    console.log("................................... Given Cloud End User is invalid ................................ ");
                    //var jsonString = messageFormatter.FormatMessage(null, "null object returned as shedule search result for : "+obj.CSDBScheduleId, false, ScheduleObject);
                    callback(new Error('Already in DB'), undefined);
                }
            }
            //  return next();
        });
    }
    catch(ex)
    {
        log.fatal("Exception "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching Schedule ", false, null);
        callback(ex,undefined);
    }



}
//post :- done
function AddAppointment(req,callback)
{
    log.info("\n.............................................AddAppointment Starts....................................................\n");
    try{
        var obj=req.body;
        log.info("Inputs :- "+req.body);
    }
    catch(ex)
    {
        log.fatal("Exception in object creation from request : "+req.body);
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in object creating from req body", false, req);
        callback(ex,undefined);
    }

    try {
        DbConn.Schedule.find({where: [{id: obj.CSDBScheduleId}]}).complete(function (err, ScheduleObject) {

            if(err)
            {
                log.error("Error in searching Schedule : "+obj.CSDBScheduleId);
                callback(err,undefined);
            }

            else if (ScheduleObject) {
                // console.log(cloudEndObject);
                try {
                    var AppObject = DbConn.Appointment
                        .build(
                        {
                            AppointmentName: obj.AppointmentName,
                            Action:obj.Action,
                            ExtraData: obj.ExtraData,
                            StartDate: obj.StartDate,
                            EndDate: obj.EndDate,
                            StartTime: obj.StartTime,
                            EndTime: obj.EndTime,
                            DaysOfWeek:obj.DaysOfWeek,
                            ObjClass:obj.ObjClass,
                            ObjType:obj.ObjType,
                            ObjCategory:obj.ObjCategory,
                            CompanyId:obj.CompanyId,
                            TenantId:obj.TenantId


                        }
                    )
                    log.info("New Application object Successfully created : "+JSON.stringify(AppObject));
                }
                catch(ex)
                {
                    // var jsonString = messageFormatter.FormatMessage(ex, "Exception found in building appointment objecty", false, req);
                    log.fatal("Exception in creating New Application object : "+ex);
                    callback(ex,undefined);
                }

                AppObject.save().complete(function (err,result) {
                    if (!err) {
                        log.info("New Application object saved successfully ");
                        console.log("Saving succeeded ");
                        ScheduleObject.addAppointment(AppObject).complete(function (errx, AppObjIntex) {

                            if(AppObjIntex)
                            {
                                log.info("Application record successfully mapped with Schedule object and returned "+AppObjIntex);
                                //var jsonString = messageFormatter.FormatMessage(null, "Mapping is succeeded ", true, AppObjIntex);
                                callback(undefined,AppObjIntex);
                            }
                            else
                            {
                                log.error("Mapping returns an Error : "+errx);
                                //var jsonString = messageFormatter.FormatMessage(errx, "Mapping is failed ", false, null);
                                callback(errx,undefined);
                            }


                        });


                    }
                    else {
                        log.error("Error in saving to DB : "+err);
                        //var jsonString = messageFormatter.FormatMessage(err, "saving is failed ", false, null);
                        callback(err,undefined);
                    }


                });




            }
            else  {
                //console.log("................................... Given Cloud End User is invalid ................................ ");
                // var jsonString = messageFormatter.FormatMessage(null, "null object returned as shedule search result for : "+obj.CSDBScheduleId, false, ScheduleObject);
                log.info("No record found for Schedule");
                callback(new Error('No record found'),undefined);
            }



        });
    }
    catch(ex)
    {
        log.fatal("Exception : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching Schedule ", false, null);
        callback(ex,undefined);
    }

}


//get :-done
function FindValidAppoinment(req,callback) {

    log.info("\n.............................................Find valid Appointment Starts....................................................\n");
    try
    {
        DbConn.Appointment
            .findAll({
                // where: {id: req}
            }
        )
            .complete(function (err, result) {
                if (err) {

                    log.error("Error i searching for Appointments");
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    //var jsonString = messageFormatter.FormatMessage(err, "Error in searching : "+req, false, result);
                    callback(err, undefined);

                } else
                {
                    if (!result) {
                        log.error('No user with the Extension has been found.');
                        console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );


                        //console.log("An error occurred in date searching process ");
                        //var jsonString = messageFormatter.FormatMessage(err, "Null object returened as result for : " + req, false, result);
                        callback('No record',undefined);


                    } else {
                        log.info("Appontment records found : "+JSON.stringify(result));
                        try {

                            // var index=
                            for (var index in result) {

                                log.info("Appointment : "+result[index]);
                                if (result[index].StartDate == null || result[index].EndDate == null) {

                                    // console.log('Null found');
                                }
                                else {
                                    try {

                                        if (DateCheck(result[index])) {
                                            try {
                                                if (TimeCheck(result[index])) {
                                                    try {
                                                        if (DayCheck(result[index])) {
                                                            console.log('Record Found : ' + result[index]);
                                                            log.info("Record found : "+result[index]);

                                                            //var jsonString = messageFormatter.FormatMessage(null, "Successfully Found ", true, jsonString);
                                                            callback(undefined,result[index]);
                                                            // res.end(result[index]);
                                                        }
                                                        else {
                                                            continue;
                                                        }
                                                    }
                                                    catch (ex) {
                                                        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching DayCheck ", false, null);
                                                        //res.end(jsonString);
                                                        log.fatal("Exception in Day check : "+ex);
                                                        callback('Error in Day check : '+ex,undefined);
                                                    }
                                                }
                                                else {
                                                    continue;
                                                }
                                            }
                                            catch (ex) {
                                                log.fatal("Exception in Time check : "+ex);
                                                callback('Error in Time check : '+ex,undefined);
                                            }
                                        }
                                        else {
                                            continue;
                                        }
                                    } catch (ex) {
                                        log.fatal("Exception in Date check : "+ex);
                                        callback('Error in Date check : '+ex,undefined);
                                    }

                                }

                                if(result.length==index+1)
                                {
                                    log.error("End of Object checking.No record found");
                                    callback('No suitable Appointment found',undefined);
                                }
                            }
                            //var jsonString = messageFormatter.FormatMessage(null, "Record finished : No recode found ", false, null);
                            //res.end(jsonString);

                        }
                        catch (ex) {
                            log.fatal("Exception: "+ex);
                            callback("Exception : "+ex,undefined);
                        }
                    }
                }

            });

    }
    catch(ex)
    {
        log.fatal("Exception: "+ex);
        callback("Exception : "+ex,undefined);
    }


}



function DateCheck(reslt)
{
    log.info("\n.............................................Date check Starts....................................................\n");
    try {
        log.info("Inputs :- "+JSON.stringify(reslt));
        if (reslt.StartDate == null && reslt.EndDate == null) {

            log.info("start and end dates are null, return true");

            return true;
            // console.log('Null found');

        }


        else {

            try {
                var x = moment(moment()).isBetween(reslt.StartDate, reslt.EndDate);
                if (x) {
                    log.info("Today is between record's starting and end date");
                    return true;
                }
                else {
                    log.error("Date is not matched");
                    console.log('Date error 2');
                    return false;
                }
            }
            catch(ex)
            {
                log.fatal("Exception in Date comparing : "+ex);
                console.log("Exception in date :"+ex);
                return false;
            }


        }
    }
    catch(ex)
    {
        log.fatal("Exception Date checking : "+ex);
        return false;
    }
}

function TimeCheck(reslt)
{
    log.info("\n.............................................TimeCheck Starts....................................................\n");
    try {
        log.info("Inputs :- StratTime :-  "+reslt.StartTime+" EndTime :- "+reslt.EndTime);
        var dblCTm = moment().format("HH.mm");
        var dblStTm = reslt.StartTime;
        var dblEdTm = reslt.EndTime;

        log.info("Inputs :- StratTime :  "+dblStTm+" EndTime : "+dblEdTm+" Current Time: "+dblCTm);
    }
    catch(ex)
    {
        log.fatal("Exception in Time formatting or in inputs ");
        return false;
    }

    if(reslt.StartTime == null && reslt.EndTime==null)
    {
        log.info("Start time and End Time is empty");
        return true;
        // console.log('Null found');

    }
    else if(reslt.StartTime == null || reslt.EndTime==null)
    {log.info("Start time or End Time is empty");

        return true;
        console.log('time null');
    }
    else {

        if (dblCTm >= dblStTm && dblCTm < dblEdTm) {

            log.info("Current time is in between Start and end time of record ");

            return true;


        }
        else {
            log.error("Current time isn't in between Start and end time of record ");
            console.log('time range error');
            return false;

        }
    }
}

function DayCheck(reslt)
{
    log.info("\n.............................................DayCheck Starts....................................................\n");
    try {
        log.info("Input : - "+reslt);
        if (reslt.DaysOfWeek == null) {

            log.info("Days details of Record is not specified");
            return true;
        }

        else {

            try {
                var DaysArray = reslt.DaysOfWeek.split(",");
                log.info("Record Day details "+JSON.stringify(DaysArray));
            }
            catch(ex)
            {
                log.fatal("Exception in Day details seperating : "+ex);
                consloe.log("Invalid days");
                return false;
            }
            //  var str = "123, 124, 234,252";
            //var arr = str.split(",").map(function (val) { return +val + 1; });

            try{
                var dt = moment(moment()).format('dddd');
                log.info("Today is : "+dt);
            }
            catch(ex)
            {
                log.fatal("Exception in getting current day : "+ex);
                return false;
            }

            //console.log('Today is :' + dt);

            if (DaysArray.indexOf(dt) > -1) {

                log.info("Today is valid day")
                return true;
            }
            else {
                log.error("Today is invalid day");
                return false;
                console.log('Days error ' + DaysArray);
            }
        }
    }
    catch(ex)
    {
        log.fatal("Exception  : "+ex);
        return false;
    }
}


//get :- done
function CheckAvailables(Dt,Dy,Tm,callback)
{
    log.info("\n.............................................Check Available Appointments Starts....................................................\n");
    try {

        log.info("Inputs :- Date : "+Dt+" Days: "+Dy+" Time : "+Tm);
        //var obj = dataz;
        var ReqDate = Dt;
        var ReqDay = Dy;
        var ReqTime = Tm;
        var DaySt = false;
        var DbDays = null;

        var DaysArray = ReqDay.split(",");
        log.info("Days Array : "+DaysArray);
    }
    catch (ex)
    {
        //var jsonString = messageFormatter.FormatMessage(err, "Error in object creation from request", false, dataz);
        //res.end(jsonString);
        log.fatal("Exception in input gathering : "+ex);
        callback(ex,undefined);
    }

    try {

        DbConn.Appointment
            .findAll({}
        )
            .complete(function (err, result) {
                if (err) {
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    log.error("Error in searching Appointments : "+err);
                    callback(err, undefined);

                } else
                {
                    if (!result) {
                        log.error("No appointment found");
                        console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );
                        callback('No record found', undefined);

                    } else {
                        try {
                            log.info("Record found : "+JSON.stringify(result));

                            for (var index in result) {

                                if (moment(ReqDate).isBetween(result[index].StartDate, result[index].EndDate)) {

                                    if (ReqTime >= result[index].StartTime && ReqTime < result[index].EndTime) {
                                        DbDays = result[index].DaysOfWeek.split(',');

                                        for (var dindex in DaysArray) {
                                            //var dt = moment(DaysArray[dindex]).format('dddd');
                                            if (DbDays.indexOf(DaysArray[dindex]) > -1) {


                                                DaySt = true;
                                                //callback(undefined,+result[index]);
                                            }
                                            else {
                                                // log.info("Record found :"+result[index]);
                                                DaySt = false;
                                                continue;
                                            }

                                        }

                                        if (DaySt) {
                                            log.info("Record found :"+result[index]);
                                            console.log('Record Found' + result[index].id);

                                            // var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, result[index]);
                                            // res.end(jsonString);
                                            callback(undefined,result[index].id);
                                            break;
                                        }
                                        else {
                                            //callback('Record not matched',undefined);
                                            continue;
                                        }

                                    }
                                    else {
                                        continue;
                                    }
                                }
                                else {
                                    continue;
                                }
                            }

                            if(result.length==index+1)
                            {
                                log.error("No maching record found");
                                callback("No maching record found",undefined);
                            }
                        }
                        catch (ex) {
                            log.fatal("Exception : "+ex);
                            callback(ex,undefined);
                        }
                    }
                }
            });

    }
    catch(ex)
    {
        log.fatal("Exception : "+ex);
        callback(ex,undefined);
    }

}

//post :-done
function UpdateScheduleID(obj,callback)
{
    log.info("\n.............................................Update ScheduleID Starts....................................................\n");
    try {
        log.info("Inputs :- "+JSON.stringify(obj));
        DbConn.Schedule.find({where: [{id: obj.SID}]}).complete(function (err, ScheduleObject) {

            if (err) {
                log.error("Error in searching for id:" + obj.SID + " , Error : " + err);
                callback(err, undefined);
            }
            else
            {
                if (ScheduleObject) {
                    log.info("Schedule records found");
                    try {
                        DbConn.Appointment
                            .update(
                            {
                                CSDBScheduleId: obj.SID


                            },
                            {
                                where: [{id: obj.AID}]
                            }
                        ).then(function (result) {
                                // logger.info('Successfully Mapped. ');
                                console.log(".......................mapping is succeeded ....................");
                                // var jsonString = messageFormatter.FormatMessage(err, "mapping is succeeded", true, result);
                                log.info("Updating succeeded : " + result);
                                callback(undefined, result);

                            }).error(function (err) {
                                //logger.info('mapping error found in saving. : ' + err);
                                console.log("mapping failed ! " + err);
                                log.error("Error in updating : " + err);
                                //handle error here
                                // var jsonString = messageFormatter.FormatMessage(err, "mapping error found in saving. : " + err, false, null);
                                callback(err, undefined);

                            });

                    }
                    catch (ex) {
                        log.fatal("Exception in updating : " + ex);
                        //var jsonString = messageFormatter.FormatMessage(err, "Exception in Mapping", false, obj);
                        callback(ex, undefined);
                    }

                }
                else  {
                    // console.log(cloudEndObject);

                    //var jsonString = messageFormatter.FormatMessage(err, "No Schedule found : "+obj.SID, false, null);
                    log.error("No record found ");
                    callback(new Error("No Schedule found : " + obj.SID), undefined);


                }


            }
            //  return next();
        });
    }
    catch(ex)
    {
        log.fatal("Exception : " + ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching Schedule ", false, null);
        callback(ex,undefined);
    }




}

//get :-done
function PickAppThroughSchedule(cmp,tent,dt,dy,tm,callback) {
    log.info("\n.............................................Pick Appointment Through Schedule Starts....................................................\n");
    try{
        log.info("Inputs :- CompanyID : "+cmp+" TenentID : "+tent+" Date : "+dt+" Day : "+dy+" Time : "+tm);
        DbConn.Schedule
            .findAll({
                where: [{CompanyId: cmp} ,{TenantId: tent}], attributes: ['id']
            }
        )
            .complete(function (err, result) {
                if (err) {

                    log.error("Error in searching Scedule");
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule : " + id, false, result);
                    callback(null, jsonString);
                }

                else
                {
                    if (!result) {
                        console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );
                        log.error("No record found");
                        var jsonString = messageFormatter.FormatMessage(err, "Null object returns: no Schedule for id : " + id, false, result);
                        callback(null, jsonString);

                    } else {

                        log.info("Schedule record found");
                        for (var index in result) {

                            try {
                                DbConn.Appointment
                                    .findAll({
                                        where: [{CSDBScheduleId: result[index].id}]
                                    }
                                )
                                    .complete(function (err, resultapp) {
                                        if (err) {
                                            log.error("Error in searching Appointment  "+err);
                                            console.log('An error occurred while searching for Extension:', err);
                                            //logger.info( 'Error found in searching : '+err );

                                        } else {
                                            if (!resultapp) {
                                                log.error("No appointment found");
                                                console.log('No user with the Extension has been found.');
                                                ///logger.info( 'No user found for the requirement. ' );
                                                var jsonString = messageFormatter.FormatMessage(err, "EMPTY", false, resultapp);
                                                callback("Empty found", undefined);

                                            } else {

                                                log.info("Appointment record found");
                                                for (var index in resultapp) {
                                                    if (moment(dt).isBetween(resultapp[index].StartDate, resultapp[index].EndDate)) {
                                                        if (tm >= resultapp[index].StartTime && tm < resultapp[index].EndTime) {
                                                            DbDays = resultapp[index].DaysOfWeek.split(',');


                                                            //var dt = moment(DaysArray[dindex]).format('dddd');
                                                            if (DbDays.indexOf(dy) > -1) {
                                                                DaySt = true;
                                                            }
                                                            else {
                                                                DaySt = false;
                                                            }

                                                            //console.log('Today is :' + dt);


                                                            if (DaySt) {

                                                                // var jsonString = messageFormatter.FormatMessage(null, "Success , Record found : ", true, result[index]);
                                                                log.info("record found : "+JSON.stringify(result[index]));
                                                                callback(undefined, result[index]);


                                                                break;
                                                            }
                                                            else {

                                                                continue;
                                                            }
                                                        }
                                                        else {
                                                            continue;
                                                        }
                                                    }
                                                    else {
                                                        continue;
                                                    }

                                                }

                                                if (resultapp.length == index + 1) {

                                                    log.error("No Appointment found");
                                                    callback('No record', undefined);
                                                }

                                            }
                                        }

                                    });

                            }
                            catch (ex) {
                                log.fatal("Exception : "+ex);
                                var jsonString = messageFormatter.FormatMessage(ex, "Exception in searching appintment", false, result[index]);
                                callback(ex, undefined);
                            }
                        }

                    }
                }

            });
    }
    catch(ex)
    {
        log.fatal("Exception : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in searching Schedule", false, result[index]);
        callback(ex,undefined);
    }

}

//get :-done
function PickSchedule(obj,callback)
{
    log.info("\n.............................................Pick Schedule Starts....................................................\n");
    try {
        Log.info("Inputs:- "+JSON.stringify(obj));
        DbConn.Schedule
            .findAll({
                where: {id: obj}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    log.error("Error in searching Schedule "+err);
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    //var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule : "+id, false, result);
                    callback(err, undefined);

                } else
                {
                    if (!result) {

                        log.error("No record found");
                        //console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );

                        console.log('Empty found....................');
                        var jsonString = messageFormatter.FormatMessage(null, "Null object returns", false, result);
                        callback('No record', undefined);

                    } else {

                        log.info("Record found : "+JSON.stringify(result));
                        var jsonString = messageFormatter.FormatMessage(null, "Success", false, result);
                        callback(undefined, result);
                    }
                }

            });

    }
    catch (ex)
    {
        log.fatal("Exception: "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found in Schedule search ", false, null);

        callback(null,jsonString);
    }
}

//get :-done
function PickScheduleAction(obj,callback)
{
    log.info("\n.............................................Pick Schedule ActionStarts....................................................\n");
    try {
        log.info("Inputs :- "+JSON.stringify(obj));
        DbConn.Schedule
            .find({
                where: {id: obj}
            }
        )
            .complete(function (err, result) {
                if (err) {

                    log.error("Error in searching Schedule "+err);
                    console.log('An error occurred while searching for Extension:', err);
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Extension", false, result);

                    callback(err, undefined);
                    //logger.info( 'Error found in searching : '+err );

                } else
                {
                    if (!result) {
                        log.error("No record found");
                        console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );
                        var jsonString = messageFormatter.FormatMessage(err, "Null object returns", false, result);
                        callback('No record', undefined);

                    } else {

                        log.info("Schedule record found : "+JSON.stringify(result));
                        var jsonString = messageFormatter.FormatMessage(err, "Successfully object returend with records: " + result.length, true, result);
                        callback(undefined, JSON.stringify(result));

                    }
                }

            });
    }
    catch(ex)
    {
        log.info("Exception : "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in searching ", false, obj);
        callback(ex,undefined);
    }
}

//get :-done
function PickApointment(obj,callback)
{
    log.info("\n.............................................Pick Appointment Starts....................................................\n");
    try {
        log.info("Inputs:- "+JSON.stringify(obj));
        DbConn.Appointment
            .findAll({
                where: {id: obj}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    log.error("Error in searching Appointment  "+err);
                    console.log('An error occurred while searching for Appointment:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    callback(err, undefined);

                } else
                {
                    if (!result) {
                        log.error("No appointment record found");
                        console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );
                        var jsonString = messageFormatter.FormatMessage(ex, "Null found: no records: no errors", false, result);
                        callback('No record', undefined);


                    } else {
                        log.info("Appointments found "+JSON.stringify(result));
                        var jsonString = messageFormatter.FormatMessage(ex, "Success", false, result);
                        callback(undefined, Json.stringify(result));

                        //console.log(result.Action)

                    }
                }

            });
    }
    catch (ex)
    {
        log.fatal("Exception "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception returns", false, obj);
        callback(ex,undefined);
    }

}

//get :-done
function PickApointmentAction(obj,callback)
{
    log.info("\n.............................................Pick Appointment Action Starts....................................................\n");
    try {
        log.info("Input :- "+JSON.stringify(obj));
        DbConn.Appointment
            .findAll({
                where: {id: obj}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    log.error("Error in Search Appointment "+err);
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    callback(err, undefined);

                } else
                {
                    if (!result) {
                        log.error("No record found");
                        console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );
                        var jsonString = messageFormatter.FormatMessage(err, "Null returns :no records : no errors", false, result);
                        callback('No record', undefined);

                    } else {

                        log.info("Record found : "+JSON.stringify(result));
                        var jsonString = messageFormatter.FormatMessage(err, "Successfully object returns with records: " + result.length, true, result);
                        callback(undefined, JSON.stringify(result));

                    }
                }

            });
    }
    catch (ex)
    {
        log.fatal("Exception "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found", false, obj);
        callback(ex,undefined);
    }
}

//post :-done
function UpdateScheduleData(obj,callback)
{
    log.info("\n.............................................Update Schedule Data Starts....................................................\n");
    try {
        log.info("Inputs :- "+JSON.stringify(obj));
        DbConn.Schedule
            .find({
                where: {id: obj.id}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    log.error("Error in searching Schedule "+err);
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    callback(err,undefined);

                } else if (!result) {
                    log.error("No Schedule record found");
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "Null returns :no records : no errors", false, result);
                    callback(new Error('No record found'),undefied);

                } else if(result){
                    log.info("Schedule found : "+JSON.stringify(result));
                    try {
                        DbConn.Schedule
                            .update(
                            {
                                //ScheduleName: obj.ScheduleName,
                                Action: obj.Action,
                                ExtraData: obj.ExtraData,
                                ObjClass: obj.ObjClass,
                                ObjType: obj.ObjType,
                                ObjCategory: obj.ObjCategory,
                                CompanyId: obj.CompanyId,
                                TenantId: obj.TenantId


                            },
                            {
                                where: [{id: obj.id}]

                            }
                        ).then(function (result) {
                                //logger.info('Successfully Mapped. ');
                                log.info("Successfully updated "+result);
                                console.log(".......................Updation is succeeded ....................");
                                //var jsonString = messageFormatter.FormatMessage(null, "Updation is succeeded", true, result);
                                callback(undefined,result);

                            }).error(function (err) {
                                log.error("Error in updating : "+err);
                                //logger.info('mapping error found in saving. : ' + err);
                                console.log("mapping failed ! " + err);

                                // var jsonString = messageFormatter.FormatMessage(err, "mapping error found in saving. : " + err, false, null);
                                callback(err,undefined);
                                //handle error here

                            });
                    }
                    catch (ex)
                    {
                        log.fatal("Exception :"+ex);
                        //var jsonString = messageFormatter.FormatMessage(ex, "Exception occures", false, obj);
                        callback(ex,undefined);
                    }


                }

            });
    }
    catch (ex)
    {
        log.fatal("Exception :"+ex);
        callback(ex,undefined);
    }



    // return next();
}

//post :-done
function UpdateAppoinmentData(obj,callback)
{
    log.info("\n.............................................Update Appointment Data Starts....................................................\n");

    try {
        log.info("Inputs :"+JSON.stringify(obj));
        DbConn.Appointment
            .find({
                where: {id: obj.id}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    log.error("Error in searching Appointment : " + err);
                    console.log('An error occurred while searching for Appointment:', err);
                    //logger.info( 'Error found in searching : '+err );
                    //var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Appointment:", false, result);
                    callback(err, undefined);

                } else
                {
                    if (!result) {
                        log.error("No Appointment record found");
                        // console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );
                        // var jsonString = messageFormatter.FormatMessage(err, "Null returns :no records : no errors", false, result);
                        callback(new Error('No appointment found : ' + obj.id), undefined);

                    } else {
                        log.info("Appointment data found : "+JSON.stringify(result));
                        try {
                            DbConn.Appointment
                                .update(
                                {

                                    Action: obj.Action,
                                    ExtraData: obj.ExtraData,
                                    StartDate: obj.StartDate,
                                    EndDate: obj.StartDate,
                                    StartTime: obj.StartTime,
                                    EndTime: obj.EndTime,
                                    DaysOfWeek: obj.DaysOfWeek,
                                    ObjClass: obj.ObjClass,
                                    ObjType: obj.ObjType,
                                    ObjCategory: obj.ObjCategory,
                                    CompanyId: obj.CompanyId,
                                    TenantId: obj.TenantId


                                },
                                {
                                    where: [{id: obj.id}]
                                }
                            ).then(function (results) {
                                    //logger.info('Successfully Updated. ');
                                    log.info("Successfully updated : "+JSON.stringify(results));
                                    console.log(".......................Updation is succeeded ....................");
                                    callback(undefined, results);

                                }).error(function (err) {
                                    log.error("Error in updating : "+err);
                                    //logger.info('mapping error found in saving. : ' + err);
                                    console.log("mapping failed ! " + err);
                                    callback(err, undefined);
                                    //handle error here

                                });
                        }
                        catch (ex) {
                            log.fatal("Exception "+ex);
                            callback(ex, undefined);
                        }


                    }
                }

            });
    }
    catch (ex)
    {
        log.fatal("Exception "+ex);
        callback(ex,undefined);
    }
}

//post:-done
function UpdateScheduleIDAppointment(obj,callback)
{
    log.info("\n.............................................UpdateScheduleIDAppointment Starts....................................................\n");
    try {
        log.info("Inputs :-"+JSON.stringify(obj));
        DbConn.Schedule
            .find({
                where: {id: obj.id}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    log.error('Error in searching : '+err);
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    //var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    callback(err,undefined);

                } else if (!result) {
                    log.error('No record found');
                    console.log("No user with the Schedule id : "+obj.id+" has been found.");
                    ///logger.info( 'No user found for the requirement. ' );
                    //var jsonString = messageFormatter.FormatMessage(err, "Null returns for "+obj.id, false, result);
                    callback(new Error("No user with the Schedule id : "+obj.id+" has been found."),undefined);


                } else if(result) {
                    log.info("Records found : "+JSON.stringify(result));
                    console.log("Submitted Schedule id is valid : "+obj.id);
                    try{
                        DbConn.Appointment
                            .update(
                            {
                                CSDBScheduleId: obj.id


                            },
                            {
                                where: [{id: obj.AppID}]
                            }
                        ).then(function (results) {
                                //logger.info('Successfully Mapped. ');
                                log.info("Successfully updated : "+results);
                                console.log(".......................Updation is succeeded ....................");
                                // var jsonString = messageFormatter.FormatMessage(err, "Updation is succeeded", true, results);
                                //res.end(jsonString);
                                callback(undefined,results);

                            }).error(function (err) {
                                log.error("Error found in updating : "+err);
                                //logger.info('mapping error found in saving. : ' + err);
                                console.log("Updation failed ! " + err);
                                callback(err,undefined);
                                //handle error here

                            });
                    }
                    catch(ex)
                    {
                        log.fatal("Exception : "+ex);
                        callback(ex,undefined);
                    }

                }
                else
                {log.error("error ");
                    callback(err,result);
                }

            });
    }
    catch(ex)
    {
        log.fatal("Exception : "+ex);
        callback(ex,undefined);
    }
    return next();
}

module.exports.AddSchedule = AddSchedule;
module.exports.AddAppointment = AddAppointment;
module.exports.UpdateScheduleData = UpdateScheduleData;
module.exports.UpdateAppoinmentData = UpdateAppoinmentData;
module.exports.UpdateScheduleIDAppointment = UpdateScheduleIDAppointment;
module.exports.FindValidAppoinment = FindValidAppoinment;
module.exports.CheckAvailables = CheckAvailables;
module.exports.UpdateScheduleID = UpdateScheduleID;
module.exports.PickAppThroughSchedule = PickAppThroughSchedule;
module.exports.PickSchedule = PickSchedule;
module.exports.PickScheduleAction = PickScheduleAction;
module.exports.PickApointmentAction = PickApointmentAction;
module.exports.PickApointment = PickApointment;



