const path = require('path');

// import .env variables
require('dotenv-safe').load({
    allowEmptyValues: true,
    path: path.join(__dirname, './.env'),
    sample: path.join(__dirname, './.env.example'),
});

module.exports = {
    env: process.env.NODE_ENV,
    serverPort: process.env.SERVER_PORT,
    cognitoUserPoolID: COGNITO_USER_POOL_ID,
    cognitoClientID: COGNITO_CLIENT_ID,
    cognitoPoolRegion: COGNITO_POOL_REGION
}