import {
  User,
  validateMongooseId,
  asyncHandler
} from "./modules.js";

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

  module.exports = { updateUser }