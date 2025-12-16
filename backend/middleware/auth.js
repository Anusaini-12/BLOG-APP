import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = expressAsyncHandler( async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            //get token from header 
            token = req.headers.authorization.split(" ")[1];

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //get user from token
            const user = await User.findById(decoded.id).select("-password");
             
            if (!user) {
               res.status(401);
               throw new Error("User not found");
            }
         
            //update last active for current user
            user.lastActive = new Date();
            await user.save({ validateBeforeSave: false });

            req.user = user;
            next();
            return;
        } catch(err){
            res.status(400);
            throw new Error("Not Authorized, token failed!");
        }
    }

    if(!token){
        res.status(400);
        throw new Error("Not Authorized, token failed!");
    }
});

export default protect;