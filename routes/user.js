const express = require('express');
const router = express.Router();

const userCtrl = require('../Controller/UserController');

router.post('/regist', userCtrl.regist);
router.post('/login', userCtrl.login);
router.put('/loginFb', userCtrl.loginFb);
router.put('/logingg', userCtrl.logingg);
router.put('/logout', userCtrl.logout);

router.get('/detail', userCtrl.detail);
router.put('/detail', userCtrl.updateProfile);

module.exports = router;
