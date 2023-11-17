const { asyncHandler, User } = require("./modules");


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


module.exports =  getAllUsers 