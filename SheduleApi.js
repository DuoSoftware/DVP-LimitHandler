
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
function AddSchedule(req,res)
{
    try{
        var obj=req.body;
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found in object creating from req body", false, req);
        res.end(jsonString);
    }

    try {
        DbConn.Schedule.find({where: [{id: obj.id}]}).complete(function (err, ScheduleObject) {
            if (!err && ScheduleObject==null) {
                // console.log(cloudEndObject);
                try {
                    var AppObject = DbConn.Schedule
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
                catch(ex)
                {
                    var jsonString = messageFormatter.FormatMessage(ex, "Exception found in building appointment objecty", false, req);
                    res.end(jsonString);
                }

                AppObject.save().complete(function (err,result) {
                    if (!err) {
                        //  ScheduleObject.addAppointment(AppObject).complete(function (errx, AppInstancex) {

                        var status = 1;


                        // res.write(status.toString());
                        // res.end();
                        //});

                        console.log("..................... Saved Successfully ....................................");
                        var jsonString = messageFormatter.FormatMessage(err, "AppObject saved successfully ", true, result);
                        res.end(jsonString);

                    }
                    else {
                        console.log("..................... Error found in saving.................................... : " + err);
                        var jsonString = messageFormatter.FormatMessage(err, "AppObject saving error", false, result);
                        res.end(jsonString);

                    }


                });




            }
            else if (!ScheduleObject) {
                console.log("................................... Given Cloud End User is invalid ................................ ");
                var jsonString = messageFormatter.FormatMessage(null, "null object returned as shedule search result for : "+obj.CSDBScheduleId, false, ScheduleObject);
                res.end(jsonString);
            }
            else {
                var jsonString = messageFormatter.FormatMessage(err, "Some error occured", false, null);
                res.end(jsonString);
            }

            //  return next();
        });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching Schedule ", false, null);
        res.end(jsonString);
    }



}
//post :- done
function AddAppointment(req,res
)
{
    try{
        var obj=req.body;
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found in object creating from req body", false, req);
        res.end(jsonString);
    }

    try {
        DbConn.Schedule.find({where: [{id: obj.CSDBScheduleId}]}).complete(function (err, ScheduleObject) {
            if (!err && ScheduleObject) {
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
                }
                catch(ex)
                {
                    var jsonString = messageFormatter.FormatMessage(ex, "Exception found in building appointment objecty", false, req);
                    res.end(jsonString);
                }

                AppObject.save().complete(function (err,result) {
                    if (!err) {

                        console.log("Saving succeeded ");
                        ScheduleObject.addAppointment(AppObject).complete(function (errx, AppObjIntex) {

                            if(AppObjIntex)
                            {
                                var jsonString = messageFormatter.FormatMessage(null, "Mapping is succeeded ", true, AppObjIntex);
                                res.end(jsonString);
                            }
                            else
                            {
                                var jsonString = messageFormatter.FormatMessage(errx, "Mapping is failed ", false, null);
                                res.end(jsonString);
                            }




                            // res.write(status.toString());
                            // res.end();
                        });


                    }
                    else {

                        var jsonString = messageFormatter.FormatMessage(err, "saving is failed ", false, null);
                        res.end(jsonString);
                    }


                });




            }
            else if (!ScheduleObject) {
                console.log("................................... Given Cloud End User is invalid ................................ ");
                var jsonString = messageFormatter.FormatMessage(null, "null object returned as shedule search result for : "+obj.CSDBScheduleId, false, ScheduleObject);
                res.end(jsonString);
            }
            else {
                var jsonString = messageFormatter.FormatMessage(err, "Some error occured", false, null);
                res.end(jsonString);
            }

            //  return next();
        });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching Schedule ", false, null);
        res.end(jsonString);
    }

}


