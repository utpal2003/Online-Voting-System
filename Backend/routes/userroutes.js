const express = require('express');
const router = express.Router();

const { signup, login, getprofile,changepassword } = require('../controllers/usercontrollers');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getprofile);
router.put('/profile/password', authMiddleware, changepassword);

module.exports = router;
