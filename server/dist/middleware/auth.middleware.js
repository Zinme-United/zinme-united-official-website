"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User")); // Assuming User model path
const express_async_handler_1 = __importDefault(require("express-async-handler")); // For handling async errors gracefully
/**
 * @desc Protects routes by verifying JWT
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
const protect = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token;
    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header (e.g., "Bearer TOKEN_STRING")
            token = req.headers.authorization.split(" ")[1];
            // Verify token using the JWT_SECRET from .env
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Find the user by ID from the decoded token
            // .select('-password') excludes the password hash from the user object
            req.user = await User_1.default.findById(decoded.id).select("-password");
            // If user not found (e.g., user deleted but token still valid)
            if (!req.user) {
                res.status(401); // Unauthorized
                throw new Error("Not authorized, user not found");
            }
            next(); // Proceed to the next middleware/controller
        }
        catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(401); // Unauthorized
            throw new Error("Not authorized, token failed");
        }
    }
    // If no token is provided in the header
    if (!token) {
        res.status(401); // Unauthorized
        throw new Error("Not authorized, no token");
    }
});
exports.protect = protect;
/**
 * @desc Authorizes roles for specific routes
 * @param roles Array of allowed roles (e.g., ['admin', 'editor'])
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if user is authenticated (req.user exists) and if their role is in the allowed roles array
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403); // Forbidden
            throw new Error(`User role (${req.user?.role || "unknown"}) is not authorized to access this route.`);
        }
        next(); // Proceed to the next middleware/controller
    };
};
exports.authorizeRoles = authorizeRoles;
