"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coach_controller_1 = require("../controllers/coach.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/", coach_controller_1.getCoaches);
router.get("/:id", coach_controller_1.getCoachById);
router.post("/", auth_middleware_1.protect, (0, auth_middleware_1.authorizeRoles)("admin", "editor"), coach_controller_1.createCoach);
router.put("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorizeRoles)("admin", "editor"), coach_controller_1.updateCoach);
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorizeRoles)("admin"), coach_controller_1.deleteCoach);
exports.default = router;
