const path = require('path');

// import .env variables
require('dotenv-safe').config({
    allowEmptyValues: true,
    path: path.join(__dirname, './.env'),
    sample: path.join(__dirname, './.env.example'),
});

module.exports = {
    env: process.env.NODE_ENV,
    serverPort: process.env.SERVER_PORT,
    cognitoUserPoolID: process.env.COGNITO_USER_POOL_ID,
    cognitoClientID: process.env.COGNITO_CLIENT_ID,
    cognitoPoolRegion: process.env.COGNITO_POOL_REGION,
    awsAccessKeyID: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    IdentityPoolID: process.env.IDENTITY_POOL_ID,
    S3BucketName: process.env.S3_BUCKET_NAME,
    S3BucketRegion: process.env.S3_BUCKET_REGION,
}