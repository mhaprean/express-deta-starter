import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// global overwrite to attach the user id and the user role to request
declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      userRole?: string;
      userName?: string;
    }
  }
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret', (err, user) => {
      // if the token expired or is not valid we set the http status to 401 Unauthorized
      if (err) return res.status(401).json('Wrong or expired access token');
      if (user && typeof user !== 'string') {
        if (user) {
          req.userId = user.id;
          req.userRole = user.role;
          req.userName = user.name;
        }
      }
      next();
    });
  } else {
    return res.status(401).json('You are not authenticated!');
  }
};
