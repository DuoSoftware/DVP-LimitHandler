
/**
 * Created by pawan on 2/12/2015.
 */


var DbConn = require('DVP-DBModels');
var restify = require('restify');
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
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;


log4js.configure(config.Host.logfilepath, { cwd: hpath });
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
function AddSchedule(req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.NewSchedule] - [%s] -  New Schedule adding started  ',reqId);

    try{
        var obj=req.body;
        log.info("Inputs :-  "+req.body);
    }
    catch(ex)
    {
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in object creating from req body", false, req);
        //log.fatal("Exception on creating object from req.body "+ex);
        logger.error('[DVP-LimitHandler.NewSchedule] - [%s] -  Exception occurred while saving request data as object %s  ',reqId,JSON.stringify(req.body),ex);
        callback(ex,undefined);
    }

    try {
        DbConn.Schedule.find({where: [{ScheduleName: obj.ScheduleName}]}).complete(function (err, ScheduleObject) {

            if (err) {
                logger.error('[DVP-LimitHandler.NewSchedule] - [%s] - [PGSQL] - Error occurred while searching existing schedules - Schedule :  %s',reqId,obj.ScheduleName,err);
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
                                ObjClass: "OBJCLZ",
                                ObjType: "OBJTYP",
                                ObjCategory: "OBJCAT",
                                CompanyId: 1,
                                TenantId: 1,
                                Availability:obj.Availability
                                // AddTime: new Date(2009, 10, 11),
                                //  UpdateTime: new Date(2009, 10, 12),
                                // CSDBCloudEndUserId: jobj.CSDBCloudEndUserId


                            }
                        )
                    }
                    catch (ex) {
                        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in building appointment objecty", false, req);
                        logger.error('[DVP-LimitHandler.NewSchedule] - [%s] - [PGSQL] - Exception occurred while formatting Scehdule data',reqId,ex);
                        callback(ex, undefined);
                    }

                    NewScheduleObject.save().complete(function (err, result) {
                        if (!err) {
                            var status = 1;
                            logger.debug('[DVP-LimitHandler.NewSchedule] - [%s] - [PGSQL] - New Schedule %s is added successfully',reqId);
                            console.log("..................... Saved Successfully ....................................");
                            //  var jsonString = messageFormatter.FormatMessage(err, "AppObject saved successfully ", true, result);
                            callback(undefined, result);

                        }
                        else {
                            logger.error('[DVP-LimitHandler.NewSchedule] - [%s] - [PGSQL] - New Schedule %s is added unsuccessful',reqId,err);
                            //var jsonString = messageFormatter.FormatMessage(err, "AppObject saving error", false, result);
                            callback(err, undefined);

                        }


                    });


                }
                else  {
                    logger.error('[DVP-LimitHandler.NewSchedule] - [%s] - [PGSQL] - Schedule %s is alraedy in DB ',reqId,obj.ScheduleName);
                    //var jsonString = messageFormatter.FormatMessage(null, "null object returned as shedule search result for : "+obj.CSDBScheduleId, false, ScheduleObject);
                    callback(new Error('Already in DB'), undefined);
                }
            }
            //  return next();
        });
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.NewSchedule] - [%s] - [PGSQL] - Exception occurred when Schedule %s searching starts',reqId,obj.ScheduleName,ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching Schedule ", false, null);
        callback(ex,undefined);
    }



}
//post :- done
function AddAppointment(req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.NewAppointment] - [%s] -  New appointment adding started  ',reqId);
    try{
        var obj=req.body;
        //log.info("Inputs :- "+req.body);
    }
    catch(ex)
    {
        //log.fatal("Exception in object creation from request : "+req.body);
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in object creating from req body", false, req);
        logger.error('[DVP-LimitHandler.NewAppointment] - [%s] -  Exception occurred while saving request data as object %s  ',reqId,JSON.stringify(req.body),ex);
        callback(ex,undefined);
    }

    try {
        DbConn.Schedule.find({where: [{id: obj.ScheduleId}]}).complete(function (err, ScheduleObject) {

            if(err)
            {
                //log.error("Error in searching Schedule : "+obj.CSDBScheduleId);
                logger.error('[DVP-LimitHandler.NewAppointment] - [%s] - [PGSQL] - Error occurred while searching existing schedules - ScheduleId :  %s',reqId,obj.CSDBScheduleId,err);
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
                            ObjClass: "OBJCLZ",
                            ObjType: "OBJTYP",
                            ObjCategory: "OBJCAT",
                            CompanyId: 1,
                            TenantId: 1


                        }
                    );

                }
                catch(ex)
                {
                    // var jsonString = messageFormatter.FormatMessage(ex, "Exception found in building appointment objecty", false, req);
                    //log.fatal("Exception in creating New Application object : "+ex);
                    logger.error('[DVP-LimitHandler.NewAppointment] - [%s] - [PGSQL] - Exception occurred while formatting appointment data',reqId,ex);
                    callback(ex,undefined);
                }

                AppObject.save().complete(function (err,result) {
                    if (!err) {
                        //log.info("New Application object saved successfully ");
                        //console.log("Saving succeeded ");
                        logger.debug('[DVP-LimitHandler.NewAppointment] - [%s] - [PGSQL] - New Appointment %s is added successfully',reqId,JSON.stringify(AppObject));
                        ScheduleObject.addAppointment(AppObject).complete(function (errx, AppObjIntex) {

                            if(AppObjIntex)
                            {
                                //log.info("Application record successfully mapped with Schedule object and returned "+AppObjIntex);
                                //var jsonString = messageFormatter.FormatMessage(null, "Mapping is succeeded ", true, AppObjIntex);
                                logger.debug('[DVP-LimitHandler.NewAppointment] - [%s] - [PGSQL] - Schedule %s and appointment %s is mapped successfully',reqId,JSON.stringify(ScheduleObject),JSON.stringify(AppObject));
                                callback(undefined,AppObjIntex);
                            }
                            else
                            {
                                //log.error("Mapping returns an Error : "+errx);
                                //var jsonString = messageFormatter.FormatMessage(errx, "Mapping is failed ", false, null);
                                logger.error('[DVP-LimitHandler.NewAppointment] - [%s] - [PGSQL] - Schedule %s and appointment %s is mapped unsuccessful',reqId,JSON.stringify(ScheduleObject),JSON.stringify(AppObject),errx);
                                callback(errx,undefined);
                            }


                        });


                    }
                    else {
                        //log.error("Error in saving to DB : "+err);
                        //var jsonString = messageFormatter.FormatMessage(err, "saving is failed ", false, null);
                        logger.error('[DVP-LimitHandler.NewAppointment] - [%s] - [PGSQL] - New Appointment %s adding failed',reqId,err);
                        callback(err,undefined);
                    }


                });




            }
            else  {
                //console.log("................................... Given Cloud End User is invalid ................................ ");
                // var jsonString = messageFormatter.FormatMessage(null, "null object returned as shedule search result for : "+obj.CSDBScheduleId, false, ScheduleObject);
                //log.info("No record found for Schedule");
                logger.error('[DVP-LimitHandler.NewAppointment] - [%s] - [PGSQL] - No schedule found %s ',reqId,obj.CSDBScheduleId);
                callback(new Error('No record found'),undefined);
            }



        });
    }
    catch(ex)
    {
        //log.fatal("Exception : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching Schedule ", false, null);
        logger.error('[DVP-LimitHandler.NewAppointment] - [%s] - [PGSQL] - Exception occurred when searching Schedule %s',reqId,obj.CSDBScheduleId);
        callback(ex,undefined);
    }

}


