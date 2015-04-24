/**
 * Created by pawan on 3/10/2015.
 */
var restify = require('restify');
var stringify=require('stringify');
var redis=require('redis');
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var uuid = require('node-uuid');
var Warlock = require('node-redis-warlock');
var DbConn = require('./DVP-DBModels');
//var Lock = require('node-redis-lock');



var client = redis.createClient(6379,"192.168.2.33");
client.on("error", function (err) {
    console.log("Error " + err);
});
var lock = require("redis-lock")(client);
//var lock = new Lock({namespace: 'locking'}, client);
//var warlock = Warlock(client);
/*CurrentIncrement('lk',function(err,res)
{
console.log(res);
});*/


var a=GetObj("lk1",0);








/*
GetObj('lokz',0,function(err,res)
{

});
console.log(a);
*/
/*
var t=SetObj("lk",0,function(err,res)
{
console.log(res);
});
*/

/*CurrentIncrement('lk',0,function(err,res)
{
    console.log(res);
});*/


//console.log(t);

function GetObj(key, obj) {


        // Simulate a 1 second long operation
        client.set('lk1',5, function (error, reply) {
            if (error) {


                return error;


            }
            else {

                return reply;





            }
        });





};



function SetObj (key, obj, callback) {
    lock("myLock", 10000, function (done) {
        console.log("Set Lock acquired");
        // Simulate a 1 second long operation
        client.set(key, obj, function (error, reply) {
            if (error) {

               callback(error, false);
                setTimeout(function () {     // Simulate some task
                    console.log("Releasing lock now");

                    done(function () {
                        console.log("Lock has been released, and is available for others to use");

                    });
                },0);


            }
            else {
                callback(null, true);
                setTimeout(function () {     // Simulate some task
                    console.log("Releasing lock now");

                    done(function () {
                        console.log("Lock has been released, and is available for others to use");

                    });
                },0);


            }
        });




    });
};

function CurrentIncrement(key,callback)
{
    lock("CurrLock", 10000, function (done) {
        console.log("Set Lock acquired");


        ChkCurrentMax('mxz',"lk",10,function(err,res)
        {
            if(res) {
                lock("myLock", 10000, function (done) {
                    console.log("Set Lock acquired");
                    client.incr('key', function (err, reply) {
                        console.log(reply); // 11
                        if (err) {
                            callback(err, false);
                            setTimeout(function () {     // Simulate some task
                                console.log("Releasing lock now");

                                done(function () {
                                    console.log("Lock has been released, and is available for others to use");

                                });
                            }, 10000);

                        }
                        else {
                            callback(err, true);
                            setTimeout(function () {     // Simulate some task
                                console.log("Releasing lock now");

                                done(function () {
                                    console.log("Lock has been released, and is available for others to use");

                                });
                            }, 10);
                        }
                    });
                });
            }
        });


    });


}

function ChkCurrentMax(key,lk,obj,callback){

    client.get(key,function(err,result)
    {
        if(err)
        {
            console.log("error in max searching");
        }
        else
        {

            client.get('lk',function(errlk,resultlk)
            {
                if(err)
                {
                    console.log("error in copmairing");
                }
                else
                {
                   if(resultlk<result)
                   {
                       console.log(resultlk + '<' +result);
                       callback(err,true);
                   }

                }

            });

        }

    });

}


var date = new Date();
var current_day = date.getDate();
//var looklock=0;

//client.set("Home", "HEENATIYANA", redis.print);
//client.hset(["lock", "index", "0"], redis.print);
//AddNewNumberLimit(0,0,0);
//GetAllLimitNumberDetails(0,0,0);


//DecrCurrentLimit(0,0,0);
//console.log(LockTest(crand,false,0));
/*Locktest2(crand,false,0);
Locktest2(crand,false,0);
Locktest2(crand,false,0);
Locktest2(crand,false,0);
Locktest2(crand,false,0);
Locktest2(crand,false,0);
Locktest2(crand,false,0);
Locktest2(crand,false,0);
Locktest2(crand,false,0);
Locktest2(crand,false,0);
*/
//IncrCurrentLimit(0, 0, 0);




var crand=null;

