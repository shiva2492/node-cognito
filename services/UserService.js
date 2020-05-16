global.fetch = require('node-fetch');
global.navigator = () => null;
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const {
    cognitoClientID,
    cognitoPoolRegion,
    cognitoUserPoolID
} = require('../vars')
const poolData = {
    UserPoolId: cognitoUserPoolID,
    ClientId: cognitoClientID
};
const pool_region = cognitoPoolRegion;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

/*
 Getting User Attributes Method
*/

exports.GetUserAttributes = function (body, callback) {

    callback(null, null)

    /*
            {Name:"name",Value:""};
            {Name:"preferred_username",Value:""};
            {Name:"gender",Value:""};
            {Name:"birthdate",Value:"1991-06-21"};
            {Name:"address",Value:"CMB"};
            {Name:"email",Value:"sampleEmail@gmail.com"};
            {Name:"phone_number",Value:"+5412614324321"};
            {Name:"custom:role",Value:1};
    */
}