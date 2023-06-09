"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const router = express_1.default.Router();
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUser);
router.get('/users', authentication_1.default, authController_1.getAllUsers);
router.put('/users/:id', authentication_1.default, authController_1.updateUserStatus);
router.delete('/users/:id', authentication_1.default, authController_1.deleteUser);
exports.default = router;
