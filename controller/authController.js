//Import the dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var router = express.Router();

const UserModel = mongoose.model('User');

// Render signin interface
router.get('/', (req, res) => {
    res.render("auth/signin");
});

// Authenticating user
router.post('/', async(req, res) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email}) // Query DB if user exist
    const isMatch = await bcrypt.compare(password, user.password);

    if(!user) { return res.redirect('/') }; // Check if email didnt exist in DB
    if(!isMatch) { return res.redirect('/') }; // Check if password didnt exist in DB

    req.session.isAuth = true; // Starting session cookie
    console.log("\nSession ID = ".concat(req.session.id));
    res.redirect('/course');
});

// Render signup interface
router.get('/signup', (req, res) => {
    res.render("auth/signup")
});

// Register user
router.post('/signup', async(req, res) => {
    const {email, password} = req.body;
    let user = await UserModel.findOne({email}); // Query DB if user exist

    // If email exist, redirect back to signin page to try other email
    if(user) { res.redirect('/'); }

    const hashed = await bcrypt.hash(password, 12);
    user = UserModel({ email, password: hashed });
    await user.save();

    res.redirect('/');
});

module.exports = router;