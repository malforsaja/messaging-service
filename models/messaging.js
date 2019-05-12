import mongoose from 'mongoose';

const messagingSchema = new mongoose.Schema({
  orderId: Number,
  emailSent: Boolean
});

module.exports = mongoose.model('Messaging', messagingSchema);