//get :-done
function FindValidAppointment(req,reqId,callback) {

    logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  New appointment adding started  ',reqId);
    try
    {
        DbConn.Appointment
            .findAll({
                // where: {id: req}
            }
        )
            .complete(function (err, result) {
                if (err) {

                    //log.error("Error i searching for Appointments");
                    //console.log('An error occurred while searching for Extension:', err);
                    logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - error occurred while searching appointments  ',reqId,err);
                    //logger.info( 'Error found in searching : '+err );
                    //var jsonString = messageFormatter.FormatMessage(err, "Error in searching : "+req, false, result);
                    callback(err, undefined);

                } else
                {
                    if (result.length==0) {
                        //log.error('No user with the Extension has been found.');
                        //console.log('No user with the Extension has been found.');
                        logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - No appointment data found  ',reqId);
                        ///logger.info( 'No user found for the requirement. ' );


                        //console.log("An error occurred in date searching process ");
                        //var jsonString = messageFormatter.FormatMessage(err, "Null object returened as result for : " + req, false, result);
                        callback('No record',undefined);


                    } else {
                        logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Appointment data found  %s',reqId,JSON.stringify(result));
                        try {

                            // var index=
                            for (var index in result) {

                                //log.info("Appointment : "+result[index]);
                                logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Appointment data  %s',reqId,result[index]);
                                if (result[index].StartDate == null || result[index].EndDate == null) {

                                    // console.log('Null found');
                                }
                                else {
                                    try {

                                        if (DateCheck(result[index],reqId)) {
                                            try {
                                                if (TimeCheck(result[index],reqId)) {
                                                    try {
                                                        if (DayCheck(result[index]),reqId) {
                                                            //console.log('Record Found : ' + result[index]);
                                                            // log.info("Record found : "+result[index]);
                                                            logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Appointment record found  %s',reqId,result[index]);

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
                                                        //log.fatal("Exception in Day check : "+ex);
                                                        logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Exception occurred when Appointment day checking %s',reqId,result[index],ex);
                                                        callback('Error in Day check : '+ex,undefined);
                                                    }
                                                }
                                                else {
                                                    continue;
                                                }
                                            }
                                            catch (ex) {
                                                logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Exception occurred when Appointment time checking ',reqId,result[index],ex);
                                                callback('Error in Time check : '+ex,undefined);
                                            }
                                        }
                                        else {
                                            continue;
                                        }
                                    } catch (ex) {
                                        logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Exception occurred when Appointment date checking ',reqId,result[index],ex);
                                        callback('Error in Date check : '+ex,undefined);
                                    }

                                }

                                if(result.length==index+1)
                                {
                                    //log.error("End of Object checking.No record found");
                                    logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - End of Object checking.No record found ',reqId);
                                    callback('No suitable Appointment found',undefined);
                                }
                            }
                            //var jsonString = messageFormatter.FormatMessage(null, "Record finished : No recode found ", false, null);
                            //res.end(jsonString);

                        }
                        catch (ex) {
                            logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Exception on checking record by record ',reqId,ex);
                            callback("Exception : "+ex,undefined);
                        }
                    }
                }

            });

    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Exception on method start : FindValidAppointment ',reqId,ex);
        callback("Exception : "+ex,undefined);
    }


}



function DateCheck(req,reqId,reslt)
{
    logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  Date check starts - Data %s',reqId,JSON.stringify(reslt));
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
function CheckAvailables(Dt,Dy,Tm,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.CheckAvailablesFor] - [%s]  - CheckAvailables starting  ',reqId);


    //log.info("Inputs :- Date : "+Dt+" Days: "+Dy+" Time : "+Tm);
    //var obj = dataz;
    var ReqDate = Dt;
    var ReqDay = Dy;
    var ReqTime = Tm;
    var DaySt = false;
    var DbDays = null;
    try {
        var DaysArray = ReqDay.split(",");
        //log.info("Days Array : "+DaysArray);
    }
    catch (ex)
    {
        //var jsonString = messageFormatter.FormatMessage(err, "Error in object creation from request", false, dataz);
        //res.end(jsonString);
        logger.error('[DVP-LimitHandler.CheckAvailables] - [%s]  - Exception occurred when formatting requesting dates   ',reqId,ex);
        callback(ex,undefined);
    }

    try {

        DbConn.Appointment
            .findAll({}
        )
            .complete(function (err, result) {
                if (err) {
                    // console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - [PGSQL]  - Errors occurred while searching appintments  ',reqId,ex);
                    callback(err, undefined);

                } else
                {
                    if (result.length==0) {
                        logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - [PGSQL] - No Appointment found  ',reqId,ex);
                        //  console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );
                        callback('No record found', undefined);

                    } else {
                        try {
                            //logger.debug('[DVP-LimitHandler.LimitApi.CheckAvailablesFor] - [%s]- [PGSQL] - Appointments found  ',reqId);

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
                                            //log.info("Record found :"+result[index]);
                                            //  console.log('Record Found' + result[index].id);
                                            logger.debug('[DVP-LimitHandler.CheckAvailables] - [%s]- [PGSQL] - Appointment found %s  ',reqId,result[index].id);
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
                                //log.error("No maching record found");
                                logger.error('[DVP-LimitHandler.CheckAvailables] - [%s]- Appointment is not found ',reqId);
                                callback("No maching record found",undefined);
                            }
                        }
                        catch (ex) {
                            logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - Exception occurred when searching records one by one ',reqId,ex);
                            callback(ex,undefined);
                        }
                    }
                }
            });

    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - Exception occurred when starting method : CheckAvailables ',reqId,ex);
        callback(ex,undefined);
    }

}

