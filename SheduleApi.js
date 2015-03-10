
/**
 * Created by pawan on 2/12/2015.
 */


var DbConn = require('./DVP-DBModels');
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
var messageFormatter = require('./DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');



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
function AddSchedule(req,res,err)
{
    try{
        var obj=req.body;
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, req);
        res.end(jsonString);
    }

    try {
        DbConn.Schedule.find({where: [{id: obj.CSDBScheduleId}]}).complete(function (err, ScheduleObject) {
            if (!err && ScheduleObject) {
                // console.log(cloudEndObject);

                var AppObject = DbConn.Appointment
                    .build(
                    {
                        AppointmentName: obj.AppointmentName,
                        Action: obj.Action,
                        ExtraData: obj.ExtraData,

                        StartDate: obj.StartDate,
                        EndDate: obj.EndDate,
                        StartTime: obj.StartTime,
                        EndTime: obj.EndTime,
                        DaysOfWeek: obj.DaysOfWeek,
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

                AppObject.save().complete(function (err,result) {
                    if (!err) {
                        //  ScheduleObject.addAppointment(AppObject).complete(function (errx, AppInstancex) {

                        var status = 1;


                        // res.write(status.toString());
                        // res.end();
                        //});

                        console.log("..................... Saved Successfully ....................................");
                        var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, result);
                        res.end(jsonString);

                    }
                    else {
                        console.log("..................... Error found in saving.................................... : " + err);
                        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                        res.end(jsonString);

                    }


                });




            }
            else if (!ScheduleObject) {
                console.log("................................... Given Cloud End User is invalid ................................ ");
                var jsonString = messageFormatter.FormatMessage(err, "EMPTY", false, result);
                res.end(jsonString);
            }
            else {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                res.end(jsonString);
            }

            return next();
        });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, null);
        res.end(jsonString);
    }



}

//get :-done
function FindValidAppoinment(req,res,err) {

    try
    {
    DbConn.Appointment
        .findAll({
            where: {AppointmentName: req}
        }
    )
        .complete(function (err, result) {
            if (!!err) {
                console.log('An error occurred while searching for Extension:', err);
                //logger.info( 'Error found in searching : '+err );
                var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                res.end(jsonString);

            } else if (!result) {
                console.log('No user with the Extension has been found.');
                ///logger.info( 'No user found for the requirement. ' );


                console.log("An error occurred in date searching process ");
                var jsonString = messageFormatter.FormatMessage(err, "EMPTY", ERROR, result);
                res.end(jsonString);


            } else {
                for (var index in result) {
                    if (result[index].StartDate == null || result[index].EndDate == null) {

                        // console.log('Null found');
                    }
                    else {
try{

                        if (DateCheck(result[index])) {
                            if (TimeCheck(result[index])) {
                                if (DayCheck(result[index])) {
                                    console.log('Record Found : ' + result[index].CSDB_Appointments);
                                    res.end(result[index].toJSON());
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
                    }catch(ex)
                    {
                        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, index);
                        res.end(jsonString);
                    }

                    }
                }

            }

        });

}
catch(ex)
{
    var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, result);
    res.end(jsonString);
}


}



function DateCheck(reslt)
{
    try {
        if (reslt.StartDate == null && reslt.EndDate == null) {
            return true;
            // console.log('Null found');

        }
        else if (reslt.StartDate == null || reslt.EndDate == null) {
            return false;
            console.log('Date error : null ');
        }
        else {

            var x = moment(moment()).isBetween(reslt.StartDate, reslt.EndDate);

            if (x) {
                return true;
            }
            else {
                console.log('Date error 2');
                return false;
            }
        }
    }
    catch(ex)
    {


    }
}

function TimeCheck(reslt)
{
    var dblCTm=moment().format("HH.mm");
    var dblStTm=reslt.StartTime;
    var dblEdTm=reslt.EndTime;

    if(reslt.StartTime == null && reslt.EndTime==null)
    {
        return true;
        // console.log('Null found');

    }
    else if(reslt.StartTime == null || reslt.EndTime==null)
    {
        return false;
        console.log('time null');
    }
    else {

        if (dblCTm >= dblStTm && dblCTm < dblEdTm) {
            return true;


        }
        else {
            return false;
            console.log('time range error');
        }
    }
}

function DayCheck(reslt)
{
    try {
        if (reslt.DaysOfWeek == null) {
            return true;
        }
        else {


            var DaysArray = reslt.DaysOfWeek.split(",");
            //  var str = "123, 124, 234,252";
            //var arr = str.split(",").map(function (val) { return +val + 1; });

            var dt = moment(moment()).format('dddd');
            console.log('Today is :' + dt);

            if (DaysArray.indexOf(dt) > -1) {
                return true;
            }
            else {
                return false;
                console.log('Days error ' + DaysArray);
            }
        }
    }
    catch(ex)
    {

    }
}


//get :- done
function CheckAvailables(dataz,res)
{
    try {
        var obj = dataz;
        var ReqDate = obj.Dt;
        var ReqDay = obj.Dy;
        var ReqTime = obj.Tm;
        var DaySt = false;
        var DbDays = null;

        var DaysArray = ReqDay.split(",");
    }
    catch (ex)
    {
        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, dataz);
        res.end(jsonString);
    }

try {

    DbConn.Appointment
        .findAll({}
    )
        .complete(function (err, result) {
            if (!!err) {
                console.log('An error occurred while searching for Extension:', err);
                //logger.info( 'Error found in searching : '+err );
                var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                res.end(jsonString);

            } else if (!result) {
                console.log('No user with the Extension has been found.');
                ///logger.info( 'No user found for the requirement. ' );
                var jsonString = messageFormatter.FormatMessage(err, "EMPTY", false, result);
                res.end(jsonString);

            } else {
                try {


                for (var index in result) {

                    if (moment(ReqDate).isBetween(result[index].StartDate, result[index].EndDate)) {
                        if (ReqTime >= result[index].StartTime && ReqTime < result[index].EndTime) {
                            DbDays = result[index].DaysOfWeek.split(',');

                            for (var dindex in DaysArray) {
                                //var dt = moment(DaysArray[dindex]).format('dddd');
                                if (DbDays.indexOf(DaysArray[dindex]) > -1) {
                                    DaySt = true;
                                }
                                else {
                                    DaySt = false;
                                }

                                //console.log('Today is :' + dt);


                            }

                            if (DaySt) {
                                console.log('Record Found' + result[index].id);

                                var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, result[index]);
                                res.end(jsonString);
                                break;
                            }
                            else {
                                console.log('No records Found');
                                res.end();
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

                res.end();
            }
                catch(ex)
                {
                    var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, index);
                    res.end(jsonString);
                }
            }

        });

}
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, null);
        res.end(jsonString);
    }

}

