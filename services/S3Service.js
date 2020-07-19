global.fetch = require('node-fetch');
global.navigator = () => null;
const AWS = require('aws-sdk');
const fs = require("fs")
const path = require("path")
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const {
    S3BucketName,
    S3BucketRegion,
    cognitoPoolRegion,
    cognitoUserPoolID,
    cognitoClientID,
    IdentityPoolID
} = require('../vars');
const bucketName = S3BucketName;
const bucketRegion = S3BucketRegion;
const UserPoolId = cognitoUserPoolID;
const ClientId = cognitoClientID;
const IdentityPoolId = IdentityPoolID;


// const login = () => {
//     try {
//         var authenticationData = {
//             Username: 'shivadwivediit@gmail.com',
//             Password: 'Password@1234',
//         };
//         var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
//         var poolData = {
//             UserPoolId: UserPoolId,
//             ClientId: ClientId
//         };
//         var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
//         var userData = {
//             Username: 'shivadwivediit1@gmail.com',
//             Pool: userPool
//         };
//         var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
//         cognitoUser.authenticateUser(authenticationDetails, {
//             onSuccess: function (result) {
//                 var accessToken = result.getAccessToken().getJwtToken();
//                 // console.log(result.getIdToken()['payload']['sub'])
//                 /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer */
//                 var idToken = result.idToken.jwtToken;
//                 var identityId = ''
//                 // console.log(result.getAccessToken().getJwtToken())
//                 AWS.config.region = 'eu-central-1';
//                 AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//                     IdentityPoolId: IdentityPoolId,
//                     Logins: {
//                         'cognito-idp.eu-central-1.amazonaws.com/eu-central-1_8CA7GNjpS': result.getIdToken().getJwtToken()
//                     }
//                 });
//                 AWS.config.credentials.get(function () {
//                     // console.log(res)
//                     // Credentials will be available when this function is called.
//                     var accessKeyId = AWS.config.credentials.accessKeyId;
//                     var secretAccessKey = AWS.config.credentials.secretAccessKey;
//                     var sessionToken = AWS.config.credentials.sessionToken;
//                     identityId = AWS.config.credentials.identityId;
//                     console.log(AWS.config.credentials)
//                     s3UploadFile({
//                         'credentials': AWS.config.credentials,
//                         'access': 'private'
//                     })
//                 });
//             },
//             onFailure: function (err) {
//                 console.log(err);
//                 AWS.config.region = 'eu-central-1';
//                 AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//                     IdentityPoolId: IdentityPoolId
//                 });
//                 AWS.config.credentials.get(function () {
//                     // console.log(res)
//                     // Credentials will be available when this function is called.

//                     identityId = AWS.config.credentials.identityId;
//                     console.log(AWS.config.credentials)
//                     s3UploadFile({
//                         'credentials': AWS.config.credentials,
//                         'access': 'public'
//                     })
//                 });
//             },

//         });

//     } catch (error) {
//         console.log(error)
//     }
// }


exports.getIdentityCredentials = (options = {}) => {
    const methodName = ' [getIdentityCredentials] '
    try {
        let access = 'public';
        AWS.config.region = 'eu-central-1';
        let cognitoIdentityCredentialsObj = {
            IdentityPoolId: IdentityPoolId
        };
        if (options['IdentityToken']) {
            cognitoIdentityCredentialsObj['Logins'] = {
                'cognito-idp.eu-central-1.amazonaws.com/eu-central-1_8CA7GNjpS': options['IdentityToken']
            };
            access = 'private';
        }
        AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoIdentityCredentialsObj);
        AWS.config.credentials.get(function () {

            // Credentials will be available when this function is called.
            // var accessKeyId = AWS.config.credentials.accessKeyId;
            // var secretAccessKey = AWS.config.credentials.secretAccessKey;
            // var sessionToken = AWS.config.credentials.sessionToken;
            // identityId = AWS.config.credentials.identityId;
            console.log(AWS.config.credentials);
            s3UploadFile({
                'access': access
            });
        });
    } catch (error) {
        console.log(methodName, error)
    }
}

const s3UploadFile = (options = {}) => {
    try {
        let bucketAccess = options['access'];
        let clientParams = {
            region: bucketRegion,
            apiVersion: '2012-10-17',
            params: {
                Bucket: bucketName,
                region: bucketRegion
            }
        };

        s3 = new AWS.S3(clientParams);
        // console.log(s3)
        // s3 = new AWS.S3({
        //     credentials: options['credentials'],
        //     region: options['region'],
        //     apiVersion: '2012-10-17',
        //     Bucket: bucketName
        // })
        // console.log(options['identityId'].split(":")[1])
        // call S3 to retrieve upload file to specified bucket

        var uploadParams = {
            Key: '',
            Body: '',
            ACL: 'private',
            Bucket: bucketName
        }
        var file = path.join(__dirname, "../utils/intro-bg.jpg");

        // Configure the file stream and obtain the upload parameters

        var fileStream = fs.createReadStream(file);
        fileStream.on('error', function (err) {
            console.log('File Error', err);
        })
        uploadParams.Body = fileStream;
        if (bucketAccess === 'private')
            uploadParams.Key = 'protected/' + options['credentials']['identityId'] + '/' + path.basename(file);
        else {
            // uploadParams.ACL = 'public';
            uploadParams.Key = 'public/' + path.basename(file);
        }
        console.log(bucketName + uploadParams.Key);
        console.log(uploadParams);
        // call S3 to retrieve upload file to specified bucket
        s3.putObject(uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);
            }
            if (data) {
                console.log("Upload Success", data);
                return data;
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// login()
//s3UploadFile()