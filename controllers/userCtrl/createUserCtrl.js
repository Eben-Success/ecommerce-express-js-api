import { 
    User,
     asyncHandler
     } from "./modules.js";

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


module.exports = createUser