import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import sendEmail from "../utils/sendEmail.js";

/* ------------------ REGISTER USER ------------------ */
export const registerUser = expressAsyncHandler( async (req, res) => {
        const {name, email, password} = req.body;

        //check all fields
        if(!name || !email || !password){
            res.status(400);
            throw new Error("Please enter all fields!");
        }

        //if user exists
        const userExists = await User.findOne({email});
        if(userExists){
            res.status(400);
            throw new Error("User already Exists!");
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //generate otp
        const verificationCode =  Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
        const expiry = Date.now() + 10 * 60 * 1000; // 10 mins

        //create user 
        const user = await User.create({
            name, 
            email, 
            password: hashPassword,
            isVerified: false,
            verificationCode,
            verificationCodeExpires: expiry,
            role: email === "serene112003@gmail.com" ? "admin" : "user"
        });

        console.log(user);


        if(user){

        //send email
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <p>Dear User,</p>
          <p>Your verification code is:</p>
          <div style="color: green; font-size: 20px; font-weight: bold; text-align: center">${verificationCode}</div>
          <p>This code will expire in 10 minutes.</p>
          </div>
          `;
        
          await sendEmail(user.email, "Verify Your Pixi Account", htmlContent);

            res.status(201).json({
              message: "OTP sent to your email. Please verify your account.",
              email: user.email,
            });        
        }
        else {
            res.status(400);
            throw new Error("Invalid user data!");
        }
});


/* ------------------ VERIFY OTP ------------------ */
export const verifyOtp = expressAsyncHandler( async(req, res) => {
    const { email, code} = req.body;
    
    if(!email || !code){
        res.status(400);
        throw new Error("Email and OTP are required.");
    }

    const user = await User.findOne({email});

    if(!user){
        res.status(404);
        throw new Error("User not found!");
    }

    //check if already verified
    if(user.isVerified){
        return res.status(200).json({
            message: "User already verified! Please login.",
        });
    }

    //check otp
    if(user.verificationCode !== code){
        res.status(400);
        throw new Error("Invalid OTP");
    }

    //check if OTP expires
    if(user.verificationCodeExpires < Date.now()){
        res.status(400);
        throw new Error("OTP expired. Please request a new one.");
    }

    //mark user as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    res.status(200).json({
        message: "Congratulations! Your OTP verification has been successfully verified.",
    })

});

/* ------------------ RESEND OTP ------------------ */
export const resendOtp = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required.');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found!');
  }

  if (user.isVerified) {
    return res.status(400).json({
      message: 'User already verified. No need to resend OTP.',
    });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 mins

  user.verificationCode = verificationCode;
  user.verificationCodeExpires = expiry;
  await user.save();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>Dear User,</p>
      <p>Your new verification code is:</p>
      <div style="color: pink; font-size: 20px; font-weight: bold; text-align: center">${verificationCode}</div>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;
  await sendEmail(user.email, 'Your New OTP Code', htmlContent);

  res.status(200).json({
    message: 'OTP resent successfully!',
  });
});

/* ------------------ LOGIN USER ------------------ */
export const loginUser = expressAsyncHandler( async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(!user){
        res.status(404);
        throw new Error("User not found!");
    }
    
    //check if user is verified
    if (!user.isVerified) {
        res.status(401);
       throw new Error("Please verify your account before logging in.");
    }

    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        res.status(400);
        throw new Error("Invalid Credentials")
    }

    console.log(user);
    res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
        message: "Login successful!"
    });
});


/* ------------------ FORGOT PASSWORD ------------------ */
export const forgotPassword = expressAsyncHandler( async (req, res) => {
    const {email} = req.body;

    const user = await User.findOne({ email });
    if(!user){
        res.status(404);
        throw new Error("User not found!");
    }
   
    //generate a password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins;
    await user.save();
    
    //create password reset URL 
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    //message
    const htmlContent = `
        <div style="font-family: Arial, sans-serif;">
            <p>Dear User,</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetURL}" style="color: pink; font-weight: bold;">Reset Password</a>
            <p>This link will expire in 10 minutes.</p>
        </div>
    `;

      try{
        await sendEmail(user.email, "Reset Your Pixi Password", htmlContent);
        res.status(200).json({ message: "Password reset link sent to your email." })
      } catch (err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(500);
        throw new Error("Email could not be sent. Try again later.");
      }
});


/* ------------------ RESET PASSWORD ------------------ */
export const resetPassword = expressAsyncHandler( async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if(!user){
        res.status(400);
        throw new Error("Invalid or expired password reset token.");
    }
    
    //hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    //clear token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
        message: "Password reset successful! You can now log in."
    });
});

/* ------------------ GET CURRENT USER ------------------ */
export const getMe = expressAsyncHandler( async(req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    
    res.status(201).json(user);
});


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}
