import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
//we get accesstoken from the browser automatically        
        const token = req.cookies.accessToken;

//check weather the access token cookie is present     
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

//verify the jwt and decode its payload
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

//removing sensitive information        
        const loggedinuser = await User.findById(decodedToken._id).select(
            "-password -refreshToken"
        );

        if (!loggedinuser) {
            return res.status(401).json({
                success: false,
                message: "Invalid Access Token"
            });
        }

        req.user = loggedinuser;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token"
        });
    }
};
