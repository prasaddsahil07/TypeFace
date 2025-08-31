import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// function to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        //finding user from database by _id
        const user = await User.findById(userId)

        //generating Token
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        //saving refreshToken into the database(access token is not added to database)
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })  //automatically mongoose model(password) kick in so we pass validateBeforeSave to avoid this

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


// function to handle user sign up
export const registerUser = async (req, res) => {
    try {
        const { username, name, email, password, gender } = req.body;

        if (!username || !name || !email || !password || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email, username }] });

        if (existingUser) {
            return res.status(409).json({ message: "User with this email or username already exists" });
        }

        // set profile picture
        let profilePicture = "";
        if (gender === "male") {
            profilePicture = "https://avatar.iran.liara.run/public/41"
        }
        else if (gender === "female") {
            profilePicture = "https://avatar.iran.liara.run/public/54"
        }
        else {
            profilePicture = "https://avatar.iran.liara.run/public/46"
        }

        // Create new user
        const newUser = await User.create({
            username,
            name,
            email,
            password,
            profilePicture,
            gender,
        });

        const createdUser = await User.findById(newUser._id).select("-refreshToken -password");

        if (!createdUser) {
            return res.status(500).json({ message: "Internal Server Error while creating new user" });
        }

        res.status(201).json({ message: "User registered successfully", data: createdUser });

    } catch (error) {
        console.log("Error in user registration:", error);
        res.status(500).json({ message: "Internal Server Error while registering user" });
    }
}


// function to handle user login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if password is correct 
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // generate access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        // set httpOnly cookie options
        const options = {
            httpOnly: true,
        }

        // logged in user
        const loggedInUser = await User.findById(user._id).select("-refreshToken -password");

        if (!loggedInUser) {
            return res.status(500).json({ message: "Internal Server Error while login user, no logged in user found" });
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ message: "User logged in successfully", data: loggedInUser });
    } catch (error) {
        console.log("Error in user login:", error);
        res.status(500).json({ message: "Internal Server Error while logging in user" });
    }
}



// logout user
export const logoutUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "User not found, authorization denied" });
        }
        user.refreshToken = "";     // unset refresh token in database
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true
        }

        res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "User logged out successfully" });

    } catch (error) {
        console.error("Error in user logout:", error);
        res.status(500).json({ message: "Internal Server Error while logging out user" });
    }
}


// function to handle access token refresh
export const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            return res.status(401).json({ message: "User not found, authorization denied" });
        }

        if (user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({ message: "Invalid refresh token, authorization denied" });
        }

        // generate new access token
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({ message: "Access token refreshed successfully" });

    } catch (error) {
        console.log("Error while refreshing the Access Token: ", error);
        res.status(500).json({ message: "Internal Server Error while refreshing access token" });
    }
}


// update user details
export const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, gender } = req.body;

        //  get the user
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found for updating details");
            res.status(404).json({ message: "User not found for updating details" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: { name, gender }
            },
            { new: true }
        ).select("-refreshToken -password");

        if (!updatedUser) {
            return res.status(500).json({ message: "Internal Server Error while updating user details" });
        }

        res.status(200).json({ message: "User details updated successfully", data: updatedUser });
    } catch (error) {
        console.log("Error in updating user details:", error);
        res.status(500).json({ message: "Internal Server Error while updating user details" });
    }
}


// change password
export const changeCurrentUserPassword = async (req, res) => {
    try {
        const user = req.user
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ msg: "All fields are required" })
        }

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)     // this method is written in user model

        if (!isPasswordCorrect) {
            return res.status(400).json({ msg: "Invalid old Password" })
        }

        user.password = newPassword     // it's already encrypted in pre-save hook
        await user.save({ validateBeforeSave: false })

        res.status(200).json({ msg: 'Password changed successfully' });

    } catch (error) {
        console.error("Password change error:", error.message);
        return res.status(500).json({ msg: "Internal server error" });
    }
}


// get user details
export const getUser = async(req, res) => {
    try{
        const userId = req.user?._id;

        const user = await User.findById(userId).select("-refreshToken -password");
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User details fetched successfully", data: user });
    } catch(error){
        console.log("Error in getting user details:", error);
        res.status(500).json({ message: "Internal Server Error while getting user details" });
    }
}