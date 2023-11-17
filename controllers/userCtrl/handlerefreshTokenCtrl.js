const { asyncHandler, User, generateToken, jwt } = require("./modules");


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


module.exports = handleRefreshToken