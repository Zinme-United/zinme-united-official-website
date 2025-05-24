"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlayer = exports.updatePlayer = exports.getPlayerById = exports.getPlayers = exports.createPlayer = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler")); // For handling async errors gracefully
const Player_1 = __importDefault(require("../models/Player")); // Import your IPlayer interface
exports.createPlayer = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, number, position, img, bio, stats, social } = req.body;
    // Basic validation
    if (!name ||
        !number ||
        !position ||
        !img ||
        !bio ||
        !stats ||
        !stats.appearances) {
        res.status(400);
        throw new Error("Please include all required player fields: name, number, position, img, bio, and player stats with appearances.");
    }
    // Check if a player with this number already exists
    const playerExists = await Player_1.default.findOne({ number });
    if (playerExists) {
        res.status(400);
        throw new Error(`Player with jersey number ${number} already exists.`);
    }
    const player = new Player_1.default({
        name,
        number,
        position,
        img,
        bio,
        stats,
        social,
    });
    const savedPlayer = await player.save();
    res.status(201).json(savedPlayer);
});
// @desc    Get all players
// @route   GET /api/players
// @access  Public
exports.getPlayers = (0, express_async_handler_1.default)(async (req, res) => {
    const players = await Player_1.default.find({});
    res.status(200).json({
        status: true,
        message: "Players fetched successfully.",
        count: players.length,
        data: players,
    });
});
// @desc    Get single player by ID
// @route   GET /api/players/:id
// @access  Public
exports.getPlayerById = (0, express_async_handler_1.default)(async (req, res) => {
    const player = await Player_1.default.findById(req.params.id);
    if (player) {
        res.status(200).json(player);
    }
    else {
        res.status(404);
        throw new Error("Player not found.");
    }
});
// @desc    Update a player
// @route   PUT /api/players/:id
// @access  Admin
exports.updatePlayer = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, number, position, img, bio, stats, social } = req.body;
    const player = await Player_1.default.findById(req.params.id);
    if (player) {
        // Update fields if provided
        player.name = name || player.name;
        player.number = number || player.number;
        player.position = position || player.position;
        player.img = img || player.img;
        player.bio = bio || player.bio;
        if (stats) {
            player.stats.appearances =
                stats.appearances !== undefined
                    ? stats.appearances
                    : player.stats.appearances;
            player.stats.goals =
                stats.goals !== undefined ? stats.goals : player.stats.goals;
            player.stats.assists =
                stats.assists !== undefined ? stats.assists : player.stats.assists;
            player.stats.cleanSheets =
                stats.cleanSheets !== undefined
                    ? stats.cleanSheets
                    : player.stats.cleanSheets;
        }
        // Handle social field update
        if (social) {
            player.social = {
                twitter: social.twitter !== undefined
                    ? social.twitter
                    : player.social?.twitter,
                instagram: social.instagram !== undefined
                    ? social.instagram
                    : player.social?.instagram,
            };
        }
        else {
            // If social is explicitly sent as null/undefined, clear it
            player.social = undefined;
        }
        const updatedPlayer = await player.save();
        res.status(200).json(updatedPlayer);
    }
    else {
        res.status(404);
        throw new Error("Player not found.");
    }
});
exports.deletePlayer = (0, express_async_handler_1.default)(async (req, res) => {
    const player = await Player_1.default.findById(req.params.id);
    if (player) {
        await Player_1.default.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+
        res.status(200).json({ message: "Player removed successfully." });
    }
    else {
        res.status(404);
        throw new Error("Player not found.");
    }
});
