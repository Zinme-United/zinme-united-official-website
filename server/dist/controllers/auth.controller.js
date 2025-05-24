"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const crypto = __importStar(require("crypto"));
exports.registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { username, email, password, role } = req.body;
    // Basic validation
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please enter all required fields: username, email, password.");
    }
    // Check if user already exists
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User with this email already exists.");
    }
    // Create user
    const user = await User_1.default.create({
        username,
        email,
        password,
        role: role || "public",
    });
    if (user) {
        const userId = user._id;
        res.status(201).json({
            message: "User registered successfully.",
            data: {
                _id: userId,
                username: user.username,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.default)(userId.toString()),
            },
        });
    }
    else {
        res.status(400);
        throw new Error("Invalid user data.");
    }
});
exports.loginUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email }).select("+password");
    if (user && (await user.matchPassword(password))) {
        const userId = user._id;
        res.json({
            message: "Logged in successfully.",
            data: {
                _id: userId,
                username: user.username,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.default)(userId.toString()),
            },
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid credentials (email or password).");
    }
});
exports.getUserProfile = (0, express_async_handler_1.default)(async (req, res) => {
    if (req.user) {
        res.json({
            message: "User profile fetched successfully.",
            data: {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
            },
        });
    }
    else {
        res.status(404);
        throw new Error("User not found.");
    }
});
exports.forgotPassword = (0, express_async_handler_1.default)(async (req, res) => {
    const { email } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user) {
        res.status(200).json({
            message: "If a user with that email exists, a password reset process has been initiated.",
            devOnly: {
                warning: "Token is returned directly for development/testing. In production, this would be sent via email.",
                tokenDetails: null,
            },
        });
        return;
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // FOR DEVELOPMENT/TESTING ONLY: Output the token to the console and response
    const resetURL_for_dev = `${req.protocol}://${req.get("host")}/api/auth/resetpassword/${resetToken}`;
    console.log(`\n--- DEV ONLY: PASSWORD RESET TOKEN ---`);
    console.log(`For email: ${user.email}`);
    console.log(`Token: ${resetToken}`);
    console.log(`Reset URL (PUT request): ${resetURL_for_dev}`);
    console.log(`Token expires: ${user.resetPasswordExpire?.toLocaleString()} (Thailand Time)`); // Convert to local time for clarity
    console.log(`------------------------------------\n`);
    res.status(200).json({
        message: "Password reset request processed. Check server logs or response for token (Development Mode).",
        devOnly: {
            warning: "Token is returned directly for development/testing. In production, this would be sent via email.",
            resetToken: resetToken,
            resetURL: resetURL_for_dev,
        },
    });
});
exports.resetPassword = (0, express_async_handler_1.default)(async (req, res) => {
    const { password } = req.body;
    // Hash the token from the URL parameter to compare it with the hashed token stored in the database
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    // Find the user by the hashed token and ensure the token is not expired
    const user = await User_1.default.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }, // $gt: greater than (token expiration time > current time)
    });
    if (!user) {
        res.status(400); // Bad Request
        throw new Error("Invalid or expired password reset token.");
    }
    // Update the user's password (the pre-save hook in the User model will hash it)
    user.password = password;
    user.resetPasswordToken = undefined; // Clear the token after successful use
    user.resetPasswordExpire = undefined; // Clear the expiration time
    await user.save(); // Save the user with the new hashed password
    // Optionally, log the user in immediately after resetting password
    const userId = user._id;
    res.status(200).json({
        message: "Password reset successful. You are now logged in.",
        data: {
            _id: userId,
            username: user.username,
            email: user.email,
            role: user.role,
            token: (0, generateToken_1.default)(userId.toString()), // Issue a new JWT
        },
    });
});
