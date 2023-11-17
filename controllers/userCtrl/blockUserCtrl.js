const { asyncHandler, User, validateMongooseId } = require("./modules");


// block a User
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongooseId(id);
  
    try{
      const blockedUser = await User.findByIdAndUpdate(
        id, 
        {
          isBlocked: true,
        }, 
        {
          new: true
        }
      );
      res.json(blockedUser);
  
    } catch (error){
      throw new Error(`Error blocking user: ${error}`)
    }
  })

module.exports = blockUser 