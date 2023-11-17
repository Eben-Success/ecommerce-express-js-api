const asyncHandler = require("express-async-handler");
const cookie = require('cookie');
const dotenv = require('dotenv').config();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const express = require('express');
const path = require('path');
const app = express();

// User defined modules
const User = require('../../models/userModel');
const validateMongooseId = require("../../utils/validateMongooseId");
const { generateRefreshToken } = require('../../config/refreshtoken');
const { generateToken } = require('../../config/jwtToken');








module.exports = {
    app,
    asyncHandler,
    User,
    cookie,
    validateMongooseId,
    generateRefreshToken,
    generateToken,
    jwt,
    dotenv,
    multer,
    path }