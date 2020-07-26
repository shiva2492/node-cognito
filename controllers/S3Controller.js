var s3Service = require('../Services/S3Service');

exports.uploadProfile = function (req, res) {
    let register = s3Service.getIdentityCredentials(req, function (err, result) {
        if (err)
            return res.send(err);
        res.send(result);
    })
}

exports.listBucket = function (req, res) {
    let login = s3Service.listBucket(req.body, function (err, result) {
        if (err)
            return res.send(err)
        res.send(result);
    })
}

exports.getObject = function (req, res) {
    let validate = s3Service.getObject(req.body.token, function (err, result) {
        if (err)
            return res.send(err.message);
        res.send(result);
    })
}