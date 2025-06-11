const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate JWT Token
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// SIGNUP
const signup = async (req, res) => {
    try {
        const { name, age, email, mobile, address, AdharNumber, password,role} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            age,
            email,
            mobile,
            address,
            AdharNumber,
            password: hashPassword,
            role
        });

        const savedUser = await newUser.save();

        const payload = { id: savedUser._id };
        const token = generateToken(payload);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                ...savedUser._doc,
                password: undefined
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { AdharNumber, password } = req.body;

        if (!AdharNumber || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ AdharNumber });
        console.log(AdharNumber)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Aadhaar number or password" });
        }

        const payload = { id: user._id };
        const token = generateToken(payload);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "User login successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
};

// GET PROFILE
const getprofile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

// Change password

const changepassword = async (req, res) => {
    try {
        const userid = req.user.id;
        const { currentpasword, newpassword } = req.body;
        if (!currentpasword || !newpassword) {
            return res.status(400).json({ error: "Please fill all the field" })
        }

        const user = await User.findOne({ userid });
        // it's not required
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const ismatch = await bcrypt.compare(currentpasword, user.password);
        if (!ismatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hashpassword = await bcrypt.hash(newpassword, 10);

        user.password = hashpassword;
        await user.save();
        res.status(200).json({ message: "password changed succefullt" })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to change password" })
    }
}

module.exports = {
    signup,
    login,
    getprofile,
    changepassword
};
