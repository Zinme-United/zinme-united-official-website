"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const requestLogger_1 = __importDefault(require("./middleware/requestLogger"));
const player_route_1 = __importDefault(require("./routes/player.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const coach_route_1 = __importDefault(require("./routes/coach.route"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(requestLogger_1.default);
app.use(express_1.default.json());
app.use("/api/auth", auth_route_1.default);
app.use("/api/players", player_route_1.default);
app.use("/api/coaches", coach_route_1.default);
app.get("/", (req, res) => {
    res.send("Football Team Website Backend API is running...");
});
app.use(error_middleware_1.default);
exports.default = app;
