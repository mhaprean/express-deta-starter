import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

const init = async () => {

  try {
    app.listen(PORT, () => {
      console.log('app started');
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

init();
