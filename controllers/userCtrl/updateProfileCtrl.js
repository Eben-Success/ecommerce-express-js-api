const { asyncHandler, User } = require("./modules");

const updateProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user){
            return res.status(404).json({message: "User not found"});
        }
    
        if (req.file){
            user.profile = req.file.path;
        }
    
        const updateUser = await user.save();
        res.json(updateUser);

    } catch(error){
        res.status(500).json({message: error.message})
    }
   
    
})


module.exports = updateProfile;