//post :-done
function UpdateAppointmentScheduleId(obj,reqId,callback)
{

    try {
        logger.debug('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] -  Update Schedule Id started  - Data %s',reqId,JSON.stringify(obj));
        DbConn.Schedule.find({where: [{id: obj.SID}]}).complete(function (err, ScheduleObject) {

            if (err) {
                logger.error('[DVP-LimitHandler.UpdateAppointmentScheduleId] - [%s] - [PGSQL] -  Error occurred while searching for schedule %s  - Data %s',reqId,obj.SID,err);
                callback(err, undefined);
            }
            else
            {
                if (ScheduleObject) {
                    logger.debug('[DVP-LimitHandler.UpdateAppointmentScheduleId] - [%s] - [PGSQL] -  Records found for schedule %s  - Data %s',reqId,obj.SID,JSON.stringify(ScheduleObject));
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
                                logger.debug('[DVP-LimitHandler.UpdateAppointmentScheduleId] - [%s] - [PGSQL] -  Appointment"s Schedule Id  Updated successfully ',reqId);
                                // var jsonString = messageFormatter.FormatMessage(err, "mapping is succeeded", true, result);
                                //log.info("Updating succeeded : " + result);
                                callback(undefined, result);

                            }).error(function (err) {
                                //logger.info('mapping error found in saving. : ' + err);
                                logger.error('[DVP-LimitHandler.UpdateAppointmentScheduleId] - [%s] - [PGSQL] -  %s Appointment"s Schedule Id  Updation failed ',reqId,obj.AID,err);
                                //handle error here
                                // var jsonString = messageFormatter.FormatMessage(err, "mapping error found in saving. : " + err, false, null);
                                callback(err, undefined);

                            });

                    }
                    catch (ex) {
                        logger.error('[DVP-LimitHandler.UpdateAppointmentScheduleId] - [%s] - [PGSQL] -  Exception occurred when updating Application %s ScheduleID  ',reqId,obj.AID,ex);
                        //var jsonString = messageFormatter.FormatMessage(err, "Exception in Mapping", false, obj);
                        callback(ex, undefined);
                    }

                }
                else  {
                    // console.log(cloudEndObject);

                    //var jsonString = messageFormatter.FormatMessage(err, "No Schedule found : "+obj.SID, false, null);
                    logger.error('[DVP-LimitHandler.UpdateAppointmentScheduleId] - [%s] - [PGSQL] -  No record found for  ScheduleID  %s',reqId,obj.SID,ex);
                    callback(new Error("No Schedule found : " + obj.SID), undefined);


                }


            }
            //  return next();
        });
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.UpdateAppointmentScheduleId] - [%s]  -  Exception occurred when starting Method : UpdateAppointmentScheduleId with %s  ',reqId,JSON.stringify(obj),ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching Schedule ", false, null);
        callback(ex,undefined);
    }




}