function AddNewNumberLimit(req,res,err)
{
    var rand="number:"+uuid.v4().toString();

    client.hset([rand, "name", "SLT_pdmin"], redis.print);
    client.hset([rand, "description", "20"], redis.print);
    client.hset([rand, "maxlimit", "20"], redis.print);
    client.hset([rand, "currentlimit", "0"], redis.print);
    client.hset([rand, "companyid", "1"], redis.print);
    client.hset([rand, "tenentid", "2"], redis.print);
    client.hset([rand, "objclass", "clz001"], redis.print);
    client.hset([rand, "objtype", "objtyp001"], redis.print);
    client.hset([rand, "objcatagory", "objcat001"], redis.print);
    client.hset([rand, "updatetime", current_day.toString()], redis.print);

    console.log(rand);

    //console.log(res);
    crand=rand;




}

function GetAllLimitNumberDetails(req,res,err)
{

    client.hgetall(crand, function (err, obj) {


        if(obj) {

            jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, obj);
            // res.end(jsonString);
        }
        else if(!obj)
        {
            var jsonString = messageFormatter.FormatMessage(err, "EMPTY", true, obj);
            //res.end(jsonString);
        }
        else if(err)
        {
            var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, obj);
            //res.end(jsonString);
        }
    });

}

function IncrCurrentLimit(req,res,err)
{
    var index=0;
    client.hget("lock","index",function(err,objindx)
    {
        index=objindx;
    });
    if(index==0) {

        client.hincrby("lock", "index", 1, function (err, objindex) {
            var index = objindex;
            console.log(index + " index val");
        });

        /*
         client.hget(crand,"maxlimit" ,function (err, obj) {


         if(obj) {

         client.hincrby(crand,"currentlimit",function(err,obj)
         {




         if(obj) {
         var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, obj);
         res.end(jsonString);
         }
         else if(!obj)
         {
         var jsonString = messageFormatter.FormatMessage(err, "EMPTY", true, obj);
         //  res.end(jsonString);
         }
         else if(err)
         {
         var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, obj);
         // res.end(jsonString);
         }

         });
         var jsonString = messageFormatter.FormatMessage(err, "SUCCESS", true, obj);
         //res.end(jsonString);
         }
         else if(!obj)
         {


         var jsonString = messageFormatter.FormatMessage(err, "EMPTY", true, obj);
         //  res.end(jsonString);
         }
         else if(err)
         {
         var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, obj);
         // res.end(jsonString);
         }
         });
         */
        client.hget(crand, "maxlimit", function (err, objmax) {

            client.hget(crand, "currentlimit", function (err, objcur) {

                if (objmax > objcur) {
                    client.hincrby(crand, "currentlimit", 1, function (err, obj) {

                        if (obj == 1) {
                            client.hincrby("lock", "index", -1, function (err, objindex) {
                                var index = objindex;
                                console.log(index + " index val");
                            });
                        }
                        else {
                            client.hincrby("lock", "index", -1, function (err, objindex) {
                                var index = objindex;
                                console.log(index + " index val");
                            });
                        }

                    });

                }
                else {
                    looklock = 0;
                }
            });
        });
        //client.quit();
    }
    else
    {
       // client.quit();
    }
}

function DecrCurrentLimit(req,res,err)
{




}

function Inctest(req,res,err)
{


    client.hget(crand,"maxlimit",function(err,objmax)
    {
       client.watch(crand +"maxlimit");

        client.hget(crand,"currentlimit",function(err,objcurr)
        {
            if(objcurr<objmax)
            {
                client.hincrby(crand,"currentlimit",1,function(err,obj)
                {

                    client.exec();
                    client.hget(crand,"currentlimit",function(err,obj)
                    {
                        console.log(obj);
                    });

                });
            }
        });
    });
}

