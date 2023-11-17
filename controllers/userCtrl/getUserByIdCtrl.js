const { asyncHandler, User, validateMongooseId } = require("./modules");

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


module.exports =  getUserById 