//post :-done
function UpdateScheduleID(obj,res)
{
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
                logger.info('Successfully Mapped. ');
                console.log(".......................mapping is succeeded ....................");
                var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, result);
                res.end(jsonString);

            }).error(function (err) {
                logger.info('mapping error found in saving. : ' + err);
                console.log("mapping failed ! " + err);
                //handle error here
                var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                res.end(jsonString);

            });

    }
        catch (ex)
        {
            var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, obj);
            res.end(jsonString);
        }

}

//get :-done
function PickAppThroughSchedule(obj,res) {

    try{
    DbConn.Schedule
        .findAll({
            where: [{CompanyId: obj.CompanyId} && {TenantId: obj.TenantId}], attributes: ['id']
        }
    )
        .complete(function (err, result) {
            if (!!err) {
                console.log('An error occurred while searching for Extension:', err);
                //logger.info( 'Error found in searching : '+err );
                var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                res.end(jsonString);
            } else if (!result) {
                console.log('No user with the Extension has been found.');
                ///logger.info( 'No user found for the requirement. ' );
                var jsonString = messageFormatter.FormatMessage(err, "EMPTY", false, result);
                res.end(jsonString);

            } else {


                for (var index in result) {

                    try {
                        DbConn.Appointment
                            .findAll({
                                where: [{CSDBScheduleId: result[index].id}]
                            }
                        )
                            .complete(function (err, resultapp) {
                                if (!!err) {
                                    console.log('An error occurred while searching for Extension:', err);
                                    //logger.info( 'Error found in searching : '+err );

                                } else if (!resultapp) {
                                    console.log('No user with the Extension has been found.');
                                    ///logger.info( 'No user found for the requirement. ' );
                                    var jsonString = messageFormatter.FormatMessage(err, "EMPTY", false, resultapp);
                                    res.end(jsonString);

                                } else {


                                    for (var index in resultapp) {
                                        if (moment(obj.ReqDate).isBetween(resultapp[index].StartDate, resultapp[index].EndDate)) {
                                            if (obj.ReqTime >= resultapp[index].StartTime && obj.ReqTime < resultapp[index].EndTime) {
                                                DbDays = resultapp[index].DaysOfWeek.split(',');


                                                //var dt = moment(DaysArray[dindex]).format('dddd');
                                                if (DbDays.indexOf(obj.ReqDay) > -1) {
                                                    DaySt = true;
                                                }
                                                else {
                                                    DaySt = false;
                                                }

                                                //console.log('Today is :' + dt);


                                                if (DaySt) {
                                                    var Jresults = result[index].map(function (result) {
                                                        console.log(result.toJSON());
                                                        return result.toJSON()
                                                    });
                                                    break;
                                                }
                                                else {
                                                    console.log('No records Found');
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

                                    res.end();
                                }

                            });

                    }
                    catch(ex)
                    {
                        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, result[index]);
                        res.end(jsonString);
                    }
                }

            }

        });
}

}

//get :-done
function PickSchedule(obj,res)
{
    try {
        DbConn.Schedule
            .findAll({
                where: {id: obj.id}
            }
        )
            .complete(function (err, result) {
                if (!!err) {
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );

                    console.log('Empty found....................');
                    var jsonString = messageFormatter.FormatMessage(err, "EMPTY", false, result);
                    res.end(jsonString);

                } else {

                    var Jresults = result.map(function (result) {
                        console.log(result.toJSON());
                        return result.toJSON()
                    });

                }

            });
        res.end();
    }
    catch (ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, resultapp);
        res.end(jsonString);
    }
}

//get :-done
function PickScheduleAction(obj,res)
{
    try {
        DbConn.Schedule
            .findAll({
                where: {id: obj.id}
            }
        )
            .complete(function (err, result) {
                if (!!err) {
                    console.log('An error occurred while searching for Extension:', err);
                    var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                    res.end(jsonString);
                    //logger.info( 'Error found in searching : '+err );

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "EMPTY", false, result);
                    res.end(jsonString);

                } else {


                    var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, result);
                    res.end(jsonString);

                }

            });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, obj);
        res.end(jsonString);
    }
}

