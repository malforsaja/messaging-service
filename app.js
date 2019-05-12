import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express'

import { connectDb } from './models';

const app = express();

// Application-Level Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start
connectDb().then(async () => {
  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  );
});