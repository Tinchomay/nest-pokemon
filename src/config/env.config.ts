
//los parentesis sirven dar por implicito el return
export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3002,
    mongodb: process.env.MONGO_DB,
    defaultLimit: +process.env.DEFAULT_LIMIT || 7
})