const Listing = require("../models/listing");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken:mapToken});

module.exports.index =async  (req, res)=>{
    const alllistings= await Listing.find({});
    // console.log("ABCD");
    let list= await Listing.findById("6592aa36b7dd52b787ae310e");
    // console.log(list.geometry.coordinates);
    
    res.render("listings/index.ejs",{alllistings});
    };



    module.exports.createnewlisting = (req, res)=> {
    
        res.render("listings/new.ejs");
    };


    module.exports.showlisting =async  (req, res)=> {
    
        
        let { id } = req.params;
        const listing = await Listing.findById(id).populate( {path: "reviews",populate:{path:"author"}}).populate("owner");
    
        let response =await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1, 
          })
            .send()
// console.log(listing.location);
            let coords=response.body.features[0].geometry;
// console.log(coords);
const list= await  Listing.findByIdAndUpdate(id,{geometry: coords})  ;   

        
        if(!listing){
            req.flash("error","Listing you requested for does not exist!");
            res.redirect("/listings");
        }
        
    // console.log(listing);
    req.flash("success","New Listing Created!");
    res.render("listings/show.ejs", {listing} );
     
    };

    module.exports.postcreatenewlisting =async (req, res, next)=> {
 let response =await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1, 
          })
            .send()

//  console.log(response.body.features[0].geometry);

 let coords=response.body.features[0].geometry;
 
//  res.send("done");   

       
       
let url= req.file.path;
         let filename= req.file.filename;

        let {title, price,location,country, description, image } = req.body;
        // Listing.owner = req.user._id;
         owner= req.user._id;
         image={url,filename};
        
         
         

        //  const listo = new Listing(alllistings);
        //  listo.geometry=coord;
        //  let newsn= await listo.save();
        //  console.log(newsn);
        // //  console.log(coord);
        // // console.log(alllistings.geometry)
        // alllistings.geometry=coord;
        // console.log("hii");
        // console.log(alllistings.geometry);
    
    //  console.log(s,"Listing owner");
    console.log(price);
    console.log("description")
    
    
    
    // console.log(req.body.listing);
    
    // if((req.body.title && req.body.price &&req.body.location && req.body.country && req.body.description && req.body.image))  {
    //     throw new ExpressError(404 , " Send valid data for listing");
    // }
    // if(!req.body.title){
    //     throw new ExpressError(404 , " title is missing");
    
    // }
    // if(!req.body.description){
    //     throw new ExpressError(404 , " Description is missing");
    
    // }
    // if(!req.body.price){
    //     throw new ExpressError(404 , " price is missing");
    
    // }
    // if(!req.body.location){
    //     throw new ExpressError(404 , "location is missing");
    
    // }
    // if(!req.body.country){
    //     throw new ExpressError(404 , " country is missing");
    
    // }
    // if(!req.body.image){
    //     throw new ExpressError(404 , " image  is missing");
    
    // }
    
    await  Listing.insertMany([{title: title, price: price, location: location, country: country , description:description ,image:image,owner:owner,geometry:coords}]);
    // const newListing = new Listing(req.body.listing);
    // console.log(newListing);
    // await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    }



    // edit
    module.exports.editroute =async (req, res)=> {
        let {id}= req.params;
        const listing = await Listing.findById(id);
        
        if(!listing){
            req.flash("error","Listing you requested for does not exist!");
            res.redirect("/listings");
        }
        
        res.render("listings/edit.ejs",{listing});
        
        }; 


        //putedit
        module.exports.puteditlisting =async (req, res)=>{
            let {id}= req.params;
            let {title: title, price: price, location: location, country: country , description:description , image: image} =req.body;
            let response =await geocodingClient.forwardGeocode({
                query: req.body.location,
                limit: 1, 
              })
                .send()
    
                let coords=response.body.features[0].geometry;
            // console.log(image.url,"image");
            if(typeof req.file !== "undefined"){
                console.log(req.file);
            let url= req.file.path;
            
            let filename= req.file.filename;
            console.log(url,filename);
            image ={url,filename};
            //  await image.save();
            // console.log(image.url);

            }
            await Listing.findByIdAndUpdate(id,{title: title, price: price, location: location, country: country , description:description ,image: image,geometry:coords});
            req.flash("success","Edited the Listing !");
            res.redirect("/listings");
            };


            //delete
            module.exports.deletelisting=async(req,res) => {
                let {id}= req.params;
                //const listing = await Listing.findById(id);
                 await Listing.findByIdAndDelete(id,{});
                 req.flash("success","Listing Deleted !");
                res.redirect("/listings");
                }