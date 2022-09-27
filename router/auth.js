const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");
const cookieparser = require('cookie-parser')


require('../db/conn');
const User = require("../model/userSchema");


require('cookie-parser');

router.use(cookieparser());


// USING PROMISES

// router.post('/register', (req, res) => {

//     const { name, email, phone, work, password, cpassword} = req.body;

//    if(!name || !email || !phone || !work || !password || !cpassword){
//        return res.status(422).json({error: "Please filled the required details properly"});
//    }

//    User.findOne({ email:email })
//    .then((userExixst) => {
//        if(userExixst){
//            return res.status(422).json({ error: "Email already exist"});
//        }
//        const user = new User({name, email, phone, work, password, cpassword});

//        user.save().then(() => {
//              res.status(201).json({message: "user registered successfully" });
//               }).catch((err) => res.status(500).json({error: "Failed to registered"}));

//        }).catch(err => { console.log(err); });
// });

// ASYNC-AWAIT 

router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

        if (!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({ error: "Please filled the required details properly" });
    }

    try {

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already exist" });
        }else if(password != cpassword){
            return res.status(422).json({ error: "Passwords doesnot match" }); 
        }else{
            const user = new User({ name, email, phone, work, password, cpassword });

            // here it is here
            await user.save();
    
            res.status(201).json({ message: "user registered successfully" });  
        }

        

    } catch (err) {
        console.log(err);
    }
    

});

//Login route

router.post('/signin', async (req,res) =>{
        try{
           let token;
           const { email, password } = req.body;

           if(!email || !password){
               return res.status(400).json({error:"Please fill the details"})
           }

           const userLogin = await User.findOne({ email: email });

        //    console.log(userLogin);

        if(userLogin){

           const isMatch = await bcrypt.compare(password, userLogin.password);

           token = await userLogin.generateAuthToken();
           console.log(token);

           res.cookie("jwtoken", token, {
               expires: new Date(Date.now() + 25892000000),
               httpOnly:true
           });

           if(!isMatch){
               res.status(400).json({ message: "Invalid Credentials pass"});
           }else{
            res.json({ message: "user Signin Successfully"});
           }

        } else {
            res.status(400).json({ message: "Invalid Credentials"});
        }

           

        } catch (error) {
            console.log(error);
        }
});

// about us page

router.get('/about', authenticate ,(req, res) => {
    console.log(`Hello my About`);
    res.send(req.rootUser);
});

// get user data for contact us and home page

router.get('/getdata', authenticate, (req, res) => {
    console.log('Hello my About');
    res.send(req.rootUser)
});


// Contact us page

router.post('/contact', authenticate, async (req, res) => {
    try{
        
        const { name, email, phone, message } = req.body;

        if(!name || !email || !phone || !message){
           console.log("error in contact form");
           return res.json({ error: "please fill the contact form"});
        }

        const userContact = await User.findOne({_id: req.userID });

        if(userContact){

           const userMessage = await userContact.addMessage(name, email, phone, message);

           await userContact.save();

           res.status(201).json({message:"user contacted succesffully"});
           console.log("contact form got submitted");
 
        }
    }
    catch (error){
     console.log(error);
    }
});

// Logout page

router.get('/logout',(req, res) => {
    console.log(`Hello my Logout Page`);
    res.clearCookie('jwtoken', { path: '/'});
    res.status(200).send('User Logout');
});

module.exports = router;


// {
//     "name":"awesome",
//     "email":"awesometech44@gmail.com",
//     "phone":"9876543210",
//     "work":"web dev",
//     "password":"tech44",
//     "cpassword":"tech44"
// }