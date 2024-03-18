
const Listing = require("./models/listing.js")  ;
const {listingSchema ,reviewschema }=require("./schema.js"); 
const Review = require("./models/review.js");
const ExpressError = require("./utils/Expresserror.js");


module.exports.Isloggedin =  (req,res,next) => {
    
    // console.log(req.path ,'...',req.originalUrl);
    console.log(req.user);

    if(! req.isAuthenticated()) {
        req.session.redirecturl = req.originalUrl;
        // console.log(req.session.redirecturl);
        // req.flash("success","You must be logged in");
        req.flash("error","you must be logged in");
        return  res.redirect("/login");
    }
    next();
};

module.exports.saveredirecturl=(req, res, next) => {
    // console.log(,"red");
    if(req.session.redirecturl){
        // console.log(req.session.redirecturl,"red");
        res.locals.redirecturl = req.session.redirecturl;
        console.log(res.locals.redirecturl,"red2");
        // console.log("red");
    }
    next();
}



module.exports.isowner=  async (req, res, next)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    if(!  listing.owner.equals(res.locals.curruser._id)){
        console.log(res.locals.curruser._id,"redirecting to");
        req.flash("success","New Listing Created ss!");
        // req.flash('error','you are not the owner of this listing');
       return   res.redirect(`/listings/${id}`);


    }
    next();

}



module.exports.validatelisting = (req, res ,next)=>{
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    console.log("Listing schema");
    if(error){ 

        let errmsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    
    }
    else{
        
        next();
    }
}


module.exports.validatereview= (req,res,next)=>{
    let {error}= reviewschema.validate(req.body);
    console.log(error);
    if(error){ 

        let errmsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errmsg);
    
    }
    else{
        next();
    }
}

module.exports.isauthor=  async (req, res, next)=>{
    let {id,reviewId}= req.params;
    let review= await Review.findById(reviewId);
    if(!  review.author.equals(res.locals.curruser._id)){
        console.log(res.locals.curruser._id,"redirecting to");
        req.flash("error","you have not author of this review");
        // req.flash('error','you are not the owner of this listing');
       return   res.redirect(`/listings/${id}`);


    }
    next();

}