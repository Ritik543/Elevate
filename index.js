if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  // console.log(process.env.SECRETKEY)
}

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
const Listing = require("./models/listing.js");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const methodoverride = require("method-override");
app.use(methodoverride("_method"));
const ejsmate = require("ejs-mate");
const { nextTick } = require("async");
app.engine("ejs", ejsmate);
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/Expresserror.js");
const { listingSchema, reviewschema } = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
let session = require("express-session");
const MongoStore = require("connect-mongo");
const { Session } = require("inspector");
let flash = require("express-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./routes/user.js");
const { saveredirecturl, isowner } = require("./middleware.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connection established in db");
  })
  .catch(() => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "secret code",
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionoptions = {
  store,
  secret: "secret code",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 20 * 24 * 60 * 60 * 1000,
    maxAge: 20 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get('/', (req,res)=>{

    res.redirect("/login");

});

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  // req.locals.redirecturl = req.session.redirecturl;
  next();
});

// app.get("/demouser", async (req, res, next)=>{
//    let fakeuser = new User({
//     email:"user@example.com",
//     username:"delta-student",

//    })
//   let registereduser  =  await User.register(fakeuser,"helloworld");
//   console.log(registereduser);
//   res.send(registereduser);

// })

// //index route

// app.get("/listings" , wrapAsync( async  (req, res)=>{
// const alllistings= await Listing.find({});

// res.render("listings/index.ejs",{alllistings});
// }));

// //create listings
// app.get("/listings/new",  (req, res)=> {
//     res.render("listings/new.ejs");
// })

// //show Route

// app.get("/listings/:id",  wrapAsync(async  (req, res)=> {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");;

// // console.log(listing);
// res.render("listings/show.ejs", {listing} );

// }));

// app.post("/listings" ,validatelisting, wrapAsync( async (req, res, next)=> {

//         let {title, price,location,country, description, image } = req.body;
//     console.log(price);
//     console.log("description")

//     // console.log(req.body.listing);

//     // if((req.body.title && req.body.price &&req.body.location && req.body.country && req.body.description && req.body.image))  {
//     //     throw new ExpressError(404 , " Send valid data for listing");
//     // }
//     // if(!req.body.title){
//     //     throw new ExpressError(404 , " title is missing");

//     // }
//     // if(!req.body.description){
//     //     throw new ExpressError(404 , " Description is missing");

//     // }
//     // if(!req.body.price){
//     //     throw new ExpressError(404 , " price is missing");

//     // }
//     // if(!req.body.location){
//     //     throw new ExpressError(404 , "location is missing");

//     // }
//     // if(!req.body.country){
//     //     throw new ExpressError(404 , " country is missing");

//     // }
//     // if(!req.body.image){
//     //     throw new ExpressError(404 , " image  is missing");

//     // }

//   await  Listing.insertMany([{title: title, price: price, location: location, country: country , description:description ,image:image}]);
// // const newListing = new Listing(req.body.listing);
// // console.log(newListing);
// // await newListing.save();
// res.redirect("/listings");

// }));

// //edit the listings
// app.get("/listings/:id/edit",  wrapAsync(async (req, res)=> {
//     let {id}= req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});

// }));

// app.put("/listings/:id", wrapAsync(async (req, res)=>{
//     let {id}= req.params;
//     let {title: title, price: price, location: location, country: country , description:description , image: image} =req.body;
//     await Listing.findByIdAndUpdate(id,{title: title, price: price, location: location, country: country , description:description ,image: image});
//     res.redirect("/listings")   ;
// }));

// app.delete('/listings/:id', wrapAsync(async(req,res) => {
//     let {id}= req.params;
//     //const listing = await Listing.findById(id);
//      await Listing.findByIdAndDelete(id,{});
//     res.redirect("/listings");
// }));
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "page not found"));
// });

// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "something went wrongg" } = err;
//   res.status(statusCode).render("listings/error.ejs", { message });
// });

// app.get("/testlisting",  async (req,res)=>{
//     let samplelisting = new Listing({
//         title:"My New villa ",
//         description :"By the beach ",
//         price: 1200,
//         location: "Calangute , Goa",
//         country:"India",
//     });

//   await  samplelisting.save();
//   console.log("Sample was saved successfully");
//   res.send("Sample was saved successfully");
// })

app.listen(port, () => {
  console.log("listening on port  " + port);
});