//get :-done
function PickAppThroughSchedule(cmp,tent,dt,dy,tm,reqId,callback) {

    try{
        //log.info("Inputs :- CompanyID : "+cmp+" TenentID : "+tent+" Date : "+dt+" Day : "+dy+" Time : "+tm);
        DbConn.Schedule
            .findAll({
                where: [{CompanyId: cmp} ,{TenantId: tent}], attributes: ['id']
            }
        )
            .complete(function (err, result) {
                if (err) {

                    //log.error("Error in searching Scedule");
                    logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - [PGSQL] -  Error occurred while searching Schedules of Company %s and Tenant %s ',reqId,cmp,tent,err);
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule : " + id, false, result);
                    callback(null, jsonString);
                }

                else
                {
                    if (result.length==0) {
                        logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - [PGSQL] - No records found while searching Schedules of Company %s and Tenant %s ',reqId,cmp,tent,err);
                        ///logger.info( 'No user found for the requirement. ' );
                        log.error("No record found");
                        var jsonString = messageFormatter.FormatMessage(err, "Null object returns: no Schedule for id : " + id, false, result);
                        callback(null, jsonString);

                    } else {

                        logger.debug('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - [PGSQL] - Records found while searching Schedules of Company %s and Tenant %s ',reqId,cmp,tent);
                        for (var index in result) {

                            try {
                                DbConn.Appointment
                                    .findAll({
                                        where: [{CSDBScheduleId: result[index].id}]
                                    }
                                )
                                    .complete(function (err, resultapp) {
                                        if (err) {
                                            //log.error("Error in searching Appointment  "+err);
                                            console.log('An error occurred while searching for Extension:', err);
                                            logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - [PGSQL] - Error found while searching Appointment records of Schedule %s ',reqId,result[index].id,err);
                                            //logger.info( 'Error found in searching : '+err );

                                        } else {
                                            if (resultapp.length==0) {
                                                //log.error("No appointment found");
                                                console.log('No user with the Extension has been found.');
                                                ///logger.info( 'No user found for the requirement. ' );
                                                logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - [PGSQL] - No records found while searching Appointment records of Schedule %s ',reqId,result[index].id);
                                                var jsonString = messageFormatter.FormatMessage(err, "EMPTY", false, resultapp);
                                                callback("Empty found", undefined);

                                            } else {

                                                //log.info("Appointment record found");
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
                                                                //log.info("record found : "+JSON.stringify(result[index]));
                                                                logger.debug('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - Records found while searching Appointment records of Schedule %s ',reqId,JSON.stringify(result[index]));
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

                                                    logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - - No Records found while searching Appointment records of Schedule %s ',reqId,JSON.stringify(result[index]));
                                                    callback('No record', undefined);
                                                }

                                            }
                                        }

                                    });

                            }
                            catch (ex) {
                                logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - - Exception occurred while searching Appointment records of Schedule %s ',reqId,JSON.stringify(result[index]),ex);
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
        logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - Exception occurred when starting method:  PickAppThroughSchedule ',reqId,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in searching Schedule", false, result[index]);
        callback(ex,undefined);
    }

}

//get :-done
function PickSchedule(obj,reqId,callback)
{

    try {
        //Log.info("Inputs:- "+JSON.stringify(obj));
        DbConn.Schedule
            .findAll({
                where: {id: obj}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - Error occurred when searching for Schedule %s ',reqId,obj,err);
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    //var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule : "+id, false, result);
                    callback(err, undefined);

                } else
                {
                    if (result.length==0) {

                        logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - No record found for Schedule %s ',reqId,obj);
                        //console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );

                        //console.log('Empty found....................');
                        var jsonString = messageFormatter.FormatMessage(null, "No record found", false, result);
                        callback(new Error('No record'), undefined);

                    } else {
                        if(result.length==0)
                        {
                            var jsonString = messageFormatter.FormatMessage(undefined, "Empty result returns", false, result);
                            callback(new Error('No record'), undefined);
                        }
                        else {
                            //logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - Record found for Schedule %s ',reqId,obj);
                            var jsonString = messageFormatter.FormatMessage(undefined, "Success", false, result);
                            callback(undefined, result);
                        }
                    }
                }

            });

    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - Exception occurred when starting method : PickSchedule ',reqId,obj);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found in Schedule search ", false, null);

        callback(null,jsonString);
    }
}

//get :-done
function PickScheduleAction(obj,reqId,callback)
{
    //log.info("\n.............................................Pick Schedule ActionStarts....................................................\n");
    try {
        //log.info("Inputs :- "+JSON.stringify(obj));
        DbConn.Schedule
            .find({
                where: {id: obj}
            }
        )
            .complete(function (err, result) {
                if (err) {

                    logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - Error occurred while searching Schedule %s ',reqId,obj,err);
                    console.log('An error occurred while searching for Extension:', err);
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Extension", false, result);

                    callback(err, undefined);
                    //logger.info( 'Error found in searching : '+err );

                } else
                {
                    if (!result) {
                        logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - No record found for Schedule %s ',reqId,obj);
                        console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );
                        var jsonString = messageFormatter.FormatMessage(err, "Null object returns", false, result);
                        callback(new Error('No record'), undefined);

                    } else {

                        //log.info("Schedule record found : "+JSON.stringify(result));
                        logger.debug('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - Record found for Schedule %s  -  Data - Id %s',reqId,obj);
                        var jsonString = messageFormatter.FormatMessage(err, "Successfully object returend with records: " + result.length, true, result);
                        callback(undefined, JSON.stringify(result));

                    }
                }

            });
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - Exception occurred when starting method : PickScheduleAction  -  Data - Id %s',reqId,obj,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in searching ", false, obj);
        callback(ex,undefined);
    }
}

//get :-done
function PickApointment(obj,reqId,callback)
{
    //log.info("\n.............................................Pick Appointment Starts....................................................\n");
    try {
        //log.info("Inputs:- "+JSON.stringify(obj));
        DbConn.Appointment
            .findAll({
                where: {id: obj}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    logger.error('[DVP-LimitHandler.LimitApi.PickAppointmentById] - [%s] - [PGSQL]  - Error occurred while searching for appointment for %s   ',reqId,obj,err);
                    console.log('An error occurred while searching for Appointment:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    callback(err, undefined);

                } else
                {
                    if (result.length == 0) {
                        logger.error('[DVP-LimitHandler.LimitApi.PickAppointmentById] - [%s] - [PGSQL]  - No record found for appointment %s   ',reqId,obj);
                        console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );
                        var jsonString = messageFormatter.FormatMessage("Empty", "Null found: no records: no errors", false, result);
                        callback('No record', undefined);


                    } else {
                        logger.debug('[DVP-LimitHandler.LimitApi.PickAppointmentById] - [%s] - [PGSQL]  - Record found appointment for %s   ',reqId,obj);
                        //var jsonString = messageFormatter.FormatMessage(ex, "Success", false, result);
                        callback(undefined, JSON.stringify(result));

                        //console.log(result.Action)

                    }
                }

            });
    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.LimitApi.PickAppointmentById] - [%s] - [PGSQL]  - Exception occurred when starting method :  PickAppointmentById   for %s',reqId,obj,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception returns", false, obj);
        callback(ex,undefined);
    }

}

//get :-done
function PickApointmentAction(obj,reqId,callback)
{
    //log.info("\n.............................................Pick Appointment Action Starts....................................................\n");
    try {
        //log.info("Input :- "+JSON.stringify(obj));
        DbConn.Appointment
            .findAll({
                where: {id: obj}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    //log.error("Error in Search Appointment "+err);
                    logger.error('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - Error occurred while searching appointments of Id %s  ',reqId,obj,err);
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    callback(err, undefined);

                } else
                {
                    if (result.length==0) {
                        logger.error('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - No record found for appointments of Id %s  ',reqId,obj);
                        console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );
                        var jsonString = messageFormatter.FormatMessage(undefined, "Null returns :no records : no errors", false, result);
                        callback('No record', undefined);

                    } else {

                        logger.debug('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - Record found for appointments of Id %s  ',reqId,obj);
                        var jsonString = messageFormatter.FormatMessage(err, "Successfully object returns with records: " + result.length, true, result);
                        callback(undefined, JSON.stringify(result));

                    }
                }

            });
    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - Exception occurred when starting method :  PickAppointmentAction ',reqId,obj,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found", false, obj);
        callback(ex,undefined);
    }
}

