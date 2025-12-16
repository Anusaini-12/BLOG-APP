import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },
        
        profilePic: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
            maxlength: 100,
        },

        followers: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        ],

        following: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        ], 

        savedBlogs: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
        ],

        isVerified: {
            type: Boolean,
            default: false,
        },

        verificationCode: {
            type: String,
        },

        verificationCodeExpires: {
            type: Date,
        },

        resetPasswordToken: {
            type: String,
        },

        resetPasswordExpires: {
            type: Date,
        },
        
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        lastActive: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps : true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;