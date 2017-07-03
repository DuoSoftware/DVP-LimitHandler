module.exports = {
  "DB": {
    "Type":"postgres",
    "User":"duo",
    "Password":"DuoS123",
    "Port":5432,
    "Host":"104.236.231.11",
    "Database":"duo"
  },
  "Redis":
  {
    "mode":"sentinel",//instance, cluster, sentinel
    "ip": "45.55.142.207",
    "port": 6389,
    "user": "duo",
    "password": "DuoS123",
    "sentinels":{
      "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
      "port":16389,
      "name":"redis-cluster"
    }

  },


  "Security":
  {

    "ip" : "45.55.142.207",
    "port": 6389,
    "user": "duo",
    "password": "DuoS123",
    "mode":"sentinel",//instance, cluster, sentinel
    "sentinels":{
      "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
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
      "domain":"notificationservice.app.veery.cloud",
      "version":"1.0.0.0"
    },
    "UserService":
    {
      "domain":"userservice.app.veery.cloud",
      "version":"1.0.0.0"
    },
    "AppRegistry":
    {
      "domain":"appregistry.app.veery.cloud",
      "version":"1.0.0.0"
    }
  },
  "Token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkaW51c2hhZGNrIiwianRpIjoiMzc3YmU1NGUtMzZjNi00MzM0LTk5YjMtZjAxOTdlZThlMWZjIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE5MDUwNjYyNDgsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzMwNjYyNDh9.AhVLiLtNdUjcY9fLhIlaR1G7Wh00eSr6z7GD42z8jQ8"
};