//post :-done
function UpdateScheduleData(SID,obj,reqId,callback)
{
    //log.info("\n.............................................Update Schedule Data Starts....................................................\n");

    logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] -  New Schedule adding started  - Data %s',reqId,JSON.stringify(obj));
    try {
        //log.info("Inputs :- "+JSON.stringify(obj));
        DbConn.Schedule
            .find({
                where: {id: SID}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    //log.error("Error in searching Schedule "+err);
                    //console.log('An error occurred while searching for Extension:', err);
                    logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Error occurred while searching Schedule %s ',reqId,SID,err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    callback(err,undefined);

                } else if (!result) {
                    logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] -  No record found for Schedule %s ',reqId,SID);
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "Null returns :no records : no errors", false, result);
                    callback(new Error('No record found'),undefied);

                } else if(result){
                    logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Record for Schedule %s  - Data %s',reqId,JSON.stringify(result));
                    try {
                        DbConn.Schedule
                            .update(
                            {
                                //ScheduleName: obj.ScheduleName,
                                Action: obj.Action,
                                ExtraData: obj.ExtraData,
                                ObjClass: "OBJCLZ",
                                ObjType: "OBJTYP",
                                ObjCategory: "OBJCAT",
                                CompanyId: 1,
                                TenantId: 1


                            },
                            {
                                where: [{id: SID}]

                            }
                        ).then(function (result) {
                                //logger.info('Successfully Mapped. ');
                                logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Schedule %s is updated successfully  ',reqId,SID);
                                //var jsonString = messageFormatter.FormatMessage(null, "Updation is succeeded", true, result);
                                callback(undefined,result);

                            }).error(function (err) {
                                logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Error occurred while updating Schedule %s - data %s',reqId,SID,JSON.stringify(obj),err);

                                // var jsonString = messageFormatter.FormatMessage(err, "mapping error found in saving. : " + err, false, null);
                                callback(err,undefined);
                                //handle error here

                            });
                    }
                    catch (ex)
                    {
                        logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Exception occurred when  Schedule %s update starts - data %s',reqId,SID,JSON.stringify(obj),ex);
                        //var jsonString = messageFormatter.FormatMessage(ex, "Exception occures", false, obj);
                        callback(ex,undefined);
                    }


                }

            });
    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Exception occurred when Schedule %s searching starts - data %s',reqId,SID,JSON.stringify(obj),ex);
        callback(ex,undefined);
    }



    // return next();
}

