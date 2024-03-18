const express = require('express');
const router =express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/Expresserror.js");
const { reviewschema }=require("../schema.js"); 
const Listing= require("../models/listing.js");
const Review = require("../models/review.js");
const {Isloggedin,validatereview,isauthor} = require("../middleware.js");
const reviewcontroller = require("../controller/review.js");








// add reviews
router.post("/",Isloggedin ,validatereview, wrapAsync(reviewcontroller.creatreview));


//delete reviews
router.delete("/:reviewId",isauthor,wrapAsync(reviewcontroller.deletereview));

module.exports =router;