import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend.
    // validation. not empty?
    // check if the user is already exists: username, email.
    // check for images, check for avatar.
    // upload them to cloudinary, avatar.
    // create user object. - create entry in db
    // remove password and refresh token field from the response.
    // check for user creation
    // send response.

    // get user details from frontend.
    const {username, email, fullName, password} = req.body;

    // validation. not empty?
    if([username, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, `${field} is required`);
    }

    // or

    // if(username === "" || email === "" || fullName === "" || password === "" ) {
    //     throw new ApiError(400, "username is required")
    // }

    // check if the user is already exists: username, email.
    const existedUser = await User.findOne({ $or: [{username}, {email}]})
    if (existedUser) {
        throw new ApiError(400, "User with username or email already exists");
    } 

    // check for images, check for avatar.
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0].path;

    let coverImageLocalPath;
    
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0].path;
    }

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // upload them to cloudinary, avatar.
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar file has not been uploaded successfully");
    }

    // Database entry
    const user = await User.create({
        username: username.toLowerCase(),
        email: email,
        fullName: fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password: password,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})

