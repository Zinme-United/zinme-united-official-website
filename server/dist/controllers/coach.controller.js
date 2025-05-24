"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoach = exports.updateCoach = exports.getCoachById = exports.getCoaches = exports.createCoach = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Coach_1 = __importDefault(require("../models/Coach"));
exports.createCoach = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, role, img, bio } = req.body;
    if (!name || !role || !img) {
        res.status(400);
        throw new Error("Please include all required coach fields: name, role, and image URL.");
    }
    const coach = new Coach_1.default({
        name,
        role,
        img,
        bio,
    });
    const savedCoach = await coach.save();
    res.status(201).json({
        status: true,
        message: "Coach created successfully.",
        data: savedCoach,
    });
});
exports.getCoaches = (0, express_async_handler_1.default)(async (req, res) => {
    const coaches = await Coach_1.default.find({}); // Find all coaches
    res.status(200).json({
        status: true,
        message: "Coaches fetched successfully.",
        count: coaches.length, // Include count for lists
        data: coaches,
    });
});
// @desc    Get single coach by ID
// @route   GET /api/coaches/:id
// @access  Public
exports.getCoachById = (0, express_async_handler_1.default)(async (req, res) => {
    const coach = await Coach_1.default.findById(req.params.id); // Find coach by ID
    if (coach) {
        res.status(200).json({
            message: "Coach fetched successfully.",
            data: coach,
        });
    }
    else {
        res.status(404);
        throw new Error("Coach not found.");
    }
});
// @desc    Update a coach
// @route   PUT /api/coaches/:id
// @access  Admin
exports.updateCoach = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, role, img, bio } = req.body;
    const coach = await Coach_1.default.findById(req.params.id); // Find coach to update
    if (coach) {
        // Update fields if they are provided in the request body, otherwise keep existing value
        coach.name = name || coach.name;
        coach.role = role || coach.role;
        coach.img = img || coach.img;
        coach.bio = bio !== undefined ? bio : coach.bio; // Allow bio to be explicitly set to null/undefined
        const updatedCoach = await coach.save(); // Save the updated coach
        res.status(200).json({
            message: "Coach updated successfully.",
            data: updatedCoach,
        });
    }
    else {
        res.status(404);
        throw new Error("Coach not found.");
    }
});
// @desc    Delete a coach
// @route   DELETE /api/coaches/:id
// @access  Admin
exports.deleteCoach = (0, express_async_handler_1.default)(async (req, res) => {
    const coach = await Coach_1.default.findById(req.params.id); // Find coach to delete
    if (coach) {
        await Coach_1.default.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+
        res.status(200).json({ message: "Coach removed successfully." });
    }
    else {
        res.status(404);
        throw new Error("Coach not found.");
    }
});
