const db = require("../config/db.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const nodemailer = require('nodemailer');
const cryptoRandomString = require("crypto-random-string");
const User = db.get('users');

// User Signin
exports.signin = async (req,res)=>{
  try{
    let uname = req.body.username;
    let pw = req.body.password;
    let user = await User.find(u=>u.username===uname || u.email===uname ).value();
    if(!user){
      res.status(404).send({
        message:"User Not Found",
        status:404
      });
      return;
    }
    var passwordIsValid = bcrypt.compareSync(pw,user.password);
    if(!passwordIsValid){
      return res.status(401).send({
        message: "Invalid Password!",
        status:401
      });
    }
    var token = jwt.sign({ id: user.id,role:user.role }, config.secret, {
      expiresIn: 86400 // 24 hours
    });
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token,
      status:200
    });
  }catch(err){
    res.status(500).send({ status:500,message: err });    
  }

}

//User Signup
exports.signup = async (req, res) => {
  const randomCode = cryptoRandomString({
    length: 128,
  });
  let data = req.body;
  data.password = bcrypt.hashSync(data.password, 8)
  !data.role ? data.role = "user" : '',
    data.isActive = true;
  data.isVerified = false;
  data.randomCode = randomCode;
  data.createdOn = new Date().toISOString();
  try {
    let record = await User.insert(data).write();

    let transporter = nodemailer.createTransport(config.mailTransporter);
    const mailData = {
      from: 'imadlwxn79@gmail.com',
      to: record.email,
      subject: 'Email Verification for Fruits & Vegetables',
      html: `<p>Click <a href="${config.url}/verification/verify-account/${record.id}/${randomCode}">here</a> to Verify your account</p>`
    };
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        res.status(201).send({status:201, message: "User registered successfully! Mail Error" });
      }
      else {
        res.status(201).send({status:201, message: "User registered successfully! Mail Success" });
      }
    });
  } catch (err) {
    res.status(500).send({ status:500,message: err });
  }

}



// Verify Email Id
exports.verifyAccount = async (req, res) => {
  try {
    let uid = req.params.userId;
    let secretCode = req.params.secretCode;
    let record = await User.find({ id: uid });
    let obj = record.value();
    if (!obj) {
      res.status(404).send("User Not Found");
      return;
    }
    if (obj.randomCode === secretCode) {
      await record.unset('randomCode').write();
      await record.assign({ "isVerified": true }).write();
      res.redirect("/verified");
    }else{
      res.status(401).send( "Invalid Token" );
    }
  } catch (err) {
    res.status(500).send({ status:500,message: err });
  }

}

// Forgot Password
exports.forgetPW = async (req,res)=>{
  try{
    let email = req.params.email;
    let record = User.find({email:email});
    let user = record.value();
    if (!user) {
      res.status(404).send({ status:404, message: "User Not found" });
      return;
    }
    let newpw = cryptoRandomString({length: 8});
    await record.assign({ "password": bcrypt.hashSync(newpw, 8) }).write();
    let transporter = nodemailer.createTransport(config.mailTransporter);
    const mailData = {
      from: 'manoharsuthra@gmail.com',
      to: email,
      subject: 'New Password',
      html: `<p>Your new Password is <b>${newpw}</b></p>`
    };
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        res.status(204).send({status:204, message: err });
      }
      else {
        res.status(204).send({ status:204, message: "New Password sent to your registered email id" });
      }
    });
  }catch(err){
    res.status(500).send({ status:500,message: err });
  }

}

// Change password 
exports.changePW = async(req,res)=>{
  try{
    let np = req.body.newPW;
    await User.find({id:req.userId}).assign({"password":bcrypt.hashSync(np, 8)}).write();
    res.status(204).send({
      status: 204,
      message: "Password Changed Successfully"
    });
  } catch(err){
    res.status(500).send({ status:500,message: err });
  } 
}