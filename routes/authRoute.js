const express = require('express');
const router = express.Router();
const {
    createUser,
    loginUserCtrl,
    loginAdmin,
    getAllUsers,
    getUserById,
    blockUser,
    unblockUser,
    updateUser,
    logout,
    handleRefreshToken,
    // upload,
    storage


} = require('../controllers/userCtrl');``
const multer = require('multer');
const { notFound, errorHandler } = require('../middlewares/errorHandler');

const upload = multer({
    storage: storage,
    limits: {
        filesize: 10000000 // 10000000 Bytes = 10 MB
    }
})


router.post("/register", upload.single("profile"), createUser);

// POST REQUESTS

router.post('/login', loginUserCtrl);

router.post('/login-admin', loginAdmin);

// GET REQUEST
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout)
router.get('/all-users', getAllUsers);
router.get('/:id', getUserById);

// PUT REQUESTS
router.put('/edit-user', updateUser);   
router.put('/block-user/:id', blockUser);
router.put('/unblock-user/:id', unblockUser)
router.put('/edit-address/:id', updateUser)

module.exports = router;
