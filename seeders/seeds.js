const bcrypt = require("bcryptjs");
const { User }=require("../models/users");
const { connect }=require("../config/config.js");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const seedUser=async()=>{
    const adminUser=[{
        firstName: "IRAFASHA",
        lastName:"Gedeon",
        gender:"Male",
        email: process.env.USER_EMAIL,
        telNumber:"0780689938",
        role:"administrator",
        password:await bcrypt.hash(process.env.USER_PASSWORD, 12),
        passwordResetToken:"",
        profilePicture:[],
        createdAt:""
    }]

    try {
        await User.deleteMany({});
        await User.insertMany(adminUser);
        console.log("Default user created succesfully")
    } catch (error) {

        console.log("Creating default user failed\n",error);
        
    }

}

connect().then(() => {
    console.log("Database connected!");
    seedUser().then(()=>{
        mongoose.connection.close();
    });
})

