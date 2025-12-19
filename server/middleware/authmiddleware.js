import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    token = token.split(' ')[1]; // Bearer <token>
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // attach user id
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};
