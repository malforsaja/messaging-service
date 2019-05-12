import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express'
import routes from './routes';
import { connectDb } from './models';

const app = express();

// Application-Level Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/order', routes.order);

// Start
connectDb().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  );
}).catch(err => {
  console.log('We can not connect to database due to error: ', err);
});