//post :-done
function UpdateAppointmentData(AID,obj,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  UpdateAppointmentData starting  - Data %s',reqId,JSON.stringify(obj));

    try {

        DbConn.Appointment
            .find({
                where: {id: AID}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  Error occurred while searching Appointment %s ',reqId,AID,err);
                    //logger.info( 'Error found in searching : '+err );
                    //var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Appointment:", false, result);
                    callback(err, undefined);

                } else
                {
                    if (!result) {
                        logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] - No record found for Appointment %s ',reqId,AID);
                        // console.log('No user with the Extension has been found.');
                        ///logger.info( 'No user found for the requirement. ' );
                        // var jsonString = messageFormatter.FormatMessage(err, "Null returns :no records : no errors", false, result);
                        callback(new Error('No appointment found : ' + AID), undefined);

                    } else {
                        logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] - Record found for Appointment %s ',reqId,AID);
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
                                    ObjClass: "OBJCLZ",
                                    ObjType: "OBJTYP",
                                    ObjCategory: "OBJCAT",
                                    CompanyId: 1,
                                    TenantId: 1


                                },
                                {
                                    where: [{id: AID}]
                                }
                            ).then(function (results) {
                                    //logger.info('Successfully Updated. ');
                                    logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  Appointment %s updated successfully',reqId,AID);
                                    callback(undefined, results);

                                }).error(function (err) {
                                    logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  Error occurred while updating Appointment %s ',reqId,AID,err);
                                    callback(err, undefined);
                                    //handle error here

                                });
                        }
                        catch (ex) {

                            logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  Exception occurred when starting updation of Appointment %s Data %s',reqId,AID,JSON.stringify(obj),ex);
                            callback(ex, undefined);
                        }


                    }
                }

            });
    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  Exception occurred when starting method: UpdateAppointmentData - Appointment %s Data %s',reqId,AID,JSON.stringify(obj),ex);
        callback(ex,undefined);
    }
}

