const User = require('../models/user');
const Token = require('../models/token');
const { sendEmail } = require('../utils/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.register = async (req, res) => {
    try {
        console.log("---------------")
        console.log(req.body)
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) return res.status(401).json({ message: 'The email address already exist.' });
        const newUser = new User({ ...req.body });
        const user_ = await newUser.save();

        res.status(200).json({ user: user_, message: 'User created successfully' });


        // await sendVerificationEmail(user_, req, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user)


        if (!user) return res.status(401).json({ msg: 'Email not found.' });
        if (!user.comparePassword(password)) return res.status(401).json({ message: 'Invalid email or password' });

        // To enable user verification check
        // if (!user.isVerified) return res.status(401).json({ type: 'not-verified', message: 'Your account has not been verified.' });

        // Login successful, write token, and send back user
        res.status(200).json({ token: user.generateJWT(), user: user });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.resetPassword = async (req, res, next) => {
    // console.log(req.body)
    try {
        const { email, password, newPassword } = req.body;
        const user = await User.findOne({ email });
        // console.log(user)
        if (!user) return res.status(401).json({ msg: 'Email not found.' });
        if (!user.comparePassword(password)) return res.status(401).json({ message: 'Invalid email or password' });

        user.password = newPassword
        user.save();

        res.status(200).json({ token: user.generateJWT(), user: user });


        // user.createPassword(newPassword)
        // bcrypt.genSalt(10, function (err, salt) {
        //     if (err) return next(err);

        //     bcrypt.hash(newPassword, salt, function (err, hash) {
        //         if (err) return next(err);

        //         user.password = hash
        //         const newUser = { ...user, password: user.password }

        //         console.log(newUser)
        //         const today = new Date();
        //         const expirationDate = new Date(today);
        //         expirationDate.setDate(today.getDate() + 60);

        //         let payload = {
        //             id: user._id,
        //         };

        //         const generateJWT = jwt.sign(payload, process.env.JWT_SECRET, {
        //             expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
        //         })
        //         console.log(generateJWT)

        //         // if (hash) {
        //         res.status(200).json({ token: generateJWT, user: newUser });
        //         // }
        //         // next();
        //     });
        // });

        // res.status(200).json({ token: user.generateJWT(), user: user });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};



exports.verify = async (req, res) => {
    if (!req.params.token) return res.status(400).json({ message: "We were unable to find a user for this token." });

    try {
        // Find a matching token
        const token = await Token.findOne({ token: req.params.token });

        if (!token) return res.status(400).json({ message: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        User.findOne({ _id: token.userId }, (err, user) => {
            if (!user) return res.status(400).json({ message: 'We were unable to find a user for this token.' });

            if (user.isVerified) return res.status(400).json({ message: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) return res.status(500).json({ message: err.message });

                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// @route POST api/resend
// @desc Resend Verification Token
// @access Public
exports.resendToken = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });

        if (user.isVerified) return res.status(400).json({ message: 'This account has already been verified. Please log in.' });

        await sendVerificationEmail(user, req, res);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

async function sendVerificationEmail(user, req, res) {
    try {
        const token = user.generateVerificationToken();

        // Save the verification token
        await token.save();

        let subject = "Account Verification Token";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let link = "http://" + req.headers.host + "/api/auth/verify/" + token.token;
        let html = `<p>Hi ${user.username}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;

        await sendEmail({ to, from, subject, html });

        res.status(200).json({ message: 'A verification email has been sent to ' + user.email + '.' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}