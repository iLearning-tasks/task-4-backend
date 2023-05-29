import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import { generateToken } from '../utils/jwtUtils';
import { RowDataPacket } from 'mysql2';

const registerUser = (req: Request, res: Response): void => {
  const { name, email, password } = req.body;

  console.log('Request body:', req.body);

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log('Failed to hash password:', err);
      res.status(500).json({ error: 'Failed to hash password' });
      return;
    }

    console.log('Hashed password:', hash);

    const user = { name, email, password: hash };

    pool.query('INSERT INTO users SET ?', user, (error) => {
      if (error) {
        console.log('Failed to register user:', error);
        res.status(500).json({ error: 'Failed to register user' });
        return;
      }

      console.log('User registered successfully');
      res.status(200).json({ message: 'User registered successfully' });
    });
  });
};


const loginUser = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  console.log('Request body:', req.body);

  pool.query('SELECT * FROM users WHERE email = ?', email, (error, results: RowDataPacket[]) => {
    if (error) {
      console.log('Failed to fetch user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
      return;
    }

    if (results.length === 0) {
      console.log('Invalid credentials');
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = results[0] as RowDataPacket;
    const storedPassword = user.password;

    bcrypt.compare(password, storedPassword, (err, isMatch) => {
      if (err || !isMatch) {
        console.log('Invalid credentials');
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const loginedAt = new Date();
      console.log('Login timestamp:', loginedAt);
      console.log('User ID:', user.id);

      pool.query('UPDATE users SET loginedAt = ? WHERE id = ?', [loginedAt, user.id], (updateError) => {
        console.log('Update error:', updateError);

        if (updateError) {
          console.log('Failed to update last login time:', updateError);
          res.status(500).json({ error: 'Failed to update last login time' });
          return;
        }

        const token = generateToken(user.id);
        console.log('Generated token:', token);
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

    console.log('Fetched users:', results); // Logging the fetched users
    res.status(200).json({ users: results });
  });
};


export const updateUserStatus = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  console.log('Updating user status. User ID:', id);
  console.log('New status:', status);

  pool.query(
    'UPDATE users SET status = ? WHERE id = ?',
    [status, id],
    (error) => {
      if (error) {
        console.log('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
        return;
      }

      console.log('User updated successfully');
      res.status(200).json({ message: 'User updated successfully' });
    }
  );
};


export const deleteUser = (req: Request, res: Response): void => {
  const { id } = req.params;

  console.log('Deleting user. User ID:', id);

  pool.query('DELETE FROM users WHERE id = ?', id, (error) => {
    if (error) {
      console.log('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
      return;
    }

    console.log('User deleted successfully');
    res.status(200).json({ message: 'User deleted successfully' });
  });
};


export { registerUser, loginUser };
