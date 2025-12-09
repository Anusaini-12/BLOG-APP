import expressAsyncHandler from "express-async-handler";

const isAdmin = expressAsyncHandler((req, res, next) => {

    if (req.user && req.user.role === "admin") {
        console.log("Current user:", req.user.role);
        next(); // allow admin access
    } else {
        res.status(403);
        throw new Error("Not authorized as admin");
    }
});

export default isAdmin;
