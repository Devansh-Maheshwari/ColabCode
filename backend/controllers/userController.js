const User= require('../models/user');
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET=process.env.JWT_SECRET;

const userSignup = async(req,res)=>{
    console.log(req.body);
    const {username,email,password}=req.body;
    console.log(username,email,password)
    try{
        const existUser = await User.findOne({email});
        console.log("exist user=",existUser)
        if(existUser){
            return res.status(400).json({message: "User already exists. "});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password:hashedPassword,
        });

        const token = jwt.sign({id:newUser._id},JWT_SECRET,{expiresIn:'1h'});

        res.status(201).json({
            message: "User signedup successfully. ",
            user: { id: newUser._id, name: newUser.username, email: newUser.email },
            token,
        });
    }catch(error){
        res.status(500).json({message: "Error SigningUp user." , error }); 
        console.log(error);
    }
}
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const user = await User.findOne({email});
        console.log("user=",user);
        if(!user){
            return res.status(400).json({message: " Invalid email or password "});
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log("isvalid",isValidPassword)
        if(!isValidPassword){
            return res.status(400).json({message: " Invalid email or password "});
        }
        const token = jwt.sign({id: user._id}, JWT_SECRET,{expiresIn:'1h'});
        res.status(200).json({
            message: 'Login successful',
            user: {id: user._id, name:user.username, email:user.email},
            token,
        })
    }catch(error){
        res.status(500).json({message: "error logging in" ,error});
        console.log(error);
    }
}

module.exports={userLogin,userSignup};