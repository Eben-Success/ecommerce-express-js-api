const { asyncHandler, User, multer, path } = require("./modules");

// upload profile picture
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        filesize: 10000000 // 10000000 Bytes = 10 MB
    }
})


// Create a User
const createUser = asyncHandler(async (req, res) => {

    // Get email from req.body
   
    const email = req.body.email;

    //check if user exists
    const findUser = await User.findOne({email: email});
    
    if (!findUser){
        // create user
        if (req.file){
            // Save file path or URL to the user's profilePicture field
            
            req.body.profile = req.file.path;
            
        }

        const newUser = await User.create(req.body);
        res.json(newUser);
    }
    else {
        res.status(400);
        throw new Error("User already exists");
    }
})




module.exports = { createUser, upload, storage };