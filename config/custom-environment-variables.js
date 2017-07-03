module.exports = {
    "DB": {
        "Type":"SYS_DATABASE_TYPE",
        "User":"SYS_DATABASE_POSTGRES_USER",
        "Password":"SYS_DATABASE_POSTGRES_PASSWORD",
        "Port":"SYS_SQL_PORT",
        "Host":"SYS_DATABASE_HOST",
        "Database":"SYS_DATABASE_POSTGRES_USER"
    },


    "Redis":
    {
        "mode":"SYS_REDIS_MODE",
        "ip": "SYS_REDIS_HOST",
        "port": "SYS_REDIS_PORT",
        "user": "SYS_REDIS_USER",
        "password": "SYS_REDIS_PASSWORD",
        "sentinels":{
            "hosts": "SYS_REDIS_SENTINEL_HOSTS",
            "port":"SYS_REDIS_SENTINEL_PORT",
            "name":"SYS_REDIS_SENTINEL_NAME"
        }

    },

    "Security":
    {

        "ip": "SYS_REDIS_HOST",
        "port": "SYS_REDIS_PORT",
        "user": "SYS_REDIS_USER",
        "password": "SYS_REDIS_PASSWORD",
        "mode":"SYS_REDIS_MODE",
        "sentinels":{
            "hosts": "SYS_REDIS_SENTINEL_HOSTS",
            "port":"SYS_REDIS_SENTINEL_PORT",
            "name":"SYS_REDIS_SENTINEL_NAME"
        }

    },

    "Host":
    {
        "domain": "HOST_NAME",
        "port": "HOST_LIMITHANDLER_PORT",
        "version": "HOST_VERSION",
        "logfilepath": "LOG4JS_CONFIG"
    },
    "ExternalUrls":
    {
        "NotificationService":
        {
            "domain":"SYS_NOTIFICATIONSERVICE_HOST",
            "version":"SYS_NOTIFICATIONSERVICE_VERSION"

        },
        "UserService":
        {
            "domain":"SYS_USERSERVICE_HOST",
            "version":"SYS_USERSERVICE_VERSION"
        },
        "AppRegistry":
        {
            "domain":"SYS_APPREGISTRY_HOST",
            "version":"SYS_APPREGISTRY_VERSION"
        }
    },
    "Token": "HOST_TOKEN"
};

//NODE_CONFIG_DIR