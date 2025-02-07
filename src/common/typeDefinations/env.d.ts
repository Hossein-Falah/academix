namespace NodeJS {
    interface ProcessEnv {
        // application
        PORT:number;

        // DataBase
        DB_PORT:number;
        DB_NAME:string;
        DB_USERNAME:string;
        DB_PASSWORD:string;
        DB_HOST:string;

        // secret key
        ACCESS_TOKEN_SECRET:string;
        OTP_TOKEN_SECRET:string;

        COOKIE_SECRET:string;
    }
}