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
        EMAIL_TOKEN_SECRET:string;
        PHONE_TOKEN_SECRET:string;

        COOKIE_SECRET:string;

        //google oauth
        GOOGLE_CLIENT_ID:string;
        GOOGLE_CIIENT_SECRET:string;
        GOOGLE_CLLBACK_URL:string;

        //s3 service
        S3_BUCKET_NAME:string;
        S3_ACCESS_KEY:string;
        S3_SECRET_KEY:string;
        S3_ENDPOINT:string;
    }
}