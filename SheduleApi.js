
/**
 * Created by pawan on 2/12/2015.
 */


var DbConn = require('dvp-dbmodels');
var restify = require('restify');
var stringify=require('stringify');
var moment=require('moment');
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var config = require('config');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;



function CreateSchedule(req,Company,Tenant,reqId,callback) {
    logger.debug('[DVP-LimitHandler.CreateSchedule] - [%s] -  New Schedule adding started  ',reqId);

    if(req)
    {
        try{

            var obj=req;


            if(obj.ScheduleName)
            {
                try {
                    DbConn.Schedule.find({where: [{ScheduleName: obj.ScheduleName}]}).then(function(resSchedule)
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
                                        CompanyId: Company,
                                        TenantId: Tenant,
                                        Availability:obj.Availability


                                    }
                                )
                            }
                            catch (ex) {
                                logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - Exception occurred while formatting Scehdule data',reqId,ex);
                                callback(ex, undefined);
                            }

                            NewScheduleObject.save().then(function(resSave)
                            {
                                logger.debug('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - New Schedule added successfully',reqId);
                                callback(undefined, resSave);
                            }).catch(function(errSave)
                            {
                                logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - New Schedule saving failed',reqId,errSave);

                                callback(errSave, undefined);
                            });





                        }
                        else  {
                            logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - Schedule %s is alraedy in DB ',reqId,obj.ScheduleName);
                            callback(new Error('Already in DB'), undefined);
                        }

                    }).catch(function(errSchedule)
                    {

                        logger.error('[DVP-LimitHandler.CreateSchedule] - [%s] - [PGSQL] - Error occurred while searching existing schedules - Schedule :  %s',reqId,obj.ScheduleName,errSchedule);
                        callback(errSchedule, undefined);
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

function CreateAppointment(req,Days,Company,Tenant,reqId,callback) {
    logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] -  New appointment adding started  ',reqId);
    if(req)
    {
        try
        {
            var obj=req;
        }
        catch(ex)
        {

            logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] -  Exception occurred while saving request data as object %s  ',reqId,JSON.stringify(req.body),ex);
            callback(ex,undefined);
        }



        if(obj.ScheduleId && !isNaN(obj.ScheduleId))
        {
            try {
                DbConn.Schedule.find({where: {id: obj.ScheduleId}}).then(function (resSchedule) {

                    if(!resSchedule)
                    {
                        logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - No schedule found %s ',reqId,obj.CSDBScheduleId);
                        callback(new Error('No record found'),undefined);
                    }
                    else
                    {
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

                        AppObject.save().then(function (resSave) {

                            logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - New Appointment %s is added successfully',reqId,JSON.stringify(resSave));
                            resSchedule.addAppointment(AppObject).then(function (resMap) {

                                logger.debug('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - Schedule %s and appointment %s is mapped successfully',reqId,JSON.stringify(resSchedule),JSON.stringify(AppObject));
                                callback(undefined,resMap);

                            }).catch(function (errMap) {
                                logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - Schedule %s and appointment %s is mapped unsuccessful',reqId,JSON.stringify(resSchedule),JSON.stringify(AppObject),errMap);
                                callback(errMap,undefined);
                            });



                        }).catch(function (errSave) {
                            logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - New Appointment adding failed',reqId,errSave);
                            callback(errSave,undefined);
                        });



                    }

                }).catch(function (errSchedule) {

                    logger.error('[DVP-LimitHandler.CreateAppointment] - [%s] - [PGSQL] - Error occurred while searching existing schedules - ScheduleId :  %s',reqId,obj.ScheduleId,errSchedule);
                    callback(errSchedule,undefined);

                });




            }
            catch(ex)
            {

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

    logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  New appointment adding started  ',reqId);
    if(SID && !isNaN(SID))
    {
        try
        {
            DbConn.Appointment
                .findAll({
                    where: [{ScheduleId: SID},{CompanyId: Company} ,{TenantId: Tenant}]
                }
            ).then(function(resApp)
                {
                    if(resApp.length==0)
                    {
                        callback(new Error("No record for ScheduleID"),undefined);
                    }
                    else
                    {
                        for(var index in resApp)
                        {
                            var dy=resApp[index].DaysOfWeek.split(",");
                            var d=SetDayObjects(dy);
                            resApp[index].DaysOfWeek=d;
                        }


                        callback(undefined,resApp);
                    }
                }).catch(function(errApp)
                {
                    logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - error occurred while searching appointments  ',reqId,errApp);
                    callback(errApp, undefined);

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

function PickUnassignedAppointments(SID,Company,Tenant,reqId,callback) {

    logger.debug('[DVP-LimitHandler.PickValidAppointment] - [%s] -  New appointment adding started  ',reqId);
    if(SID && !isNaN(SID))
    {
        try
        {
            DbConn.Appointment
                .findAll({
                    where: [{ScheduleId: '0'},{CompanyId: Company} ,{TenantId: Tenant}]
                }
            ).then(function(resApp)
                {
                    if(resApp.length==0)
                    {
                        callback(new Error("No record for ScheduleID"),undefined);
                    }
                    else
                    {
                        for(var index in resApp)
                        {
                            var dy=resApp[index].DaysOfWeek.split(",");
                            var d=SetDayObjects(dy);
                            resApp[index].DaysOfWeek=d;
                        }
                        callback(undefined,resApp);
                    }
                }).catch(function(errApp)
                {
                    logger.error('[DVP-LimitHandler.PickValidAppointment] - [%s] - [PGSQL] - error occurred while searching appointments  ',reqId,errApp);
                    callback(errApp, undefined);
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
        ).then(function(resApp)
            {
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
            }).catch(function(errApp){
                logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - [PGSQL] - Error found while searching Appointment records of Schedule %s ',reqId,SID,errApp);
                callback(errApp,undefined);
            });



    }
    catch (ex) {
        logger.error('[DVP-LimitHandler.PickAppThroughSchedule] - [%s] - - Exception occurred while searching Appointment records of Schedule ',reqId,JSON.stringify(result[index]),ex);
        callback(ex, undefined);
    }







}

function PickSchedule(SID,Company,Tenant,reqId,callback) {

    if(SID && !isNaN(SID))
    {
        try {

            DbConn.Schedule
                .findAll({
                    where: [{id: SID},{CompanyId:Company},{TenantId:Tenant}]
                }
            ).then(function(resSchedule){
                    if (resSchedule.length==0) {

                        logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - No record found for Schedule %s ',reqId,SID);
                        callback(new Error('No Schedule record'), undefined);

                    }

                    else {
                        logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - Record found for Schedule ',reqId,SID);

                        callback(undefined, resSchedule);
                    }
                }).catch(function(errSchedule)
                {
                    logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - Error occurred when searching for Schedule %s ',reqId,SID,errSchedule);
                    callback(errSchedule, undefined);
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

function PickSchedules(Company,Tenant,reqId,callback) {
    try {

        DbConn.Schedule
            .findAll({
                where: [{CompanyId:Company},{TenantId:Tenant}]
            }
        ).then(function(resSchedule)
            {
                if (resSchedule.length==0) {

                    logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - No record found for Schedule',reqId);
                    callback(new Error('No Schedule record'), undefined);

                }

                else {
                    logger.debug('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - Records found ',reqId);

                    callback(undefined, resSchedule);
                }
            }).catch(function(errSchedule){
                logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - [PGSQL] - Error occurred when searching for Schedules ',reqId,errSchedule);
                callback(errSchedule, undefined);
            });



    }
    catch (ex)
    {
        logger.error('[DVP-LimitHandler.PickScheduleById] - [%s] - Exception occurred when starting method : PickSchedule ',reqId);
        callback(ex,undefined);
    }


}

function PickScheduleAction(SID,Company,Tenant,reqId,callback) {
    if(SID && !isNaN(SID) )
    {
        try {

            DbConn.Schedule
                .find({
                    where: [{id: SID},{CompanyId:Company},{TenantId:Tenant}]
                }
            ).then(function(resSchedule){

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

                }).catch(function(errSchedule)
                {
                    logger.error('[DVP-LimitHandler.PickScheduleActionById] - [%s] - [PGSQL]  - Error occurred while searching Schedule %s ',reqId,SID,errSchedule);
                    console.log('An error occurred while searching for Extension:', errSchedule);

                    callback(errSchedule, undefined);
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

function PickSchedulesByCompany(Company,Tenant,reqId,callback) {

    console.log(Company);
        try {

            DbConn.Schedule
                .findAll({
                    where: [{CompanyId:Company},{TenantId:Tenant}]
                }
            ).then(function(resSchedule){
                    if (resSchedule.length==0) {

                        logger.error('[DVP-LimitHandler.PickSchedulesByCompany] - [%s] - [PGSQL] - No Schedule record found for Company  %s ',reqId,Company);

                        callback(new Error('No Schedule record'), undefined);

                    }

                    else {
                        logger.debug('[DVP-LimitHandler.PickSchedulesByCompany] - [%s] - [PGSQL] - Record found for Schedules of Company %s',reqId,Company);

                        callback(undefined, resSchedule);
                    }
                }).catch(function(errSchedule)
                {
                    logger.error('[DVP-LimitHandler.PickSchedulesByCompany] - [%s] - [PGSQL] - Error occurred when searching for Schedule of Company %s ',reqId,Company,errSchedule);
                    callback(errSchedule, undefined);
                });



        }
        catch (ex)
        {
            logger.error('[DVP-LimitHandler.PickSchedulesByCompany] - [%s] - Exception occurred when starting method : PickSchedulesByCompany ',reqId);
            callback(ex,undefined);
        }


}

function PickAppointment(AID,Company,Tenant,reqId,callback) {

    if(AID && !isNaN(AID))
    {
        try {

            DbConn.Appointment
                .findAll({
                    where: [{ScheduleId: AID},{CompanyId:Company},{TenantId:Tenant}]
                }
            ).then(function(result)
                {

                    if (result.length == 0) {
                        logger.error('[DVP-LimitHandler.LimitApi.PickAppointmentById] - [%s] - [PGSQL]  - No record found for appointment %s   ',reqId,AID);
                        callback(new Error('No record'), undefined);


                    } else {
                        logger.debug('[DVP-LimitHandler.LimitApi.PickAppointmentById] - [%s] - [PGSQL]  - Record found appointment for %s   ',reqId,AID);
                        callback(undefined, result);

                    }


                }
            ).catch(function(err)
                {
                    logger.error('[DVP-LimitHandler.LimitApi.PickAppointmentById] - [%s] - [PGSQL]  - Error occurred while searching for appointment for %s   ',reqId,AID,err);
                    callback(err, undefined);
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

function PickAppointmentAction(AID,Company,Tenant,reqId,callback) {
    if(AID && !isNaN(AID))
    {
        try {

            DbConn.Appointment
                .find({
                    where: [{id: AID},{CompanyId:Company},{TenantId:Tenant}]
                }
            ).then(function(resAction){
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
                }).catch(function(errAction)
                {
                    logger.error('[DVP-LimitHandler.PickAppointmentAction] - [%s] - [PGSQL]  - Error occurred while searching appointments of Id %s  ',reqId,AID,errAction);var jsonString = messageFormatter.FormatMessage(errAction, "An error occurred while searching for Schedule:", false, resAction);
                    callback(errAction, undefined);
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

function UpdateSchedule(SID,obj,Company,Tenant,reqId,callback) {
    logger.debug('[DVP-LimitHandler.UpdateSchedule] - [%s] -  New Schedule adding started  - Data %s',reqId,JSON.stringify(obj));
    if(obj && SID && !isNaN(SID) )
    {

        try {
            DbConn.Schedule
                .find({
                    where: [{id: SID},{CompanyId:Company},{TenantId:Tenant}]
                }
            ).then(function(result)
                {
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

                                }).catch(function (err) {
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
                }).catch(function(err)
                {
                    logger.error('[DVP-LimitHandler.UpdateSchedule] - [%s] -  Error occurred while searching Schedule %s ',reqId,SID,err);
                    callback(err,undefined);
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

function UpdateAppointment(AID,obj,Company,Tenant,reqId,callback) {
    logger.debug('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  UpdateAppointmentData starting  - Data %s AppId %s',reqId,JSON.stringify(obj),AID);

    if(obj && !isNaN(AID) && AID )
    {
        try {

            DbConn.Appointment
                .find({
                    where: [{id: AID},{CompanyId:Company},{TenantId:Tenant}]
                }
            ).then(function(resApp){
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
                }).catch(function(errApp)
                {
                    logger.error('[DVP-LimitHandler.UpdateAppointmentData] - [%s] -  Error occurred while searching Appointment %s ',reqId,AID,errApp);
                    callback(errApp, undefined);
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

function AssignAppointment(SID,AID,Company,Tenant,reqId,callback) {
    if(SID && AID && !isNaN(SID) && !isNaN(AID))
    {
        try {

            DbConn.Schedule
                .find({
                    where:[ {id: SID},{CompanyId:Company},{TenantId:Tenant}]
                }
            ).then(function(resSchedule){
                    if (!resSchedule) {
                        logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - No records found for Schedule %s ', reqId, SID);
                        callback(new Error("No user with the Schedule id : " + SID + " has been found."), undefined);


                    }
                    else
                    {
                        logger.debug('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Record found for Schedule %s ', reqId, SID);



                        DbConn.Appointment
                            .find({
                                where:[ {id: AID},{CompanyId:Company},{TenantId:Tenant}]
                            }
                        ).then(function(resApp){
                                if(!resApp)
                                {
                                    logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Empty result returned for  Appointment  %s ', reqId, AID, errApp);
                                    callback(new Error("No record for Appointment "+AID), undefined);
                                }
                                else
                                {
                                    resApp.setSchedule(resSchedule).then(function(resMap)
                                    {
                                        callback(undefined,resMap);
                                    }).catch(function(errMap)
                                    {
                                        callback(errMap,undefined);
                                    });


                                }
                            }).catch(function(errApp)
                            {
                                logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Error in searching Appointment  %s  ', reqId, AID, errApp);
                                callback(errApp, undefined);
                            });


                    }
                }).catch(function(errSchedule){
                    logger.error('[DVP-LimitHandler.AssignAppointment] - [%s] - [PGSQL]  - Error in searching Schedule %s ', reqId, SID, errSchedule);
                    callback(errSchedule, undefined);
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

function SetDayObjects(dy) {
    if(dy)
    {
        var Obj={"Sunday":"false","Monday":"false","Tuesday":"false","Wednesday":"false","Thursday":"false","Friday":"false","Saturday":"false"};

        for(var index in dy)
        {

            Obj[dy[index].toString()]=true;
        }


        return Obj;
    }
}

function ValidateTime(result,Time,reqId) {
    try
    {
        var Tm=moment(new Date(Time)).utcOffset("00:00").format('HH:mm:ss');
        var ST= moment(new Date(result.StartTime)).utcOffset("00:00").format('HH:mm:ss');
        var ET= moment(new Date(result.EndTime)).utcOffset("00:00").format('HH:mm:ss');



        if(Tm>=ST && Tm<ET)
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

function CheckAvailables(SID,Dt,Tm,cmp,ten,reqId,callback) {

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
            ).then(function(resApp)
                {
                    if (resApp.length==0) {
                        logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - [PGSQL] - No Appointment found  ',reqId,ex);
                        callback(new Error('No record found'), undefined);

                    } else {

                        console.log("Size "+resApp.length);
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
                }).catch(function(errApp)
                {
                    logger.error('[DVP-LimitHandler.CheckAvailables] - [%s] - [PGSQL]  - Errors occurred while searching appintments  ',reqId,ex);
                    callback(errApp, undefined);

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


module.exports.CreateSchedule = CreateSchedule;
module.exports.CreateAppointment = CreateAppointment;
module.exports.UpdateSchedule = UpdateSchedule;
module.exports.AssignAppointment = AssignAppointment;
module.exports.PickValidAppointment = PickValidAppointment;
module.exports.CheckAvailables = CheckAvailables;
module.exports.UpdateAppointment = UpdateAppointment;
module.exports.PickAppThroughSchedule = PickAppThroughSchedule;
module.exports.PickSchedule = PickSchedule;
module.exports.PickSchedules = PickSchedules;
module.exports.PickScheduleAction = PickScheduleAction;
module.exports.PickAppointmentAction = PickAppointmentAction;
module.exports.PickAppointment = PickAppointment;
module.exports.PickUnassignedAppointments = PickUnassignedAppointments;
module.exports.PickSchedulesByCompany = PickSchedulesByCompany;



