/**
 * Created by pawan on 3/26/2015.
 */
var DbConn = require('./DVP-DBModels');
var messageFormatter = require('./DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');




function ProfileTypeCallserverChooser(CompId,TenId,callback)
{
    try {
        //DbConn.FileUpload.find({where: [{UniqueId: rand2}]}).complete(function (err, ScheduleObject) {
        DbConn.CloudEndUser.find({where: [{CompanyId:CompId},{TenantId:TenId}]}).complete(function (err, CUserObject) {
            if (!err && !CUserObject) {
                // console.log(cloudEndObject);

            }
            else if (CUserObject) {
                console.log("................................... Given Cloud End User found ................................ ");
                try {
                    //DbConn.FileUpload.find({where: [{UniqueId: rand2}]}).complete(function (err, ScheduleObject) {
                    DbConn.SipNetworkProfile.find({where: [{id:CUserObject.SipNetworkProfilesId}]}).complete(function (err, CSObject) {
                        if (!err && !CSObject) {
                            // console.log(cloudEndObject);
                            console.log("................................... empty in  Call server searching ................................  : "+CSObject.CSDBCallServerId);




                            // var jsonString = messageFormatter.FormatMessage(null, "Record already in DB", true, CSObject.id);
                            callback(null, -1);
                        }
                        else if (CSObject) {
                            console.log("................................... Given Call server found ................................  : "+CSObject.CSDBCallServerId);




                           // var jsonString = messageFormatter.FormatMessage(null, "Record already in DB", true, CSObject.id);
                            callback(null, CSObject.id);
                            //res.end();
                        }
                        else {
                           // var jsonString = messageFormatter.FormatMessage(err, "ERROR found", false, null);
                            callback(null, 0);
                            // res.end();
                        }


                    });
                }
                catch (ex) {
                    console.log("Exce "+ex);
                   // var jsonString = messageFormatter.FormatMessage(ex, "Exception", false, null);
                    callback(null, -1);
                }




                //res.end();
            }
            else {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR found", false, null);
                callback(null, jsonString);
                // res.end();
            }


        });
    }
    catch (ex) {
        console.log("Exce "+ex);
        var jsonString = messageFormatter.FormatMessage(ex, "Exception", false, null);
        callback(null, jsonString);
    }
}

module.exports.ProfileTypeCallserverChooser = ProfileTypeCallserverChooser;