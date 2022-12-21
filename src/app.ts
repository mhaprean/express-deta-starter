import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import upload, { UploadedFile } from 'express-fileupload';

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
app.use(upload());

// add routes for our app
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  return res.status(200).json('welcome to our api');
});

const deta = Deta(process.env.DETA_PROJECT_KEY);

const drive = deta.Drive('images');

app.post('/api/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  } // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.image as UploadedFile;

  const name = Date.now() + '_' + sampleFile.name;
  const contents = sampleFile.data;

  const img = await drive.put(name, { data: contents });
  res.send(img);
});

app.get('/api/images/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const image = await drive.get(name);

    if (image) {
      const buffer = await image.arrayBuffer();
      res.contentType('image/png').send(Buffer.from(buffer));
    } else {
      res.status(400).json('image doesnt exist');
    }
  } catch (error) {
    return res.status(400).json('something went wrong');
  }
});

export default app;
