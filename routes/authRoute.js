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
    updateUser

} = require('../controllers/userCtrl');
const { notFound, errorHandler } = require('../middlewares/errorHandler');


// POST REQUESTS
router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/login-admin', loginAdmin);

// GET REQUEST
router.get('/all-users', getAllUsers);
router.get('/:id', getUserById);

// PUT REQUESTS
router.put('/edit-user', updateUser);   
router.put('/block-user/:id', blockUser);
router.put('/unblock-user/:id', unblockUser)
router.put('/edit-address/:id', updateUser)
module.exports = router;
