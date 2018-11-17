'use strict';

var express = require('express');
var multipart = require('connect-multiparty');
var user_controllers = require('../controllers/user');
var mw_user_authentication = require('../middlewares/user_authentication');
var mw_user_uploads = multipart({uploadDir: './uploads/images'});

var router = express.Router();

router.post('/register', user_controllers.register);
router.post('/login', user_controllers.login);
router.put('/update/:id', mw_user_authentication.authenticateUser, user_controllers.update);
router.post('/change-profile-picture/:id', [mw_user_authentication.authenticateUser, mw_user_uploads], user_controllers.changeProfilePicture);
router.get('/get-image/:image', user_controllers.getImage);

module.exports = router;