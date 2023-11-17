import { asyncHandler, app } from "./module.js";

// upload profile picture
const storage = multer.diskStorage({
    destination: "../upload/profile_pics",
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

app.use()


const uploadProfile = {}

module.exports = uploadProfile