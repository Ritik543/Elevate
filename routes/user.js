const express = require('express');
const router =express.Router();
const user =require('../models/user');
const wrapAsync = require("../utils/wrapasync.js");
const passport = require('passport');
const { saveredirecturl } = require('../middleware.js');
const usercontroller = require("../controller/user.js");


router.route('/signup').get(usercontroller.signup);


router.route('/signup').post(  wrapAsync(usercontroller.postsignup));


// /login
router.get('/login', wrapAsync(usercontroller.login));

router.post('/login' , saveredirecturl  ,   passport.authenticate("local",{   failureFlash:true    ,failureRedirect: '/login', })     , wrapAsync(usercontroller.loginpost ));
//logout

router.get('/logout',usercontroller.logout);


module.exports =router;