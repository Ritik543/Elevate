const express = require('express');
const router =express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/Expresserror.js");
const {listingSchema ,reviewschema }=require("../schema.js"); 
const Listing= require("../models/listing.js");

const {Isloggedin, isowner,validatelisting} = require("../middleware.js");
const Listingcontroller = require("../controller/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage});



//index route

router.get("/" ,  wrapAsync(Listingcontroller.index));

//create listings
router.get("/new", Isloggedin  ,Listingcontroller.createnewlisting);

//show Route

router.get("/:id"   ,Isloggedin,  wrapAsync(Listingcontroller.showlisting));

router.post("/" ,Isloggedin,upload.single('image[url]'),validatelisting , wrapAsync(Listingcontroller.postcreatenewlisting));
// router.post("/",upload.single('image[url]'),(req,res)=>{
//     res.send(req.file);
// })

//edit the listings
router.get("/:id/edit",Isloggedin ,  wrapAsync(Listingcontroller.editroute));

router.put("/:id",  Isloggedin, isowner , upload.single('image[url]'), wrapAsync(Listingcontroller.puteditlisting));

router.delete('/:id',Isloggedin, wrapAsync(Listingcontroller.deletelisting));


module.exports =router;



// const validatelisting = (req, res ,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     console.log(error);
//     console.log("Listing schema");
//     if(error){ 

//         let errmsg= error.details.map((el)=> el.message).join(",");
//         throw new ExpressError(400,errmsg);
    
//     }
//     else{
        
//         next();
//     }
// }
