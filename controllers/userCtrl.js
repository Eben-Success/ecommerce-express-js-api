const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const cookie = require('cookie');
const validateMongooseId = require('../utils/validateMongooseId');
const {generateRefreshToken} = require('../config/refreshtoken');
const {generateToken} = require('../config/jwtToken');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const multer = require('multer');
const path = require('path');

// Create a User
const createUser = asyncHandler(async (req, res) => {

    // Get email from req.body
    const email = req.body.email;

    //check if user exists
    const findUser = await User.findOne({email: email});
    
    if (!findUser){
        // create user
        const newUser = await User.create(req.body);
        res.json(newUser);
    }
    else {
        res.status(400);
        throw new Error("User already exists");
    }
})

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  });


// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  const findAdmin = await User.findOne({email});

  // if not admin throw error
  if (findAdmin.role !== "admin"){
    res.status(401)
    throw new Error("Not authorized as an admin");
  }

  // if admin check password
  if (findAdmin && (await findAdmin.isPasswordMatched(password))){
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateAdmin = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      }, 
      {
        new: true
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      _id: findAdmin?.__id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else{
    throw new Error("Invalid Credentials")
  }

})

// upload profile picture
const storage = multer.diskStorage({
  destination: "../upload/profile_pics"

  })


// logout user
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate({
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});


// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    try{
        const users = await User.find({});
    res.json(users);
    } 
    catch (error){
        res.status(400)
        throw new Error(error);
    } 
})

// Get a User by ID
const getUserById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongooseId(id);

        try {
            const user = await User.findById(id);
            res.json({user});
        }
        catch (error) {
            res.status(400);
            throw new Error(error);
        };
})

// Update a user
const updateUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  const {_id} = req.user;
  validateMongooseId(_id);

  try{
    const updatedUser = await User.findByIdAndUpdate(
      _id, {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      }, 
      {new: true}
    );
    res.json(updatedUser);

  } catch (error){
    throw new Error(`Error updating user: ${error}`)
  }
})

//update password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongooseId(_id);

  const user = await User.findById(_id);
  if (!user){
    res.status(400);
    throw new Error("User not found");
  }

  user.password = password;
  const updatedUser = await user.save();
  res.json(updatedUser);
})

// save User Address
const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongooseId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id, {
        address: req?.body?.address,
      }, {
        new: true
      }
    );
    res.json(updateUser);
    
  } catch (error){
    throw new Error(`Error saving address: ${error}`)
  }
})

// delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongooseId(id);

  try{
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error){
    throw new Error(`Error deleting user: ${error}`)
  }
})


// block a User
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongooseId(id);

  try{
    const blockedUser = await User.findByIdAndUpdate(
      id, 
      {
        isBlocked: true,
      }, 
      {
        new: true
      }
    );
    res.json(blockedUser);

  } catch (error){
    throw new Error(`Error blocking user: ${error}`)
  }
})

// Unblock a User
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongooseId(id)

  try{
    const unblockedUser = await User.findByIdAndUpdate(
      id, 
      {
        isBlocked: false,
      }, 
      {new: true}
    );
    res.json(unblockedUser)
  } catch (error){
    throw new Error(`Error unblocking user: ${error}`)
  }
})

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if (!cookie?.refreshToken){
      throw new Error("No refresh token found for the cookie");
    }

    const refreshToken = cookie.refreshToken;
    
    const findUser = await User.findOne({refreshToken});

    if (!findUser){
      throw new Error("New refresh token present in DB or not matched")
    }

    // verify refreshToken
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      
      if (err || findUser.id !== decoded.id){
        throw new Error("Invalid refresh token");
      }

      // generate new refresh token
      const accessToken = generateToken(findUser?._id);
      res.json({ accessToken });
    })
})


module.exports = {
    createUser,
    loginUserCtrl,
    loginAdmin,
    getAllUsers,
    getUserById,
    logout,
    updateUser,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
    updatePassword,
    handleRefreshToken,
}