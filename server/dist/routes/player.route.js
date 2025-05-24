"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const player_controller_1 = require("../controllers/player.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public Routes
router.get("/", player_controller_1.getPlayers);
router.get("/:id", player_controller_1.getPlayerById);
// Private Routes
router.post("/", auth_middleware_1.protect, (0, auth_middleware_1.authorizeRoles)("admin", "editor"), player_controller_1.createPlayer);
router.put("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorizeRoles)("admin", "editor"), player_controller_1.updatePlayer);
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorizeRoles)("admin", "editor"), player_controller_1.deletePlayer);
exports.default = router;
