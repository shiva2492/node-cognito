global.fetch = require('node-fetch');
global.navigator = () => null;
const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require("fs");
const path = require("path");
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


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
})

var upload = multer({
    storage: storage,
    filefilter: function (req, file, callback) {
        if (['png', 'jpeg', 'jpg'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('wrong extension type'));
        }
        callback(null, true);
    }
}).single('profile_pic');

exports.getIdentityCredentials = (options = {}, callback) => {
    const methodName = ' [getIdentityCredentials] '
    try {
        let access = 'public';
        const body = options['body'];
        const headers = options['headers'];
        AWS.config.region = 'eu-central-1';
        let cognitoIdentityCredentialsObj = {
            IdentityPoolId: IdentityPoolId
        };
        if (headers['identitytoken']) {
            cognitoIdentityCredentialsObj['Logins'] = {
                'cognito-idp.eu-central-1.amazonaws.com/eu-central-1_8CA7GNjpS': headers['identitytoken']
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
            console.log('congnito identity creds =====', AWS.config.credentials);
            upload(options, null, (err) => {
                if (err) {
                    return callback(err);
                }
                s3UploadFile({
                    'filePath': options.file.path,
                    'access': access,
                    'credentials': AWS.config.credentials
                }, (err, data) => {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, data)
                });
            })
        });
    } catch (error) {
        console.log(methodName, error)
    }
}


const s3UploadFile = (options = {}, callback) => {
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
        var uploadParams = {
            Key: '',
            Body: '',
            ACL: 'private',
            Bucket: bucketName
        }
        var file = options['filePath'];
        // console.log("options ======", options)
        // Configure the file stream and obtain the upload parameters

        var fileStream = fs.createReadStream(file);
        fileStream.on('error', function (err) {
            callback(err);
        })
        uploadParams.Body = fileStream;
        if (bucketAccess === 'private')
            uploadParams.Key = 'protected/' + options['credentials']['identityId'] + '/' + path.basename(file);
        else {
            // uploadParams.ACL = 'public';
            uploadParams.Key = 'public/' + path.basename(file);
        }
        // call S3 to retrieve upload file to specified bucket
        s3.putObject(uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);
                callback(err);
            }
            if (data) {
                console.log("Upload Success", data);
                callback(null, data);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// login()
//s3UploadFile()