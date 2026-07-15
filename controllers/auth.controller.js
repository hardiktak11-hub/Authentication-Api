import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

//Register Api
export const registerUser = async (req, res) => {
    try {

        const username= req.body.username;
        const email= req.body.email;
        const password= req.body.password;

//if username/email/password is not written then request is failed        
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
//if user already existed then too request is failed
        const existingUser = await User.findOne({
          $or:[{email},{username}]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }
//creating the new entry in the databse
        const newuser = await User.create({
            username,
            email,
            password
        });

//here we are removing sensitive field from databse 
        const registeredUser = await User.findById(newuser._id).select(
        "-password -refreshToken"
        )

//this checks if after saving our new entry we are unable to retrieve that or not then we through this error altough this is usually not the case it only happens when some internal error in mongoose occur so for extreme safety even after saving the entry we are checking it again         
        if (!registeredUser) {
    return res.status(500).json({
        success: false,
        message: "Failed to register user"
    });
}

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user:registeredUser
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Login Api
export const loginUser = async (req, res) => {
    try {

        const email = req.body.email;
        const password= req.body.password;

//if email/password are not written then request is failed
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

//if user is not present then too request gets failed        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

//compare password and if password and if not matched then req gets failed
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
       
        //generate both tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //save refresh tokens into database
        user.refreshToken= refreshToken;
        await user.save();

        //remove sensitive fields
        const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
        )

        if (!loggedInUser) {
    return res.status(500).json({
        success: false,
        message: "Something went wrong while logging in"
    });
}

//cookies 
const options = {
httpOnly:true,
secure:false
}

        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json({
            success: true,
            message: "Login successful",
            user: loggedInUser,
        });

    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//Logout api

export const logoutUser = async (req, res) => {
    try {

//we get req.user from authmiddle verfication is also done there
//we are removing refreshtoken from database
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        );

//we have to set the cookies same as they were when we created them
        const options = {
            httpOnly: true,
            secure: false
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                success: true,
                message: "Logged out successfully"
            });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// RefreshToken Api

export const refreshAccessToken = async (req, res) => {
    try {

        // Get refresh token from cookies or request body
        const incomingRefreshToken =
            req.cookies.refreshToken || req.body.refreshToken;

        // Check if refresh token exists
        if (!incomingRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request"
            });
        }

        // Verify refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Find user from decoded token
        const user = await User.findById(decodedToken._id);

        // User not found
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        // Check if refresh token matches the one stored in database
        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is expired or already used"
            });
        }

        // Generate new tokens
        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        // Save new refresh token in database
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        // Cookie options
        const options = {
            httpOnly: true,
            secure: false // Change to true in production (HTTPS)
        };

        // Send new cookies
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({
                success: true,
                message: "Access token refreshed successfully"
            });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    }
};