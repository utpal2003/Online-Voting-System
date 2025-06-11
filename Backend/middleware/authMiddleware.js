// const express = require('express');
const jwt = require('jsonwebtoken')
require('dotenv').config();


const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.state(401).json({ error: "access denied" })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

module.exports = {authMiddleware}