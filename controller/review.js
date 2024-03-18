const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/Expresserror");



module.exports.creatreview =async(req, res)=>{
   
    let {id} = req.params;
    console.log(id);
   let listing = await Listing.findById(id);

//    let {comment ,rating}=req.body;
//    console.log(comment);
//    console.log(rating);
// console.log(req.body);

   let newreview= new Review(req.body.review);
   console.log(newreview);
   newreview.author =req.user._id;
   console.log(newreview,"author");
   console.log("newreview");
   listing.reviews.push(newreview);
   await newreview.save();
   await listing.save();
//    res.send("Review was saved successfully");
req.flash("success","Added New Review !");
   res.redirect(`/listings/${listing._id}`);
}


module.exports.deletereview = async (req,res)=>{
    let {id ,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted !");
    res.redirect(`/listings/${id}`);
};
