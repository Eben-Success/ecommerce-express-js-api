import {
  User,
  generateRefreshToken,
  generateToken,
  asyncHandler,
  
  
} from './modules.js';

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
  

  module.exports = loginAdmin