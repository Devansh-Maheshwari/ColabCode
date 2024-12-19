const mongoose=require('mongoose');
require("dotenv").config()
exports.connect=()=>{
    mongoose.connect(process.env.URL).then(()=>{console.log("db connected")})
                    .catch((err)=>{console.log(err);process.exit(1);})
}