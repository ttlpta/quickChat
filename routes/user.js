const express = require('express');

const userCtrl = require('../Controller/UserController');

const router = express.Router();
router.post('/regist', userCtrl.regist);
router.post('/login', userCtrl.login);
router.put('/loginFb', userCtrl.loginFb);
router.put('/logingg', userCtrl.logingg);
router.put('/logout', userCtrl.logout);

router.get('/detail', userCtrl.detail);
router.put('/detail', userCtrl.updateProfile);
router.put('/updateStatus', userCtrl.updateStatus);

module.exports = router;
