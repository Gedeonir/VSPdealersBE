const {User}=require('../../models/users')
const emailValidator = require('deep-email-validator');
const sendEmail = require("../utils/Email");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

async function isEmailValid(email) {
    return await emailValidator.validate(email)
  }


const RegisterUser=async(req,res)=>{
    const {
    firstName,
    lastName,
    gender,
    email,
    telNumber,
    password,
    }=req.body;
    
    try {
        if (!firstName||!lastName||!gender||!email||!telNumber||!password) {
            return res.status(409).json({
                message:"All fields are required"
            })
        }

        const {valid, reason, validators} = await isEmailValid(email);


        if(!valid){
            return res.status(409).json({
                message:"Please provide valid email",
                data:{
                    valid,
                    reason
                }
            })
        }

        const userExists=await User.findOne({email:email});

        if (userExists) {
            return res.status(409).json({
                message:"User email already exists!"
            })
        }

        const encrpytedPassword=await bcrypt.hash(password, 12);

        const newUser=await User.create({
            firstName,
            lastName,
            gender,
            email,
            telNumber,
            role:'user',
            password:encrpytedPassword,
            createdAt:Date.now(),
            isActive:false
        });


        const URL = `<div style="width:50%;margin-left:auto;margin-right:auto"><a href='${process.env.BACKEND_URL}/api/v1/users/verifyAccount/${newUser._id}' style='padding:10px 30px;color:#fff;text-decoration:none; background-color:#ef4444; font-weight:700; border-radius:10px;'>Verify account</a></div>`;
        const message = `
        <div>
            <div style="font-weight:700"><h1>Account verification</h1></div>
            <p>Dear <span style='font-weight:700;'>${newUser.firstName} ${newUser.lastName}</span></p>,
            <p>Welcome to Vehicle spare parts website. Please click the link below to verify your account.<br/><br/></p>
            ${URL}
        </div>
        
        `;
        await sendEmail({
        email: newUser.email,
        subject: "Verify your account.",
        message,
        });

        return res.status(200).json({
            message:"User created successfully\n. We have send you account verification email to  verify your account,check your inbox/spam folder",
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"Unable to register new user",
            error:error.stack
        })
    }
}

const verifyAccount=async(req,res)=>{
    const user=req.params.user;

    try {
        const findUser=await User.findOne({_id:user});

        if(!findUser){
            return res.status(404).json({
                message:"No such user account found"
            })
        }

        findUser.isActive=true;
        await findUser.save();

        return res.status(200).json({
            message:"Your account has been verified"
        })

    } catch (error) {
        return res.status(500).json({
            message:"Account verification failed"
        })
    }
}

const getAllUsers=async(req,res)=>{
    try {
        const allUsers=await User.find({},{password:0,passwordResetToken:0});

        return res.status(200).json({
            message:"Users list",
            count:allUsers.length,
            data:{
                allUsers
            }
        })
    } catch (error) {
        return res.status(500).json({
            message:"Unable to retrieve users",
            error:error
        })
    }
}


const getUser=async(req,res)=>{
    const user=req.params.user
    try {
        const oneUser=await User.findOne({_id:user});

        if (!oneUser) {
            return res.status(404).json({
                message:"User not found",
            })
        }

        return res.status(200).json({
            message:"User fetched succesfully",
            data:{
                oneUser
            }
        })
    } catch (error) {
        return res.status(500).json({
            message:"Error while fetching user",
        })
    }
}

const deleteUser=async(req,res)=>{
    const user=req.params.user
    try {
        const deleteUser=await User.findByIdAndRemove({_id:user});
        return res.status(200).json({
            message:"User deleted succesfully"
        });
    } catch (error) {
        return res.status(500).json({
            message:"Unable to delete user",
            error:error
        })
    }
}

const updateProfile=async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const uuid = decoded.uuid;

    const {
        firstName,
        lastName,
        gender,
        telNumber}=req.body;

    try {
        const updateProfile=await User.findOne({_id:uuid});
        updateProfile.firstName=firstName;
        updateProfile.lastName=lastName;
        updateProfile.gender=gender;
        updateProfile.telNumber=telNumber;

        await updateProfile.save();

        return res.status(200).json({
            message:"Profile updated succesfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            message:"Unable to update profile"
        })
    }
}


module.exports={
    RegisterUser,
    getAllUsers,
    deleteUser,
    updateProfile,
    getUser,
    verifyAccount
}