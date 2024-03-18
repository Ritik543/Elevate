const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");
const listingSchema =   new  Schema({
title:{
type: String,

},


description:String,


image:
{
    filename:{
       type : String,
    },
    url: {
      type:  String,
      set:(v) => v === ""? 'https://www.planetware.com/wpimages/2019/10/switzerland-in-pictures-most-beautiful-places-matterhorn.jpg'   : v,
     }
    ,
 
},
price:Number,
location:String,
country:String, 
reviews:[
  {
    type: Schema.Types.ObjectId,
    ref:"Review", 
  }
],

owner:{
  type: Schema.Types.ObjectId,
  ref:"User",
},
geometry: {

  coordinates: {
    type: [Number],

  },
  type: {
    type: String, // Don't do `{ location: { type: String } }`
    enum: ['Point'], // 'location.type' must be 'Point'
  
  },

},


});
listingSchema.post("findOneAndDelete",async(listing)=>{
  
  if(listing){
  await Review.deleteMany({_id :{$in:listing.reviews}});
  }
})

 
const Listing= mongoose.model('Listing',listingSchema);
module.exports = Listing;