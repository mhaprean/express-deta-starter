import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Deta } from 'deta';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const deta = Deta(process.env.DETA_PROJECT_KEY);

const usersDB = deta.Base('users');

interface IUser {
  email: string;
  id: string;
  key: string;
  name: string;
  password: string;
  role: string;
}

const signJWTToken = (userName: string, role = 'user') => {
  return jwt.sign({ name: userName, role: role }, process.env.JWT_SECRET || 'jwt_secret', {
    expiresIn: '1d',
  });
};

const signJWTRefreshToken = (userName: string, role = 'user') => {
  return jwt.sign(
    { name: userName, role: role },
    process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret',
    {
      expiresIn: '2d',
    }
  );
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const id = uuidv4();
    const newUser = { ...req.body, password: hash, id, role: 'user' };

    const savedUser = await usersDB.put(newUser, req.body.name);

    return res.status(200).json({ success: 'User has been created!', user: savedUser });
  } catch (err) {
    return res.status(400).json({ err });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const user = await User.findOne({ name: req.body.name });
    const userRes = await usersDB.get(req.body.name);

    if (!userRes) return res.status(404).json('User not found!');

    const user = (userRes as unknown) as IUser;

    // return res.status(200).json(user);

    const isCorrect = await bcrypt.compare(req.body.password, user.password || '');

    if (!isCorrect) return res.status(400).json('Wrong Credentials!');

    const token = signJWTToken(user.name, user.role);

    const refreshToken = signJWTRefreshToken(user.name, user.role);

    return res
      .cookie('jwt_refresh_token', refreshToken, {
        httpOnly: true,
      })
      .status(200)
      .json({ access_token: token });
  } catch (err) {
    next(err);
  }
};

export const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.userId;

    const username = req.userName || '';

    const user = await usersDB.get(username);

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
