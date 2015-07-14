
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

    if(req.body)
    {
        try{

            var obj=req.body;


            if(obj.ScheduleName)
            {
                try {
                    DbConn.Schedule.find({where: [{ScheduleName: obj.ScheduleName}]}).complete(function (errSchedule, resSchedule) {

                        if (errSchedule) {
                            logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - Error occurred while searching existing schedules - Schedule :  %s',reqId,obj.ScheduleName,errSchedule);
                            callback(errSchedule, undefined);
                        }

                        else
                        {
                            if (!resSchedule) {


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


                                        }
                                    )
                                }
                                catch (ex) {
                                    logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - Exception occurred while formatting Scehdule data',reqId,ex);
                                    callback(ex, undefined);
                                }

                                NewScheduleObject.save().complete(function (errSave, resSave) {

                                    if(errSave)
                                    {
                                        logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - New Schedule saving failed',reqId,errSave);

                                        callback(errSave, undefined);
                                    }

                                    else
                                    {

                                        logger.debug('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - New Schedule added successfully',reqId);
                                        callback(undefined, resSave);

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
                    logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - Exception occurred when Schedule searching starts',reqId,ex);
                    callback(ex,undefined);
                }
            }
            else
            {
                logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - ScheduleName is Undefined');
                callback(new Error("ScheduleName is Undefined"),undefined);
            }


        }
        catch(ex)
        {
            logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] -  Exception occurred while saving request data as object %s  ',reqId,JSON.stringify(req.body),ex);
            callback(ex,undefined);
        }
    }
    else
    {
        callback(new Error("Empty request body"),undefined);
    }







}

function CreateAppointment(req,Days,Company,Tenant,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] -  New appointment adding started  ',reqId);
    if(req.body)
    {
        try{
            var obj=req.body;


        }
        catch(ex)
        {

            logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] -  Exception occurred while saving request data as object %s  ',reqId,JSON.stringify(req.body),ex);
            callback(ex,undefined);
        }

        if(obj.ScheduleId && !isNaN(obj.ScheduleId))
        {
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
                                    DaysOfWeek:Days,
                                    ObjClass: "OBJCLZ",
                                    ObjType: "OBJTYP",
                                    ObjCategory: "OBJCAT",
                                    CompanyId: Company,
                                    TenantId: Tenant


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
                                ScheduleObject.addAppointment(AppObject).complete(function (errMap, resMap) {

                                    if(errMap)
                                    {
                                        logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - Schedule %s and appointment %s is mapped unsuccessful',reqId,JSON.stringify(ScheduleObject),JSON.stringify(AppObject),errMap);
                                        callback(errMap,undefined);
                                    }
                                    else
                                    {

                                        logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - Schedule %s and appointment %s is mapped successfully',reqId,JSON.stringify(ScheduleObject),JSON.stringify(AppObject));
                                        callback(undefined,resMap);
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

                logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - Exception occurred when searching Schedule ',reqId);
                callback(ex,undefined);
            }
        }
        else
        {
            logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - ScheduleId is Undefined');
            callback(new Error("ScheduleId is Undefined"),undefined);
        }

    }else
    {
        callback(new Error("Empty request body"),undefined);
    }



}



function PickValidAppointment(SID,Company,Tenant,reqId,callback) {

    var IsFound = false;
    logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  New appointment adding started  ',reqId);
   if(SID && !isNaN(SID))
   {
       try
       {
           DbConn.Appointment
               .findAll({
                   where: [{ScheduleId: SID},{CompanyId: Company} ,{TenantId: Tenant}]
               }
           )
               .complete(function (errApp, resApp) {
                   if (errApp) {


                       logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - error occurred while searching appointments  ',reqId,errApp);
                       callback(errApp, undefined);

                   } else
                   {
                       if(resApp.length==0)
                       {
                           callback(new Error("No record for ScheduleID"),undefined);
                       }
                       else
                       {//var i=1;
                           for(var index in resApp)
                           {

                               //console.log(i);
                              // i++;
                               //var dy=resApp[index].DaysOfWeek.split(",");

                               var dy=resApp[index].DaysOfWeek.split(",");
                               //console.log(dy);
                               var d=SetDayObjects(dy);
                               resApp[index].DaysOfWeek=d;
                           }
                           //console.log("DATAAA "+resApp[0].StartTime.toGMTString());
                          // console.log(moment(resApp[0].StartTime.toGMTString()).zone("00:00").format('HH:mm:ss'));

                           callback(undefined,resApp);
                       }
                       /*if (resApp.length==0) {

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
                        */

                   }

               });

       }
       catch(ex)
       {
           logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - Exception on method start : FindValidAppointment ',reqId,ex);
           callback(new Error("Exception : "+ex),undefined);
       }

   }
    else
   {
       logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - ScheduleID is Undefined');
       callback(new Error("ScheduleID is Undefined"),undefined);
   }


}



function SetDayObjects(dy)
{
    if(dy)
    {
        var Obj={"Sunday":"false","Monday":"false","Tuesday":"false","Wednesday":"false","Thursday":"false","Friday":"false","Saturday":"false"};

        for(var index in dy)
        {
           // Obj.dy[index].val="true";
            //console.log(Obj[dy[index].toString()]);


            Obj[dy[index].toString()]=true;
        }


        return Obj;
    }
}


function DateCheck(req,reqId)
{
    logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  Date check starts - Data',reqId,JSON.stringify(req));
    if(req)
    {
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
    else
    {
        return false;
    }


}

function TimeCheck(reslt,Time,reqId)
{
    if(reslt)
    {
        try {
            logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  Time validation of Appointment %s  ',reqId,reslt.id,JSON.stringify(reslt));
            //var dblCTm = moment().format("HH:mm");
            var dblCTm =new Date().toGMTString();
            var dblStTm = reslt.StartTime.toGMTString();
            var dblEdTm = reslt.EndTime.toGMTString();

            /*var x= moment(dblCTm).format("HH:mm");
             console.log("Format Now  "+x);
             var y= moment(dblStTm).format("HH:mm");
             console.log("Format Start  "+y);
             var z= moment(dblEdTm).format("HH:mm");
             console.log("Format End  "+z);
             */
            console.log("Now "+dblCTm);
            console.log("ST "+dblStTm);
            console.log("ED "+dblEdTm);
            //var n=moment(x).isBetween(y, z);
            //console.log("Between "+n);

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
    else
    {
        return false;
    }

}

function DayCheck(reslt,reqId)
{
    if(reslt)
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
    else
    {
        return false;
    }

}


function ValidateTime(result,Time,reqId)
{
    try
    {
        var Tm= moment(Time).zone("00:00");

        var ST= moment(result.StartTime.toGMTString()).zone("00:00").format('HH:mm:ss');
        var ET= moment(result.EndTime.toGMTString()).zone("00:00").format('HH:mm:ss');

        if(moment(Tm).isBetween(ST,ET))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    catch(ex)
    {
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

if(SID&&Dt&&Tm && !isNaN(SID))
{
    try {


        DbConn.Appointment
            .findAll({where:[{CompanyId:cmp},{TenantId:ten},{ScheduleId:SID}]}
        )
            .complete(function (errApp, resApp) {
                if (errApp) {

                    logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - [PGSQL]  - Errors occurred while searching appintments  ',reqId,ex);
                    callback(errApp, undefined);

                } else
                {
                    if (resApp.length==0) {
                        logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - [PGSQL] - No Appointment found  ',reqId,ex);
                        callback(new Error('No record found'), undefined);

                    } else {
                        try {

                            for (var index in resApp) {

                                console.log(JSON.stringify(resApp[index]));
                                if ((resApp[index].StartDate == null || resApp[index].EndDate == null) && resApp[index].DaysOfWeek == null ) {
                                    IsFound=true;

                                    var d=SetDayObjects(resApp[index].DaysOfWeek);
                                    resApp[index].DaysOfWeek=d;
                                    callback(undefined,resApp[index]);
                                }
                                else{

                                    if (moment(ReqDate).isBetween(resApp[index].StartDate, resApp[index].EndDate)) {

                                        var TmVal=ValidateTime(resApp[index],ReqTime,reqId);
                                        //if (ReqTime >= result[index].StartTime && ReqTime < result[index].EndTime) {
                                        if (TmVal) {
                                            var DbDays = resApp[index].DaysOfWeek.split(',');

                                            if(DbDays.indexOf(ReqDay) > -1)
                                            {
                                                logger.debug('[DVP-LimitHandler.CheckAvailables] - [%s]- [PGSQL] - Appointment found %s  ', reqId, resApp[index].id);
                                                IsFound=true;
                                                //var d=SetDayObjects(DbDays);
                                                //result[index].DaysOfWeek=dy;
                                                callback(undefined, resApp[index]);
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
    else
{
    logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - ScheduleID is Undefined');
    callback(new Error("ScheduleID or Date Or Time is Undefined"),undefined);
}



}

//post :-done


//get :-done
function PickAppThroughSchedule(cmp,tent,dt,tm,SID,reqId,callback) {

    var IsFound=false;

    try
    {
        var dy= moment(dt).format('dddd');
    }
    catch(ex)
    {
        logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - [MOMENT] - Exception found while Getting Day byDate %s ',reqId,dt,ex);
        callback(ex,undefined);
    }



    try {
        DbConn.Appointment
            .findAll({
                where: [{ScheduleId: SID},{CompanyId: cmp} ,{TenantId: tent}]
            }
        )
            .complete(function (errApp, resApp) {
                if (errApp) {

                    logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - [PGSQL] - Error found while searching Appointment records of Schedule %s ',reqId,SID,errApp);
                    callback(errApp,undefined);

                } else {
                    if (resApp.length==0) {



                        logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - [PGSQL] - No records found while searching Appointment records of Schedule %s ',reqId,SID);
                        callback(new Error("No Appointments found"), undefined);

                    } else {


                        for (var index in resApp) {

                            if (resApp[index].StartDate == null || resApp[index].EndDate == null) {
                                IsFound=true;
                                callback(undefined, result[index]);
                            }
                            else {
                                if (moment(dt).isBetween(resApp[index].StartDate, resApp[index].EndDate)) {
                                    if (tm >= resApp[index].StartTime && tm < resApp[index].EndTime) {
                                        DbDays = resApp[index].DaysOfWeek.split(',');

                                        if (DbDays.indexOf(dy) > -1) {


                                            logger.debug('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - Records found while searching Appointment records of Schedule  ', reqId, JSON.stringify(resApp[index]));
                                            callback(undefined, resApp[index]);


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
function PickSchedule(SID,Company,Tenant,reqId,callback)
{
if(SID && !isNaN(SID))
{
    try {

        DbConn.Schedule
            .findAll({
                where: [{id: SID},{CompanyId:Company},{TenantId:Tenant}]
            }
        )
            .complete(function (errSchedule, resSchedule) {
                if (errSchedule) {
                    logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - Error occurred when searching for Schedule %s ',reqId,SID,errSchedule);
                    callback(errSchedule, undefined);

                } else
                {
                    if (resSchedule.length==0) {

                        logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - No record found for Schedule %s ',reqId,SID);
                        callback(new Error('No Schedule record'), undefined);

                    }

                    else {
                        logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - Record found for Schedule ',reqId,SID);

                        callback(undefined, resSchedule);
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
    else
{
    logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - ScheduleID is Undefined');
    callback(new Error("ScheduleID is Undefined"),undefined);
}

}

//get :-done
function PickScheduleAction(SID,Company,Tenant,reqId,callback)
{
    if(SID && !isNaN(SID) )
    {
        try {

            DbConn.Schedule
                .find({
                    where: [{id: SID},{CompanyId:Company},{TenantId:Tenant}]
                }
            )
                .complete(function (errSchedule, resSchedule) {
                    if (errSchedule) {

                        logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - Error occurred while searching Schedule %s ',reqId,SID,errSchedule);
                        console.log('An error occurred while searching for Extension:', errSchedule);

                        callback(errSchedule, undefined);

                    } else
                    {
                        if (!resSchedule)
                        {
                            logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - No record found for Schedule %s ',reqId,SID);
                            callback(new Error('No Schedule record'), undefined);

                        }
                        else
                        {


                            logger.debug('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - Record found for Schedule %s  -  Data - ',reqId,SID,JSON.stringify(resSchedule));
                            callback(undefined, resSchedule.Action);

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
    else
    {
        logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - ScheduleID is Undefined');
        callback(new Error("ScheduleID is Undefined or Value is in Invalid format"),undefined);
    }

}

//get :-done
function PickAppointment(AID,Company,Tenant,reqId,callback)
{

    if(AID && !isNaN(AID))
    {
        try {

            DbConn.Appointment
                .findAll({
                    where: [{ScheduleId: AID},{CompanyId:Company},{TenantId:Tenant}]
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

                            /*for(var index in result)
                            {

                                //console.log(i);
                                // i++;
                                //var dy=resApp[index].DaysOfWeek.split(",");

                                var dy=result[index].DaysOfWeek.split(",");
                                //console.log(dy);
                                var d=SetDayObjects(dy);
                                result[index].DaysOfWeek=d;
                            }*/

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
    else
    {
        logger.error('[DVP-LimitHandler.PickAppointmentById] - [%s] - ScheduleID is Undefined');
        callback(new Error("ScheduleID is Undefined or Not in Correct Format"),undefined);
    }



}

//get :-done
function PickAppointmentAction(AID,Company,Tenant,reqId,callback)
{
if(AID && !isNaN(AID))
{
    try {

        DbConn.Appointment
            .find({
                where: [{id: AID},{CompanyId:Company},{TenantId:Tenant}]
            }
        )
            .complete(function (errAction, resAction) {
                if (errAction) {
                    logger.error('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - Error occurred while searching appointments of Id %s  ',reqId,AID,errAction);var jsonString = messageFormatter.FormatMessage(errAction, "An error occurred while searching for Schedule:", false, resAction);
                    callback(errAction, undefined);

                } else
                {
                    if (!resAction)
                    {
                        logger.error('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - No record found for appointments of Id %s  ',reqId,AID);
                        callback(new Error('No record'), undefined);

                    }
                    else
                    {

                        logger.debug('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - Record found for appointments of Id %s  ',reqId,AID);
                        callback(undefined, resAction.Action);

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
    else
{
    logger.error('[DVP-LimitHandler.PickAppointmentAction] - [%s] - AppointmentID is Undefined');
    callback(new Error("AppointmentID is Undefined or Not in correct format"),undefined);
}

}

//post :-done
function UpdateSchedule(SID,obj,Company,Tenant,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] -  New Schedule adding started  - Data %s',reqId,JSON.stringify(obj));
    if(obj && SID && !isNaN(SID) )
    {

        try {
            DbConn.Schedule
                .find({
                    where: [{id: SID},{CompanyId:Company},{TenantId:Tenant}]
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
    else
    {
        callback(new Error("Empty Request or Undefined ScheduleID"),undefined);
    }







}

//post :-done
function UpdateAppointment(AID,obj,Company,Tenant,reqId,callback)
{
    logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  UpdateAppointmentData starting  - Data %s AppId %s',reqId,JSON.stringify(obj),AID);

    if(obj && !isNaN(AID) && AID )
    {
        try {

            DbConn.Appointment
                .find({
                    where: [{id: AID},{CompanyId:Company},{TenantId:Tenant}]
                }
            )
                .complete(function (errApp, resApp) {
                    if (errApp) {
                        logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  Error occurred while searching Appointment %s ',reqId,AID,errApp);
                        callback(errApp, undefined);

                    } else
                    {
                        if (!resApp) {
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
                                ).then(function (resUpdate) {

                                        logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  Appointment %s updated successfully',reqId,AID);
                                        callback(undefined, resUpdate);

                                    }).error(function (errUpdate) {
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
    else
    {
        callback(new Error("Empty Request or Undefined AppointmentID"),undefined);
    }


}

//post:-done
function AssignAppointment(SID,AID,Company,Tenant,reqId,callback)
{
if(SID && AID && !isNaN(SID) && !isNaN(AID))
{
    try {

        DbConn.Schedule
            .find({
                where:[ {id: SID},{CompanyId:Company},{TenantId:Tenant}]
            }
        )
            .complete(function (errSchedule, resSchedule) {
                if (errSchedule) {
                    logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Error in searching Schedule %s ', reqId, SID, errSchedule);
                    callback(errSchedule, undefined);

                } else
                {
                    if (!resSchedule) {
                        logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - No records found for Schedule %s ', reqId, SID);
                        callback(new Error("No user with the Schedule id : " + SID + " has been found."), undefined);


                    }
                    else
                    {
                        logger.debug('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Record found for Schedule %s ', reqId, SID);
                        /*try {
                            DbConn.Appointment
                                .update(
                                {
                                    ScheduleId: SID

                                },
                                {
                                    where: [{id: AID},{CompanyId:Company},{TenantId:Tenant}]
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
                        }*/

                        DbConn.Appointment
                            .find({
                                where:[ {id: AID},{CompanyId:Company},{TenantId:Tenant}]
                            }
                        ).complete(function(errApp,resApp)
                            {
                                if(errApp)
                                {
                                    logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Error in searching Appointment  %s  ', reqId, AID, errApp);
                                    callback(errApp, undefined);
                                }
                                else
                                {
                                    if(!resApp)
                                    {
                                        logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Empty result returned for  Appointment  %s ', reqId, AID, errApp);
                                        callback(new Error("No record for Appointment "+AID), undefined);
                                    }
                                    else
                                    {
                                        resApp.setSchedule(resSchedule).complete(function(errMap,resMap)
                                        {
                                            if(errMap)
                                            {
                                                callback(errMap,undefined);
                                            }
                                            else
                                            {
                                                callback(undefined,resMap);
                                            }
                                        })
                                    }
                                }
                            })
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
    else
{
    logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - SceduleID or AppointmentID is Undefined');
    callback(new Error("SceduleID or AppointmentID is Undefined"),undefined);
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
module.exports.PickAppointmentAction = PickAppointmentAction;
module.exports.PickAppointment = PickAppointment;



