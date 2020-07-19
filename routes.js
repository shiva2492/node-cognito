var express = require('express');
var router = express.Router();
var authController = require('./controllers/AuthController');
var userController = require('./controllers/UserController');
var S3Controller = require('./controllers/S3Controller');
var authMiddleware = require('./middlewares/AuthTokenValidation');

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/validate', authController.validate_token);
router.get('/user/test-auth', authMiddleware.Validate, userController.test);
router.get('/user/user-attributes', authMiddleware.Validate, userController.GetUserAttributes);
router.post('/user/profile-photo', authMiddleware.Validate, S3Controller.uploadProfile);

module.exports = router;