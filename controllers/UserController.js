var userService = require('../Services/UserService');

exports.GetUserAttributes = function (req, res) {
    let register = userService.GetUserAttributes(req.body, function (err, result) {
        if (err)
            res.send(err);
        res.send(result);
    })
}

exports.test = function (req, res) {
    res.send("Cognito Authentication working");
}