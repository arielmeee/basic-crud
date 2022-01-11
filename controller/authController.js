//Import the dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var router = express.Router();

const UserModel = mongoose.model('User');

// Render signin interface
router.get('/', (req, res) => {
    res.render('auth/signin', {
        message: req.query.message,
        alertType: req.query.alertType
    })
});

// Authenticating user
router.post('/', async(req, res) => {
    try {
        const {email, password} = req.body;

        // Query DB to find existing emaail
        const user = await UserModel.findOne({email}); 
        // Check if email didnt exist in DB
        if(!user) { return res.redirect('/?message=Please sign up first. &alertType=danger'); };

        // Compare input password to the password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        // Check if password didnt exist in DB
        if(!isMatch) { return res.redirect('/?message=Invalid password! &alertType=danger'); }; 
        
        // Starting session cookie
        req.session.isAuth = true;
        console.log("\nSession ID = ".concat(req.session.id));
        
        // Login the user
        res.redirect('/course'); 
    } catch (error) {
        console.log(error);
    }
});

// Render signup interface
router.get('/signup', (req, res) => {
    res.render("auth/signup", {
        message: req.query.message,
        alertType: req.query.alertType
    })
});

// Register user
router.post('/signup', async(req, res) => {
    try {
        const {email, password} = req.body;
        let user = await UserModel.findOne({email}); // Query DB if user exist

        // If email exist, redirect back to signup page to try other email
        if(user) { res.redirect('/signup?message=Email already exist. &alertType=danger'); }

        const hashed = await bcrypt.hash(password, 12);
        user = UserModel({ email, password: hashed });
        await user.save();

        res.redirect('/?message=Sign up successfully! &alertType=success'); 
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;