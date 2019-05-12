import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: Number,
  products: [String],
  userId: {
    type: Number
  },
  address: {
    type: String,
    required: true
  },
  userEmail: String
});

module.exports = mongoose.model('Order', orderSchema);

