"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestLogger = (req, res, next) => {
    // Get the client's IP address. req.ip is often used, but req.headers['x-forwarded-for']
    // is better if your server is behind a proxy (like Nginx, Cloudflare, etc.).
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const timestamp = new Date().toISOString(); // Get current time in ISO format
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} from IP: ${ip}`);
    // Call the next middleware in the stack
    next();
};
exports.default = requestLogger;