//post:-done
function UpdateScheduleIDAppointment(SID,AID,obj,reqId,callback)
{
    //log.info("\n.............................................UpdateScheduleIDAppointment Starts....................................................\n");
    try {
        log.info("Inputs :-"+JSON.stringify(obj));
        DbConn.Schedule
            .find({
                where: {id: SID}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    //log.error('Error in searching : '+err);
                    //console.log('An error occurred while searching for Extension:', err);
                    logger.error('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - [PGSQL]  - Error in searching Schedule %s ', reqId, SID, err);
                    //logger.info( 'Error found in searching : '+err );
                    //var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    callback(err, undefined);

                } else
                {
                    if (!result) {
                        //log.error('No record found');
                        //console.log("No user with the Schedule id : "+obj.id+" has been found.");
                        logger.error('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - [PGSQL]  - No records found for Schedule %s ', reqId, SID);
                        ///logger.info( 'No user found for the requirement. ' );
                        //var jsonString = messageFormatter.FormatMessage(err, "Null returns for "+obj.id, false, result);
                        callback(new Error("No user with the Schedule id : " + SID + " has been found."), undefined);


                    }
                    else
                    {
                        // log.info("Records found : "+JSON.stringify(result));
                        //console.log("Submitted Schedule id is valid : "+obj.id);
                        logger.debug('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - [PGSQL]  - Record found for Schedule %s ', reqId, SID);
                        try {
                            DbConn.Appointment
                                .update(
                                {
                                    ScheduleId: SID

                                },
                                {
                                    where: {id: AID}
                                }
                            ).then(function (results) {
                                    //logger.info('Successfully Mapped. ');
                                    //log.info("Successfully updated : "+results);
                                    //console.log(".......................Updation is succeeded ....................");
                                    // var jsonString = messageFormatter.FormatMessage(err, "Updation is succeeded", true, results);
                                    //res.end(jsonString);
                                    logger.debug('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - [PGSQL]  - Updation succeeded of Schedule %s and Appointment %s', reqId, SID, AID);
                                    callback(undefined, results);

                                }).error(function (err) {
                                    //log.error("Error found in updating : "+err);
                                    //logger.info('mapping error found in saving. : ' + err);
                                    // console.log("Updation failed ! " + err);
                                    logger.error('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - [PGSQL]  - Error in Updation of Schedule %s and Appointment %s', reqId, SID, AID, err);
                                    callback(err, undefined);
                                    //handle error here

                                });
                        }
                        catch (ex) {
                            logger.error('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - [PGSQL]  - Exception in Updation of Schedule %s and Appointment %s', reqId, SID, AID, ex);
                            callback(ex, undefined);
                        }

                    }
                }

            });
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.UpdateScheduleIdOfAppointment] - [%s] - [PGSQL]  - Exception in Startion method :UpdateScheduleIDAppointment with Schedule %s and Appointment %s',reqId,SID,AID,ex);
        callback(ex,undefined);
    }

}

module.exports.AddSchedule = AddSchedule;
module.exports.AddAppointment = AddAppointment;
module.exports.UpdateScheduleData = UpdateScheduleData;
module.exports.UpdateScheduleIDAppointment = UpdateScheduleIDAppointment;
module.exports.FindValidAppointment = FindValidAppointment;
module.exports.CheckAvailables = CheckAvailables;
module.exports.UpdateAppointmentData = UpdateAppointmentData;
module.exports.PickAppThroughSchedule = PickAppThroughSchedule;
module.exports.PickSchedule = PickSchedule;
module.exports.PickScheduleAction = PickScheduleAction;
module.exports.PickApointmentAction = PickApointmentAction;
module.exports.PickApointment = PickApointment;



