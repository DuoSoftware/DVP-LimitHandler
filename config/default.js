module.exports = {
  "DB": {
    "Type":"postgres",
    "User":"",
    "Password":"",
    "Port":5432,
    "Host":"",
    "Database":""
  },
  "Redis":
  {
    "mode":"sentinel",//instance, cluster, sentinel
    "ip": "",
    "port": 6389,
    "user": "",
    "password": "",
    "sentinels":{
      "hosts": "",
      "port":16389,
      "name":"redis-cluster"
    }

  },


  "Security":
  {

    "ip" : "",
    "port": 6389,
    "user": "",
    "password": "",
    "mode":"sentinel",//instance, cluster, sentinel
    "sentinels":{
      "hosts": "",
      "port":16389,
      "name":"redis-cluster"
    }
  },

  "Host":
  {
    "domain": "0.0.0.0",
    "port": 8084,
    "version":"1.0.0.0",
    "hostpath":"./config",
    "logfilepath": ""
  },
  "ExternalUrls":
  {
    "NotificationService":
    {
      "domain":"",
      "version":"1.0.0.0"
    },
    "UserService":
    {
      "domain":"",
      "version":"1.0.0.0"
    },
    "AppRegistry":
    {
      "domain":"",
      "version":"1.0.0.0"
    }
  },
  "Token":""
};
