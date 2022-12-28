let router = require('express').Router();
let users = require('./users');
let auth = require('./auth');
let activity = require('./activitiy');
let newsletter = require('./externals');
let sale = require('./sale');
let folder = require('./folder');
let token = require('./token');
let admin = require('./admin');
let bid = require('./bid');

router.use('/user', users);
router.use('/auth', auth);
router.use('/activity', activity);
router.use('/news', newsletter);
router.use('/folder', folder);
router.use('/token', token);
router.use('/sale', sale);
router.use('/bid', bid);
router.use('/admin', admin);

module.exports = router;