function LockTest(req,res,err)
{
    console.log("Lock test hit");
    var key = "cur";
    var ttl = 10000; // Lifetime of the lock


    warlock.lock(warlock.makeKey(key), ttl, function(err, unlock){
        if (err) {
            // Something went wrong and we weren't able to set a lock
            console.log("Error Found in putting lock for "+key);
            return 1;
        }

        if (typeof unlock === 'function') {
            // If the lock is set successfully by this process, an unlock function is passed to our callback.
            // Do the work that required lock protection, and then unlock() when finished...
            //
            // do stuff...
            //
            client.hget(req,"currentlimit",function(err,objcurr) {

                if(6>objcurr)
                {
                    client.hincrby(req,"currentlimit",1,function(err,obj) {

                        console.log("incrementation happens "+obj);

                    });

                }

            });
            console.log("Lock is on for "+key);


            unlock();
            console.log("Lock is off for "+key);
            return 1;
        } else {
            // Otherwise, the lock was not established by us so we must decide what to do
            // Perhaps wait a bit & retry...
            console.log("Lock is off with message 'not a function' for "+key);
            console.log(typeof unlock)
            return 1;
        }
    });


}

function Locktest2(req,res,err)
{
    /*lock("myLock", function(done) {
        // Even though this function has been scheduled at the same time
        // as the function above, this callback will not be executed till
        // the function above has called done(). Hence, this will have to
        // wait for at least 1 second.
        client.hget(req,"currentlimit",function(err,objcurr) {

            if(6>objcurr)
            {
                client.hincrby(req,"currentlimit",1,function(err,obj) {

                    console.log("incrementation happens "+obj);

                });

            }

        });

        done();
    });*/

    console.log("Asking for lock");
    /* lock(req,2000, function(done) {
        console.log("Lock acquired");

        setTimeout(function() {     // Simulate some task
            console.log("Releasing lock now");

            done(function() {
                console.log("Lock has been released, and is available for others to use");
            });
        });
    });*/
    /*lock("myLock", function(done) {
        // Simulate a 1 second long operation
        setTimeout(done, 1000);
    });

    lock("myLock", function(done) {
        // Even though this function has been scheduled at the same time
        // as the function above, this callback will not be executed till
        // the function above has called done(). Hence, this will have to
        // wait for at least 1 second.
        console.log("LOCK on");

        done();
    });

*/

   //var lock = new Lock({namespace: 'locking'}, client);

// Acquire a lock.
    var key = 'number:110aa808-ccd8-49e3-a8dd-5bec198011ce';
    var value = ' currentlimit';
    var ttl = 1000000; // seconds


// Renew a lock.
// It fails if the value is different.
 /*  lock.renew(key, ttl, value, function(e, r) {
        // r === true;
       console.log("Asking for lock2");
    });*/

// Release a lock.
//  The value has to be passed to ensure another host doesn't release it.

    /*
    lock.release(key, value, function(e, r) {
        //
        console.log("Asking for lock3");
    });
*/

// Does a lock exist?
    lock.isLocked(key, function(e, r) {
        // Lock if r exists (this is the value of the lock)
        if(r)
        {
            console.log("lock is here");
        }
        else if(!r)
        {
            console.log("No lock is here");
            lock.acquire(key, ttl, value, function(e, r) {
                // r === true;
                console.log("locked");
                client.hget(req,"currentlimit",function(err,objcurr) {

                    if(6>objcurr)
                    {
                        client.hincrby(key,"currentlimit",1,function(err,obj) {

                            console.log("incrementation happens "+obj);

                            setTimeout(function()
                            {

                            }, 100000);

                        });

                    }

                });
            });
        }
    });






}




 var SetObj=function  (key, obj, callback) {
    lockz("number:110aa808-ccd8-49e3-a8dd-5bec198011ce", 10000, function (done) {
        console.log("Set Lock acquired");
        // Simulate a 1 second long operation
        client.hincrby("number:110aa808-ccd8-49e3-a8dd-5bec198011ce","currentlimit",1,function(err,obj) {


        });

        setTimeout(function () {     // Simulate some task
            console.log("Releasing lock now");

            done(function () {
                console.log("Lock has been released, and is available for others to use");
            });
        }, 15000);
    });
};

/*var RemoveObj = function (key, callback) {
    lock("myLock", function (done) {

        console.log("Remove Lock acquired");
        client.del(key, function (err, reply) {
            if (err) {
                console.log(error);
            }
            else if (reply === 1) {
                callback(null, "true");
            }
            else {
                callback(null, "false");
            }
        });

        done();
    });
};*/

/*var GetObj = function (key, callback) {
    client.get(key, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};
    */