import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../../Ecom/models/admin/adminModel.js';  // <-- make sure this path is correct
dotenv.config();

export async function verifyToken(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    if (req.accepts('html')) return res.redirect('/login');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Admin.findById(decoded.id);
    if (!user) {
      if (req.accepts('html')) return res.redirect('/login');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    console.log('Decoded token, user loaded:', req.user);

    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    if (req.accepts('html')) return res.redirect('/login');
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Admin-only middleware
export function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access only' });
    }
  });
}

// User-only middleware
export function verifyUserOnly(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Only users can perform this action' });
    }
  });
}

export default verifyToken;
