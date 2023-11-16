import { asyncHandler } from "./module.js";

// upload profile picture
const storage = multer.diskStorage({
    destination: "../upload/profile_pics"
  
    })


const uploadProfile = {}

module.exports = uploadProfile