import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import { Deta } from 'deta';

dotenv.config();

const app = express();

// middlewares required for our app
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// add routes for our app
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  return res.status(200).json('welcome to our api');
});

const deta = Deta(process.env.DETA_PROJECT_KEY);

const testDB = deta.Base('first_base');



export default app;