//get :-done
function FindValidAppoinment(req,res,err) {

    try
    {
        DbConn.Appointment
            .findAll({
               // where: {id: req}
            }
        )
            .complete(function (err, result) {
                if (!!err) {
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "Error in searching : "+req, false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );


                    console.log("An error occurred in date searching process ");
                    var jsonString = messageFormatter.FormatMessage(err, "Null object returened as result for : "+req, false, result);
                    res.end(jsonString);


                } else {
                    try{

                       // var index=
                        for (var index in result) {
                            if (result[index].StartDate == null || result[index].EndDate == null) {

                                // console.log('Null found');
                            }
                            else {
                                try {

                                    if (DateCheck(result[index])) {
                                        try{
                                            if (TimeCheck(result[index])) {
                                                try{
                                                    if (DayCheck(result[index])) {
                                                        console.log('Record Found : ' + result[index]);

                                                        var jsonString = messageFormatter.FormatMessage(null, "Successfully Found ", true, jsonString);
                                                        res.end(jsonString);
                                                        // res.end(result[index]);
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                catch(ex)
                                                {
                                                    var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching DayCheck ", false, null);
                                                    res.end(jsonString);
                                                }
                                            }
                                            else {
                                                continue;
                                            }
                                        }
                                        catch(ex)
                                        {
                                            var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching TimeCheck ", false, null);
                                            res.end(jsonString);
                                        }
                                    }
                                    else {
                                        continue;
                                    }
                                } catch (ex) {
                                    var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching DateCheck ", false, null);
                                    res.end(jsonString);
                                }

                            }
                        }
                        var jsonString = messageFormatter.FormatMessage(null, "Record finished : No recode found ", false, null);
                        res.end(jsonString);

                    }
                    catch(ex)
                    {
                        var jsonString = messageFormatter.FormatMessage(ex, "Exception found in Looping of result ", false, null);
                        res.end(jsonString);
                    }
                }

            });

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found in Appointment searching", false, null);
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


        else {

            try {
                var x = moment(moment()).isBetween(reslt.StartDate, reslt.EndDate);
                if (x) {
                    return true;
                }
                else {
                    console.log('Date error 2');
                    return false;
                }
            }
            catch(ex)
            {
                console.log("Exception in date :"+ex);
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
        return true;
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

            try {
                var DaysArray = reslt.DaysOfWeek.split(",");
            }
            catch(ex)
            {
                consloe.log("Invalid days");
                return false;
            }
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
function CheckAvailables(Dt,Dy,Tm,res)
{
    try {
        //var obj = dataz;
        var ReqDate = Dt;
        var ReqDay = Dy;
        var ReqTime = Tm;
        var DaySt = false;
        var DbDays = null;

        var DaysArray = ReqDay.split(",");
    }
    catch (ex)
    {
        var jsonString = messageFormatter.FormatMessage(err, "Error in object creation from request", false, dataz);
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
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Extension", false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "Null result found", false, result);
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
                        var jsonString = messageFormatter.FormatMessage(ex, "Exception in checking", false, index);
                        res.end(jsonString);
                    }
                }

            });

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in searching ", false, null);
        res.end(jsonString);
    }

}

//post :-done
function UpdateScheduleID(obj,res)
{
    try {
        DbConn.Schedule.find({where: [{id: obj.SID}]}).complete(function (err, ScheduleObject) {
            if (!err && ScheduleObject==null) {
                // console.log(cloudEndObject);

                var jsonString = messageFormatter.FormatMessage(err, "No Schedule found : "+obj.SID, false, null);
                res.end(jsonString);


            }
            else if (ScheduleObject!=null && !err) {
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
                            var jsonString = messageFormatter.FormatMessage(err, "mapping is succeeded", true, result);
                            res.end(jsonString);

                        }).error(function (err) {
                            //logger.info('mapping error found in saving. : ' + err);
                            console.log("mapping failed ! " + err);
                            //handle error here
                            var jsonString = messageFormatter.FormatMessage(err, "mapping error found in saving. : " + err, false, null);
                            res.end(jsonString);

                        });

                }
                catch (ex)
                {
                    var jsonString = messageFormatter.FormatMessage(err, "Exception in Mapping", false, obj);
                    res.end(jsonString);
                }

            }
            else {
                var jsonString = messageFormatter.FormatMessage(err, "Some error occured", false, null);
                res.end(jsonString);
            }

            //  return next();
        });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found in searching Schedule ", false, null);
        res.end(jsonString);
    }




}

//get :-done
function PickAppThroughSchedule(cmp,tent,dt,dy,tm,res) {

    try{
        DbConn.Schedule
            .findAll({
                where: [{CompanyId: cmp} ,{TenantId: tent}], attributes: ['id']
            }
        )
            .complete(function (err, result) {
                if (!!err) {
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule : "+id , false, result);
                    res.end(jsonString);
                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "Null object returns: no Schedule for id : "+id, false, result);
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

                                                        var jsonString = messageFormatter.FormatMessage(null, "Success , Record found : ", true, result[index]);
                                                        res.end(jsonString);

                                                        /*var Jresults = result[index].map(function (result) {
                                                            console.log(result.toJSON());
                                                            return result.toJSON()
                                                        });*/
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
                            var jsonString = messageFormatter.FormatMessage(ex, "Exception in searching appintment", false, result[index]);
                            res.end(jsonString);
                        }
                    }

                }

            });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in searching Schedule", false, result[index]);
        res.end(jsonString);
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
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule : "+id, false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );

                    console.log('Empty found....................');
                    var jsonString = messageFormatter.FormatMessage(null, "Null object returns", false, result);
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
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found in Schedule search ", false, resultapp);
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
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Extension", false, result);
                    res.end(jsonString);
                    //logger.info( 'Error found in searching : '+err );

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "Null object returns", false, result);
                    res.end(jsonString);

                } else {


                    var jsonString = messageFormatter.FormatMessage(err, "Successfully object returend with records: "+result.length, true, result);
                    res.end(jsonString);

                }

            });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception in searching ", false, obj);
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
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(ex, "Null found: no records: no errors", false, result);
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
        var jsonString = messageFormatter.FormatMessage(ex, "Exception returns", false, obj);
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
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "Null returns :no records : no errors", false, result);
                    res.end(jsonString);

                } else {


                    var jsonString = messageFormatter.FormatMessage(err, "Successfully object returns with records: "+result.length, true, result);
                    res.end(jsonString);

                }

            });
    }
    catch (ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found", false, obj);
        res.end(jsonString);
    }
}

