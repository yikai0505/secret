//jshint esversion:6
require('dotenv').config(); //In the documentation it told us to put this code as early as possible in your application, require and configure dotenv.
//Level2: we are going to use environmental variables to keep certain keys like api keys, ecryption keys, etc. This will be done using the npm package called .ENV
//Essentially it is important to include this file name in the .gitignore files as you do not want to upload it into the internet
//you can go to github and search for .gitignore template file for Node to see the standard files that are important to ignore
//do note we do not want to upload these files to github repositary and reveal the secret keys below at line 32.
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");//note: mongoDB has already been installed locally in this computer, so now you are just installing a framework called mongoose which helps to ease our coding of using mongoDB
const md5 = require("md5"); //Level 3: We will use hash function instead of encryption
//Level3: This way we do not have the vulnerability of the encryption key being stolen, but hashing also comes with its own vulnerability. Like using the HashTable to bruteforce into your account

const app = express();

//console.log(process.env.API_KEY); This is the syntax to be able to grab our data from the .env file

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true , useUnifiedTopology: true});

app.use(express.static("public"));
app.set('view engine', 'ejs'); //this is for templating
app.use(bodyParser.urlencoded({extended: true}));


//Creating our Schema
const userSchema = new mongoose.Schema({ //over here we need to upgrade our normal JS object schema to a full mongoose schema
  //meaning this is no longer a normal JS object but its actually an object that is created from the mongoose schema class.
  email: String,
  password: String
});



//after creating Schema
//Creating the model
const User = new mongoose.model("User", userSchema); //The first User word is the name of the model, the second "User" word in double quotes is the name of the collections


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){ //in this post request to the /request route we will be creating our new users
  const newUser = new User({ //creating a newUser with the User model created on line 35
      email: req.body.username,
      password: md5(req.body.password) //Level3: when user register, it will be hash with md5
  });

  newUser.save(function(err){ //Level 2: so during save it will encrypt the document
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req,res){
  const username=req.body.username;
  const password=md5(req.body.password);

  User.findOne({email:username}, function(err, foundUser){ //Level2: when using find function it will decrypt the document
    //so when you login with your password, mongoose-encrypt will help to decrypt the password stored in the database and use it to compare to the password you just entered.
      if (err) {
        console.log(err);
      } else {
        if (foundUser) { //This checks if there is a foundUser on the database
          if (foundUser.password === password) {
            res.render('secrets');
          }
        }
      }
  });
});


app.listen(3000, function(){
  console.log("Server has started on port 3000.");
});
