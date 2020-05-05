import cors from 'cors';
import express, { Request, NextFunction, Response } from 'express';
import * as admin from 'firebase-admin';
import helmet from 'helmet';

import { AllModels } from './models';
import { router } from './routes';
import { sequelize } from './services/database';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

const serviceAccount = require('./services/config/tennis-pro-d81a1-firebase-adminsdk-ut16e-952214cdce.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tennis-pro-d81a1.firebaseio.com',
});

app.use((req: Request, res: Response, next: NextFunction) => {
  req.database = sequelize;
  req.models = AllModels;
  next();
});

app.get('/', (req, res) =>
  res.send({ running: true, message: 'Welcome to Tennis Pro' })
);

app.use(router);

export default app;