//post :-done
function UpdateScheduleData(obj,res)
{
    try {
        DbConn.Schedule
            .find({
                where: {id: obj.id}
            }
        )
            .complete(function (err, result) {
                if (!!err) {
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "Null returns :no records : no errors", false, result);
                    res.end(jsonString);

                } else if(result){

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
                                //logger.info('Successfully Mapped. ');
                                console.log(".......................Updation is succeeded ....................");
                                var jsonString = messageFormatter.FormatMessage(null, "Updation is succeeded", true, result);
                                res.end(jsonString);

                            }).error(function (err) {
                                //logger.info('mapping error found in saving. : ' + err);
                                console.log("mapping failed ! " + err);

                                var jsonString = messageFormatter.FormatMessage(err, "mapping error found in saving. : " + err, false, null);
                                res.end(jsonString);
                                //handle error here

                            });
                    }
                    catch (ex)
                    {
                        var jsonString = messageFormatter.FormatMessage(ex, "Exception occures", false, obj);
                        res.end(jsonString);
                    }


                }

            });
    }
    catch (ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found", false, obj);
        res.end(jsonString);
    }



    // return next();
}

//post :-done
function UpdateAppoinmentData(obj,res)
{


    try {
        DbConn.Appointment
            .find({
                where: {id: obj.id}
            }
        )
            .complete(function (err, result) {
                if (!!err) {
                    console.log('An error occurred while searching for Appointment:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Appointment:", false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log('No user with the Extension has been found.');
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "Null returns :no records : no errors", false, result);
                    res.end(jsonString);

                } else if(result){

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
                                //logger.info('Successfully Updated. ');
                                console.log(".......................Updation is succeeded ....................");
                                var jsonString = messageFormatter.FormatMessage(err, "Updation is succeeded", true, result);
                                res.end(jsonString);

                            }).error(function (err) {
                                //logger.info('mapping error found in saving. : ' + err);
                                console.log("mapping failed ! " + err);
                                var jsonString = messageFormatter.FormatMessage(err, "Updation error found in saving. : " + err, false, result);
                                res.end(jsonString);
                                //handle error here

                            });
                    }
                    catch(ex)
                    {
                        var jsonString = messageFormatter.FormatMessage(err, "Exception returns", false, obj);
                        res.end(jsonString);
                    }


                }

            });
    }
    catch (ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception found", false, obj);
        res.end(jsonString);
    }
}

//post:-done
function UpdateScheduleIDAppointment(obj,res)
{
    try {
        DbConn.Schedule
            .find({
                where: {id: obj.id}
            }
        )
            .complete(function (err, result) {
                if (!!err) {
                    console.log('An error occurred while searching for Extension:', err);
                    //logger.info( 'Error found in searching : '+err );
                    var jsonString = messageFormatter.FormatMessage(err, "An error occurred while searching for Schedule:", false, result);
                    res.end(jsonString);

                } else if (!result) {
                    console.log("No user with the Schedule id : "+obj.id+" has been found.");
                    ///logger.info( 'No user found for the requirement. ' );
                    var jsonString = messageFormatter.FormatMessage(err, "Null returns for "+obj.id, false, result);
                    res.end(jsonString);


                } else if(result) {
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
                        ).then(function (result) {
                                //logger.info('Successfully Mapped. ');
                                console.log(".......................Updation is succeeded ....................");
                                var jsonString = messageFormatter.FormatMessage(err, "Updation is succeeded", true, result);
                                res.end(jsonString);

                            }).error(function (err) {
                                //logger.info('mapping error found in saving. : ' + err);
                                console.log("Updation failed ! " + err);
                                var jsonString = messageFormatter.FormatMessage(err, "Updation is Failed", false, result);
                                res.end(jsonString);
                                //handle error here

                            });
                    }
                    catch(ex)
                    {
                        var jsonString = messageFormatter.FormatMessage(ex, "Exception returns", false, null);
                        res.end(jsonString);
                    }

                }
                else
                {
                    var jsonString = messageFormatter.FormatMessage(err, "Error In updation", false, null);
                    res.end(jsonString);
                }

            });
    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "Exception obtained", false, obj);
        res.end(jsonString);
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



