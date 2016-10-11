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
        "ip": "SYS_REDIS_HOST",
        "port": "SYS_REDIS_PORT",
        "password":"SYS_REDIS_PASSWORD",
        "db": "SYS_REDIS_DB_CONFIG"

    },
    "Security":
    {
        "ip": "SYS_REDIS_HOST",
        "port": "SYS_REDIS_PORT",
        "user": "SYS_REDIS_USER",
        "password": "SYS_REDIS_PASSWORD"

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
            "domain":"SYS_NOTIFICATIONSERVICE_URL",
            "version":"SYS_NOTIFICATIONSERVICE_VERSION"

        },
        "UserService":
        {
            "domain":"SYS_USERSERVICE_URL",
            "version":"SYS_USERSERVICE_VERSION"
        },
        "AppRegistry":
        {
            "domain":"SYS_APPREGISTRY_URL",
            "version":"SYS_APPREGISTRY_VERSION"
        }
    },
    "Token": "HOST_TOKEN"
};

//NODE_CONFIG_DIR