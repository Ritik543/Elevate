// const Listing = require("../models/listing");
// const Review = require("../models/review");
const user =require("../models/user");


module.exports.signup = async (req, res) => {

    res.render('users/signup.ejs');
    
    };


    //post signup

    module.exports.postsignup = async (req, res) => {
         console.log("Signup page");
        try{
    let {username , password , email} = req.body;
    let newuser=  new user({username: username,  email: email});
      let registereduser=   await user.register(newuser,password);
      console.log(registereduser);
      req.logIn(registereduser,(err)=>{
    if(err){
        next(err);
    }
    req.flash('success','Welcome to the Elevates !');
    res.redirect('/listings'); 
    
    
    });
      
    //   req.flash('success','Successfully registered');
    //   res.redirect('/listings');
    
    }
        catch(e){
    req.flash('success','e.message');
    res.redirect('/signup');
        }
    
    };

    //login
    module.exports.login =async (req, res) =>{
        res.render('users/login.ejs');
        }


        module.exports.loginpost =async (req,res) =>{
            req.flash('success','Welcome to the Elevates you are logged in!');
            
            let redirecturls= res.locals.redirecturl || "/listings"; 
            res.redirect(redirecturls); 
            // console.log(res.locals.redirecturl,"red");
         };




         //logout

         module.exports.logout = async (req, res,next) =>{
            req.logout((err)=>{
                if(err){
                    next(err);
                }
                req.flash('success','you have logged out');
                res.redirect('/listings');
            })
        }