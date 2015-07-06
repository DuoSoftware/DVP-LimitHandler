
/**
 * Created by pawan on 2/12/2015.
 */


var DbConn = require('DVP-DBModels');
var restify = require('restify');
var stringify=require('stringify');
var moment=require('moment');
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var log4js=require('log4js');
var config = require('config');
var hpath=config.Host.hostpath;
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;


log4js.configure(config.Host.logfilepath, { cwd: hpath });
var log = log4js.getLogger("shdlapi");





function CreateSchedule(req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.CreateSchedule] - [%s] -  New Schedule adding started  ',reqId);

    try{
        var obj=req.body;

    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] -  Exception occurred while saving request data as object %s  ',reqId,JSON.stringify(req.body),ex);
        callback(ex,undefined);
    }

    try {
        DbConn.Schedule.find({where: [{ScheduleName: obj.ScheduleName}]}).complete(function (err, ScheduleObject) {

            if (err) {
                logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - Error occurred while searching existing schedules - Schedule :  %s',reqId,obj.ScheduleName,err);
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
                        logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - Exception occurred while formatting Scehdule data',reqId,ex);
                        callback(ex, undefined);
                    }

                    NewScheduleObject.save().complete(function (err, result) {

                        if(err)
                        {
                            logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - New Schedule %s is added unsuccessful',reqId,err);

                            callback(err, undefined);
                        }

                        else
                        {

                            logger.debug('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - New Schedule %s is added successfully',reqId);
                            callback(undefined, result);

                        }



                    });


                }
                else  {
                    logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - Schedule %s is alraedy in DB ',reqId,obj.ScheduleName);
                    callback(new Error('Already in DB'), undefined);
                }
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - Exception occurred when Schedule %s searching starts',reqId,obj.ScheduleName,ex);
        callback(ex,undefined);
    }



}

function CreateAppointment(req,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] -  New appointment adding started  ',reqId);
    try{
        var obj=req.body;


    }
    catch(ex)
    {

        logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] -  Exception occurred while saving request data as object %s  ',reqId,JSON.stringify(req.body),ex);
        callback(ex,undefined);
    }

    try {
        DbConn.Schedule.find({where: {id: obj.ScheduleId}}).complete(function (err, ScheduleObject) {

            if(err)
            {

                logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - Error occurred while searching existing schedules - ScheduleId :  %s',reqId,obj.ScheduleId,err);
                callback(err,undefined);
            }

            else if (ScheduleObject) {

                console.log(JSON.stringify(ScheduleObject));

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

                    logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - Exception occurred while formatting appointment data',reqId,ex);
                    callback(ex,undefined);
                }

                AppObject.save().complete(function (err,result) {

                    if(err)
                    {
                        logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - New Appointment %s adding failed',reqId,err);
                        callback(err,undefined);
                    }else
                    {
                        logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - New Appointment %s is added successfully',reqId,JSON.stringify(result));
                        ScheduleObject.addAppointment(AppObject).complete(function (errx, AppObjIntex) {

                            if(errx)
                            {
                                logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - Schedule %s and appointment %s is mapped unsuccessful',reqId,JSON.stringify(ScheduleObject),JSON.stringify(AppObject),errx);
                                callback(errx,undefined);
                            }
                            else
                            {

                                logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - Schedule %s and appointment %s is mapped successfully',reqId,JSON.stringify(ScheduleObject),JSON.stringify(AppObject));
                                callback(undefined,AppObjIntex);
                            }



                        });
                    }




                });




            }
            else  {


                logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - No schedule found %s ',reqId,obj.CSDBScheduleId);
                callback(new Error('No record found'),undefined);
            }



        });
    }
    catch(ex)
    {
        //log.fatal("Exception : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching Schedule ", false, null);
        logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - Exception occurred when searching Schedule %s',reqId,obj.CSDBScheduleId);
        callback(ex,undefined);
    }

}



