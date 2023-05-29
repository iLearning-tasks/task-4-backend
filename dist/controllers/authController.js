"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.deleteUser = exports.updateUserStatus = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../config/database"));
const jwtUtils_1 = require("../utils/jwtUtils");
const registerUser = (req, res) => {
    const { name, email, password } = req.body;
    bcrypt_1.default.hash(password, 10, (err, hash) => {
        if (err) {
            res.status(500).json({ error: 'Failed to hash password' });
            return;
        }
        const user = { name, email, password: hash };
        database_1.default.query('INSERT INTO users SET ?', user, (error) => {
            if (error) {
                res.status(500).json({ error: 'Failed to register user' });
                return;
            }
            res.status(200).json({ message: 'User registered successfully' });
        });
    });
};
exports.registerUser = registerUser;
const loginUser = (req, res) => {
    const { email, password } = req.body;
    database_1.default.query('SELECT * FROM users WHERE email = ?', email, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Failed to fetch user' });
            return;
        }
        if (results.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const user = results[0];
        const storedPassword = user.password;
        bcrypt_1.default.compare(password, storedPassword, (err, isMatch) => {
            if (err || !isMatch) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            const loginedAt = new Date();
            database_1.default.query('UPDATE users SET loginedAt = ? WHERE id = ?', [loginedAt, user.id], (updateError) => {
                console.log([loginedAt, user.id]);
                console.log(updateError);
                if (updateError) {
                    res.status(500).json({ error: 'Failed to update last login time' });
                    return;
                }
                const token = (0, jwtUtils_1.generateToken)(user.id);
                res.status(200).json({ token });
            });
        });
    });
};
exports.loginUser = loginUser;
const getAllUsers = (req, res) => {
    database_1.default.query('SELECT id, name, email, loginedAt, createdAt, status FROM users', (error, results) => {
        if (error) {
            console.log('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
            return;
        }
        res.status(200).json({ users: results });
    });
};
exports.getAllUsers = getAllUsers;
const updateUserStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    database_1.default.query('UPDATE users SET status = ? WHERE id = ?', [status, id], (error) => {
        if (error) {
            res.status(500).json({ error: 'Failed to update user' });
            return;
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
};
exports.updateUserStatus = updateUserStatus;
const deleteUser = (req, res) => {
    const { id } = req.params;
    database_1.default.query('DELETE FROM users WHERE id = ?', id, (error) => {
        if (error) {
            res.status(500).json({ error: 'Failed to delete user' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
};
exports.deleteUser = deleteUser;
