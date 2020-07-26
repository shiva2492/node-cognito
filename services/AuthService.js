global.fetch = require('node-fetch');
global.navigator = () => null;
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
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
 Register Method
*/

exports.Register = function (body, callback) {
    const email = body.email;
    const password = body.password;
    const phoneNumber = body.phoneNumber;
    let attributeList = [];

    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "phone_number",
        Value: phoneNumber
    }));

    console.log(email, password, attributeList);

    userPool.signUp(email, password, attributeList, null, function (err, result) {
        if (err) {
            return callback(err);
        }

        const cognitoUser = result.user;
        callback(null, cognitoUser);
    })
}

/*
 Login Method
*/

exports.Login = function (body, callback) {
    const email = body.email;
    const password = body.password;
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Email: email,
        Password: password
    });
    const userData = {
        Username: email,
        Pool: userPool
    }
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            const accesstoken = result.getAccessToken().getJwtToken();
            const IdentityToken = result.getIdToken().getJwtToken()
            callback(null, {
                accesstoken,
                IdentityToken
            });
        },
        onFailure: (function (err) {
            callback(err);
        })
    })
};

exports.Validate = function (token, callback) {
    request({
        url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            pems = {};
            var keys = body['keys'];
            for (var i = 0; i < keys.length; i++) {
                var key_id = keys[i].kid;
                var modulus = keys[i].n;
                var exponent = keys[i].e;
                var key_type = keys[i].kty;
                var jwk = {
                    kty: key_type,
                    n: modulus,
                    e: exponent
                };
                var pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }
            var decodedJwt = jwt.decode(token, {
                complete: true
            });
            if (!decodedJwt) {
                console.log("Not a valid JWT token");
                callback(new Error('Not a valid JWT token'));
            }
            var kid = decodedJwt.header.kid;
            var pem = pems[kid];
            if (!pem) {
                console.log('Invalid token');
                callback(new Error('Invalid token'));
            }
            jwt.verify(token, pem, function (err, payload) {
                if (err) {
                    console.log("Invalid Token.");
                    callback(new Error('Invalid token'));
                } else {
                    console.log("Valid Token.");
                    callback(null, "Valid token");
                }
            });
        } else {
            console.log("Error! Unable to download JWKs");
            callback(error);
        }
    });
}