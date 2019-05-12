import mongoose from 'mongoose';

import Order from './order';
import Messaging from './messaging';

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
};

const models = { Order, Messaging };

export { connectDb };

export default models;
