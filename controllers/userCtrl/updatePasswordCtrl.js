const {
    asyncHandler,
    User,
    validateMongooseId

} = require('./modules')

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
  
module.exports = updatePassword