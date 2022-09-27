const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
// const cookieparser = require('cookie-parser')

dotenv.config({ path: './config.env'});

require('./db/conn');
// const User = require('./model/userSchema');

app.use(express.json());

// we link the router files to make our route easy
app.use(require('./router/auth'));

const PORT = process.env.PORT || 5000;

// app.use(cookieparser());





// app.get('/about', (req, res) => {
//     console.log(`Hello my About`);
//     res.send('Hello about world from the server');
// });

// app.get('/contact', (req, res) => {
//     // res.cookie("Test", 'awesome');
//     res.send('Hello contact world from the server');
// });

app.get('/signin', (req, res) => {
    res.send('Hello Login world from the server');
});

app.get('/signup', (req, res) => {
    res.send('Hello Registration world from the server');
});

//3: Step heroku

if (process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
}

app.listen(PORT, () => {
      console.log(`server is running at port no ${PORT}`);
})