function PickValidAppointment(SID,reqId,callback) {

    var IsFound = false;
    logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  New appointment adding started  ',reqId);
    try
    {
        DbConn.Appointment
            .findAll({
                where: {ScheduleId: SID}
            }
        )
            .complete(function (errApp, resApp) {
                if (errApp) {


                    logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - error occurred while searching appointments  ',reqId,errApp);
                    callback(errApp, undefined);

                } else
                {
                    if (resApp.length==0) {

                        logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - No appointment data found  ',reqId);
                        callback(new Error('No record'),undefined);


                    } else {
                        logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Appointment data found  ',reqId,JSON.stringify(resApp));
                        try {


                            for (var index in resApp) {


                                logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Appointment data  ',reqId,JSON.stringify(resApp[index]));
                                if (resApp[index].StartDate == null || resApp[index].EndDate == null) {

                                    IsFound=true;
                                    callback(undefined,resApp[index]);
                                }
                                else {
                                    try {

                                        if (DateCheck(resApp[index],reqId)) {
                                            try {
                                                if (TimeCheck(resApp[index],reqId)) {
                                                    try {
                                                        if (DayCheck(resApp[index]),reqId) {

                                                            logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Appointment record found ',reqId,JSON.stringify(resApp[index]));

                                                            IsFound=true;
                                                            callback(undefined,resApp[index]);

                                                        }
                                                        else {
                                                            continue;
                                                        }
                                                    }
                                                    catch (ex) {

                                                        logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Exception occurred when Appointment day validating %s',reqId,resApp[index],ex);
                                                        callback('Error in Day check : '+ex,undefined);
                                                    }
                                                }
                                                else {
                                                    continue;
                                                }
                                            }
                                            catch (ex) {
                                                logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Exception occurred when Appointment time checking ',reqId,resApp[index],ex);
                                                callback('Error in Time check : '+ex,undefined);
                                            }
                                        }
                                        else {
                                            continue;
                                        }
                                    } catch (ex) {
                                        logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Exception occurred when Appointment date checking ',reqId,resApp[index],ex);
                                        callback('Error in Date check : '+ex,undefined);
                                    }

                                }


                            }
                            if(IsFound==false)
                            {
                                logger.error('[DVP-LimitHandler.CheckAvailables] - [%s]- Appointment is not found ',reqId);
                                callback(new Error("No maching record found"),undefined);
                            }

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




function DateCheck(req,reqId)
{
    logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  Date check starts - Data',reqId,JSON.stringify(req));
    try {

        if (req.StartDate == null && req.EndDate == null) {

            logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  Start Date and End time is not specified in Appointment %s  ',reqId,req.id);

            return true;

        }

        else {

            try {
                var x = moment(moment()).isBetween(req.StartDate, req.EndDate);
                if (x) {

                    logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  Today is a valid date for Appointment %s  ',reqId,req.id);
                    return true;
                }
                else {
                    logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] -  Date is not matched %s  ',reqId,req.id);
                    return false;
                }
            }
            catch(ex)
            {
                logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] -  Exception in Date validation algo. Appointment %s  ',reqId,req.id,ex);

                return false;
            }


        }
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] -  Exception in Date validation of Appointment %s  ',reqId,req.id,ex);
        return false;
    }
}

function TimeCheck(reslt,reqId)
{
    try {
        logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  Time validation of Appointment %s  ',reqId,reslt.id,JSON.stringify(reslt));
        var dblCTm = moment().format("HH:mm");
        var dblStTm = reslt.StartTime;
        var dblEdTm = reslt.EndTime;

        logger.debug("DVP-LimitHandler.PickValidAppointment] - [%s] - Time validation - Inputs :- StratTime :  %s EndTime : %s Current Time: %s",reqId,dblStTm,dblEdTm,dblCTm);
    }
    catch(ex)
    {
        logger.error("DVP-LimitHandler.PickValidAppointment] - [%s] - Exception in Time formatting - Inputs :- StratTime :  %s EndTime : %s Current Time: %s",reqId,dblStTm,dblEdTm,dblCTm,ex);
        return false;
    }

    if(reslt.StartTime == null && reslt.EndTime==null)
    {
        logger.debug("DVP-LimitHandler.PickValidAppointment] - [%s] - Start and EndTime is  not initiated",reqId );
        return true;

    }
    else if(reslt.StartTime == null || reslt.EndTime==null)
    {
        logger.debug("DVP-LimitHandler.PickValidAppointment] - [%s] - Start or EndTime is not initiated",reqId );

        return true;

    }
    else {

        if (dblCTm >= dblStTm && dblCTm < dblEdTm) {

            logger.debug("DVP-LimitHandler.PickValidAppointment] - [%s] - Valid time for Appointment %s",reqId,reslt.id );

            return true;


        }
        else {
            logger.error("DVP-LimitHandler.PickValidAppointment] - [%s] - Appointment time is invalid for CurrentTime ",reqId);
            return false;

        }
    }
}

function DayCheck(reslt,reqId)
{
    try {
        logger.debug("DVP-LimitHandler.PickValidAppointment] - [%s] -  Details of Appointment  ",reqId,JSON.stringify(reslt) );
        if (reslt.DaysOfWeek == null) {

            logger.debug("DVP-LimitHandler.PickValidAppointment] - [%s] -  Days are not initiated of Appointment  %s",reqId,reslt.id );
            return true;
        }

        else {

            try {
                var DaysArray = reslt.DaysOfWeek.split(",");
            }
            catch(ex)
            {
                logger.error("DVP-LimitHandler.PickValidAppointment] - [%s] -  Day seperation failed in  Appointment  %s",reqId,reslt.id,ex);
                return false;
            }

            try{
                var dt = moment(moment()).format('dddd');
            }
            catch(ex)
            {
                logger.error("DVP-LimitHandler.PickValidAppointment] - [%s] -  Current day picking failed",reqId,ex);
                return false;
            }


            if (DaysArray.indexOf(dt) > -1) {

                logger.debug("DVP-LimitHandler.PickValidAppointment] - [%s] -  Today is a valid day for Appointment %s",reqId,reslt.id);
                return true;
            }
            else {
                logger.error("DVP-LimitHandler.PickValidAppointment] - [%s] -  Today is not a valid day for Appointment %s ",reqId,reslt.id);
                return false;

            }
        }
    }
    catch(ex)
    {
        logger.error("DVP-LimitHandler.PickValidAppointment] - [%s] -  Exception in Day checking of Appointment %s ",reqId,reslt.id,ex);
        return false;
    }
}


//get :- done
function CheckAvailables(SID,Dt,Tm,cmp,ten,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.CheckAvailablesFor] - [%s]  - CheckAvailables starting  ',reqId);
    var ReqDate = Dt;
    var ReqDay = moment(Dt).format('dddd');
    var ReqTime = Tm;
    var IsFound=false;


    try {


        DbConn.Appointment
            .findAll({where:[{CompanyId:cmp},{TenantId:ten},{ScheduleId:SID}]}
        )
            .complete(function (err, result) {
                if (err) {

                    logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - [PGSQL]  - Errors occurred while searching appintments  ',reqId,ex);
                    callback(err, undefined);

                } else
                {
                    if (result.length==0) {
                        logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - [PGSQL] - No Appointment found  ',reqId,ex);
                        callback(new Error('No record found'), undefined);

                    } else {
                        try {

                            for (var index in result) {

                                if (result[index].StartDate == null || result[index].EndDate == null) {
                                    IsFound=true;
                                    callback(undefined,result[index]);
                                }
                                else{
                                    if (moment(ReqDate).isBetween(result[index].StartDate, result[index].EndDate)) {

                                        if (ReqTime >= result[index].StartTime && ReqTime < result[index].EndTime) {
                                            var DbDays = result[index].DaysOfWeek.split(',');

                                            if(DbDays.indexOf(ReqDay) > -1)
                                            {
                                                logger.debug('[DVP-LimitHandler.CheckAvailables] - [%s]- [PGSQL] - Appointment found %s  ', reqId, result[index].id);
                                                IsFound=true;
                                                callback(undefined, result[index]);
                                                break;
                                            }
                                            else
                                            {
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


                            }
                            if(IsFound==false)
                            {

                                logger.error('[DVP-LimitHandler.CheckAvailables] - [%s]- Appointment is not found ',reqId);
                                callback(new Error("No maching record found"),undefined);
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


//get :-done
function PickAppThroughSchedule(cmp,tent,dt,tm,SID,reqId,callback) {

    var IsFound=false;

    var dy= moment(dt).format('dddd');


    try {
        DbConn.Appointment
            .findAll({
                where: [{ScheduleId: SID},{CompanyId: cmp} ,{TenantId: tent}]
            }
        )
            .complete(function (err, resultapp) {
                if (err) {

                    logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - [PGSQL] - Error found while searching Appointment records of Schedule %s ',reqId,result[index].id,err);
                    callback(err,undefined);

                } else {
                    if (resultapp.length==0) {



                        logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - [PGSQL] - No records found while searching Appointment records of Schedule %s ',reqId,result[index].id);
                        callback(new Error("No Appointments found"), undefined);

                    } else {


                        for (var index in resultapp) {

                            if (resultapp[index].StartDate == null || resultapp[index].EndDate == null) {
                                IsFound=true;
                                callback(undefined, result[index]);
                            }
                            else {
                                if (moment(dt).isBetween(resultapp[index].StartDate, resultapp[index].EndDate)) {
                                    if (tm >= resultapp[index].StartTime && tm < resultapp[index].EndTime) {
                                        DbDays = resultapp[index].DaysOfWeek.split(',');

                                        if (DbDays.indexOf(dy) > -1) {


                                            logger.debug('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - Records found while searching Appointment records of Schedule  ', reqId, JSON.stringify(resultapp[index]));
                                            callback(undefined, resultapp[index]);


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

                        }

                        if(IsFound==false)
                        {

                            logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s]- Appointment is not found ',reqId);
                            callback(new Error("No maching record found"),undefined);
                        }

                    }
                }

            });

    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - - Exception occurred while searching Appointment records of Schedule ',reqId,JSON.stringify(result[index]),ex);
        callback(ex, undefined);
    }







}

//get :-done
function PickSchedule(SID,reqId,callback)
{

    try {

        DbConn.Schedule
            .findAll({
                where: {id: SID}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - Error occurred when searching for Schedule %s ',reqId,SID,err);
                    callback(err, undefined);

                } else
                {
                    if (result.length==0) {

                        logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - No record found for Schedule %s ',reqId,SID);
                        callback(new Error('No record'), undefined);

                    } else {
                        if(result.length==0)
                        {

                            callback(new Error('No record'), undefined);
                        }
                        else {
                            logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - Record found for Schedule ',reqId,SID);

                            callback(undefined, result);
                        }
                    }
                }

            });

    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - Exception occurred when starting method : PickSchedule ',reqId,SID);
        callback(ex,undefined);
    }
}

//get :-done
function PickScheduleAction(SID,reqId,callback)
{
    try {

        DbConn.Schedule
            .find({
                where: {id: SID}
            }
        )
            .complete(function (err, result) {
                if (err) {

                    logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - Error occurred while searching Schedule %s ',reqId,SID,err);
                    console.log('An error occurred while searching for Extension:', err);

                    callback(err, undefined);

                } else
                {
                    if (!result) {
                        logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - No record found for Schedule %s ',reqId,SID);
                        callback(new Error('No record'), undefined);

                    } else {


                        logger.debug('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - Record found for Schedule %s  -  Data - Id %s',reqId,SID);
                        callback(undefined, result.Action);

                    }
                }

            });
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - Exception occurred when starting method : PickScheduleAction  -  Data - Id %s',reqId,obj,ex);

        callback(ex,undefined);
    }
}

//get :-done
function PickApointment(AID,reqId,callback)
{

    try {

        DbConn.Appointment
            .findAll({
                where: {ScheduleId: AID}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    logger.error('[DVP-LimitHandler.LimitApi.PickAppointmentById] - [%s] - [PGSQL]  - Error occurred while searching for appointment for %s   ',reqId,AID,err);
                    callback(err, undefined);

                } else
                {
                    if (result.length == 0) {
                        logger.error('[DVP-LimitHandler.LimitApi.PickAppointmentById] - [%s] - [PGSQL]  - No record found for appointment %s   ',reqId,AID);
                        callback(new Error('No record'), undefined);


                    } else {
                        logger.debug('[DVP-LimitHandler.LimitApi.PickAppointmentById] - [%s] - [PGSQL]  - Record found appointment for %s   ',reqId,AID);
                        callback(undefined, result);


                    }
                }

            });
    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.LimitApi.PickAppointmentById] - [%s] - [PGSQL]  - Exception occurred when starting method :  PickAppointmentById   for %s',reqId,AID,ex);
        callback(ex,undefined);
    }

}

//get :-done
function PickApointmentAction(AID,reqId,callback)
{

    try {

        DbConn.Appointment
            .findAll({
                where: {id: AID}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    logger.error('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - Error occurred while searching appointments of Id %s  ',reqId,AID,err);var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    callback(err, undefined);

                } else
                {
                    if (result.length==0) {
                        logger.error('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - No record found for appointments of Id %s  ',reqId,AID);
                        callback(new Error('No record'), undefined);

                    } else {

                        logger.debug('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - Record found for appointments of Id %s  ',reqId,AID);
                        callback(undefined, result.Action);

                    }
                }

            });
    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - Exception occurred when starting method :  PickAppointmentAction ',reqId,AID,ex);
        callback(ex,undefined);
    }
}

//post :-done
function UpdateSchedule(SID,obj,reqId,callback)
{

    logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] -  New Schedule adding started  - Data %s',reqId,JSON.stringify(obj));
    try {
        DbConn.Schedule
            .find({
                where: {id: SID}
            }
        )
            .complete(function (err, result) {
                if (err) {

                    logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Error occurred while searching Schedule %s ',reqId,SID,err);
                    callback(err,undefined);

                }

                else{
                    if(result){
                        logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Record for Schedule %s  - Data %s',reqId,JSON.stringify(result));
                        try {
                            DbConn.Schedule
                                .update(
                                {

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
                                    logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Schedule %s is updated successfully  ',reqId,SID);
                                    callback(undefined,result);

                                }).error(function (err) {
                                    logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Error occurred while updating Schedule %s - data %s',reqId,SID,JSON.stringify(obj),err);

                                    callback(err,undefined);

                                });
                        }
                        catch (ex)
                        {
                            logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Exception occurred when  Schedule %s update starts - data %s',reqId,SID,JSON.stringify(obj),ex);
                            callback(ex,undefined);
                        }


                    }
                    else
                    {

                        logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] -  No record found for Schedule %s ',reqId,SID);var jsonString = messageFormatter.FormatMessage(err, "Null returns :no records : no errors", false, result);
                        callback(new Error('No record found'),undefied);


                    }

                }



            });
    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Exception occurred when Schedule %s searching starts - data %s',reqId,SID,JSON.stringify(obj),ex);
        callback(ex,undefined);
    }



}

//post :-done
function UpdateAppointment(AID,obj,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  UpdateAppointmentData starting  - Data %s AppId %s',reqId,JSON.stringify(obj),AID);

    try {

        DbConn.Appointment
            .find({
                where: {id: AID}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  Error occurred while searching Appointment %s ',reqId,AID,err);
                    callback(err, undefined);

                } else
                {
                    if (!result) {
                        logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] - No record found for Appointment %s ',reqId,AID);
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

                                    logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  Appointment %s updated successfully',reqId,AID);
                                    callback(undefined, results);

                                }).error(function (err) {
                                    logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  Error occurred while updating Appointment %s ',reqId,AID,err);
                                    callback(err, undefined);

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
function AssignAppointment(SID,AID,reqId,callback)
{

    try {

        DbConn.Schedule
            .find({
                where: {id: SID}
            }
        )
            .complete(function (err, result) {
                if (err) {
                    logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Error in searching Schedule %s ', reqId, SID, err);
                    callback(err, undefined);

                } else
                {
                    if (!result) {
                        logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - No records found for Schedule %s ', reqId, SID);
                        callback(new Error("No user with the Schedule id : " + SID + " has been found."), undefined);


                    }
                    else
                    {
                        logger.debug('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Record found for Schedule %s ', reqId, SID);
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

                                    logger.debug('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Updation succeeded of Schedule %s and Appointment %s', reqId, SID, AID);
                                    callback(undefined, results);

                                }).error(function (err) {

                                    logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Error in Updation of Schedule %s and Appointment %s', reqId, SID, AID, err);
                                    callback(err, undefined);


                                });
                        }
                        catch (ex) {
                            logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Exception in Updation of Schedule %s and Appointment %s', reqId, SID, AID, ex);
                            callback(ex, undefined);
                        }

                    }
                }

            });
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Exception in Startion method :AssignAppointment with Schedule %s and Appointment %s',reqId,SID,AID,ex);
        callback(ex,undefined);
    }

}

module.exports.CreateSchedule = CreateSchedule;
module.exports.CreateAppointment = CreateAppointment;
module.exports.UpdateSchedule = UpdateSchedule;
module.exports.AssignAppointment = AssignAppointment;
module.exports.PickValidAppointment = PickValidAppointment;
module.exports.CheckAvailables = CheckAvailables;
module.exports.UpdateAppointment = UpdateAppointment;
module.exports.PickAppThroughSchedule = PickAppThroughSchedule;
module.exports.PickSchedule = PickSchedule;
module.exports.PickScheduleAction = PickScheduleAction;
module.exports.PickApointmentAction = PickApointmentAction;
module.exports.PickApointment = PickApointment;



