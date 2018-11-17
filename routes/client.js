'use strict';

var express = require('express');
var client_controllers = require('../controllers/client');
var mw_user_authentication = require('../middlewares/user_authentication');

var router = express.Router();

router.post('/register', mw_user_authentication.authenticateUser, client_controllers.register);
router.get('/:id', mw_user_authentication.authenticateUser, client_controllers.getOne)
router.get('/list/:sorting_field/:items_per_page/:page?', mw_user_authentication.authenticateUser, client_controllers.getAll)
router.put('/update/:id', mw_user_authentication.authenticateUser, client_controllers.update);
/*

router.delete('/delete/:id', mw_user_authentication.authenticateUser, client_controllers.del)

*/

module.exports = router;