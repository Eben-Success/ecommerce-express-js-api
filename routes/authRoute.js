const { createUser, upload} = require('../controllers/userCtrl/createUserCtrl');
const loginUserCtrl = require('../controllers/userCtrl/loginUserCtrl');
const loginAdmin = require('../controllers/userCtrl/loginAdminCtrl');
const handleRefreshToken = require('../controllers/userCtrl/handlerefreshTokenCtrl');
const logout = require('../controllers/userCtrl/logoutUserCtrl');
const getAllUsers = require('../controllers/userCtrl/getAllUsersCtrl');
const getUserById = require('../controllers/userCtrl/getUserByIdCtrl');
const updateUser = require('../controllers/userCtrl/updateUserCtrl');
const blockUser = require('../controllers/userCtrl/blockUserCtrl');
// const unblockUser = require('../controllers/userCtrl/unblockUserCtrl');

const express = require('express');
const router = express.Router();

const { notFound, errorHandler } = require('../middlewares/errorHandler');

// POST REQUESTS
router.post("/register", upload.single("profile"), createUser);
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
// router.put('/unblock-user/:id', unblockUser)
router.put('/edit-address/:id', updateUser)

module.exports = router;
