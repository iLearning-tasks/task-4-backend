import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import { generateToken } from '../utils/jwtUtils';
import { RowDataPacket } from 'mysql2';

const registerUser = (req: Request, res: Response): void => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ error: 'Failed to hash password' });
      return;
    }

    const user = { name, email, password: hash };

    pool.query('INSERT INTO users SET ?', user, (error) => {
      if (error) {
        res.status(500).json({ error: 'Failed to register user' });
        return;
      }

      res.status(200).json({ message: 'User registered successfully' });
    });
  });
};


const loginUser = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  pool.query('SELECT * FROM users WHERE email = ?', email, (error, results: RowDataPacket[]) => {
    if (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = results[0] as RowDataPacket;
    const storedPassword = user.password;

    bcrypt.compare(password, storedPassword, (err, isMatch) => {
      if (err || !isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const loginedAt = new Date();
      pool.query('UPDATE users SET loginedAt = ? WHERE id = ?', [loginedAt, user.id], (updateError) => {
        console.log([loginedAt, user.id]);
        console.log(updateError);
        
        if (updateError) {
          res.status(500).json({ error: 'Failed to update last login time' });
          return;
        }

        const token = generateToken(user.id);
        res.status(200).json({ token });
      });

    });
  });
};

export const getAllUsers = (req: Request, res: Response): void => {
  pool.query('SELECT id, name, email, loginedAt, createdAt, status FROM users', (error, results) => {
    if (error) {
      console.log('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
      return;
    }

    res.status(200).json({ users: results });
  });
};

export const updateUserStatus = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;
  pool.query(
    'UPDATE users SET status = ? WHERE id = ?',
    [status, id],
    (error) => {
      if (error) {
        res.status(500).json({ error: 'Failed to update user' });
        return;
      }

      res.status(200).json({ message: 'User updated successfully' });
    }
  );
};

export const deleteUser = (req: Request, res: Response): void => {
  const { id } = req.params;

  pool.query('DELETE FROM users WHERE id = ?', id, (error) => {
    if (error) {
      res.status(500).json({ error: 'Failed to delete user' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  });
};

export { registerUser, loginUser };