//get :-done
function PickApointment(obj,res)
{
    try {
        DbConn.Schedule
            .findAll({
                where: {id: obj.id}
            }
        )
            .complete(function (err, result) {
                if (!!err) {
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(ex, "EMPTY", false, result);
                    res.end(jsonString);


                } else {

                    var Jresults = result.map(function (result) {
                        console.log(result.toJSON());
                        return result.toJSON()
                    });

                    //console.log(result.Action)

                }

            });
    }
    catch (ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, obj);
        res.end(jsonString);
    }

}

//get :-done
function PickApointmentAction(obj,res)
{
    try {
        DbConn.Schedule
            .findAll({
                where: {id: obj.id}
            }
        )
            .complete(function (err, result) {
                if (!!err) {
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "EMPTY", false, result);
                    res.end(jsonString);

                } else {


                    var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, result);
                    res.end(jsonString);

                }

            });
    }
    catch (ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, obj);
        res.end(jsonString);
    }
}

//post :-done
function UpdateScheduleData(obj,res)
{
    try {
        DbConn.Schedule
            .update(
            {
                ScheduleName: obj.ScheduleName,
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
                logger.info('Successfully Mapped. ');
                console.log(".......................mapping is succeeded ....................");
                var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, result);
                res.end(jsonString);

            }).error(function (err) {
                logger.info('mapping error found in saving. : ' + err);
                console.log("mapping failed ! " + err);

                var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                res.end(jsonString);
                //handle error here

            });
    }
    catch (ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, obj);
        res.end(jsonString);
    }
    return next();
}

//post :-done
function UpdateAppoinmentData(obj,res)
{
    try {
        DbConn.Appointment
            .update(
            {
                AppointmentName: obj.AppointmentName,
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
        ).then(function (result) {
                logger.info('Successfully Mapped. ');
                console.log(".......................mapping is succeeded ....................");
                var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, result);
                res.end(jsonString);

            }).error(function (err) {
                logger.info('mapping error found in saving. : ' + err);
                console.log("mapping failed ! " + err);
                var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                res.end(jsonString);
                //handle error here

            });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, obj);
        res.end(jsonString);
    }
    return next();
}

//post:-done
function UpdateScheduleIDAppointment(obj,res)
{
    try {
        DbConn.Schedule
            .findAll({
                where: {id: obj.id}, attributes: ['id']
            }
        )
            .complete(function (err, result) {
                if (!!err) {
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "EMPTY", false, result);
                    res.end(jsonString);


                } else {

                    try{
                    DbConn.Appointment
                        .update(
                        {
                            CSDBScheduleId: obj.id


                        },
                        {
                            where: [{id: obj.AppID}]
                        }
                    ).then(function (result) {
                            logger.info('Successfully Mapped. ');
                            console.log(".......................mapping is succeeded ....................");
                            var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, result);
                            res.end(jsonString);

                        }).error(function (err) {
                            logger.info('mapping error found in saving. : ' + err);
                            console.log("mapping failed ! " + err);
                            var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, result);
                            res.end(jsonString);
                            //handle error here

                        });
                }
                catch(ex)
                {
                    var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, null);
                    res.end(jsonString);
                }

                }

            });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, obj);
        res.end(jsonString);
    }
    return next();
}

module.exports.AddSchedule = AddSchedule;
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


