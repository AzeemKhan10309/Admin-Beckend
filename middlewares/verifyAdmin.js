// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export function verifyToken  (req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   // if (decoded.role !== 'admin') {
    //    return res.status(403).json({ message: 'Not an admin' });
  //    }
    req.user = decoded;
 
    console.log('Decoded token:', req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware for admin-only access
export function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access only' });
    }
  });
}

// Middleware for user-only access (non-admin)
export function verifyUserOnly(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Only users can perform this action' });
    }
  });
}

