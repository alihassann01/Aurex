import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'your_secret_key', {
    expiresIn: '7d',
  });
};
