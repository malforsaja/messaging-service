const Order = require('../models/order');
const Messaging = require('../models/messaging');
const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const appConsumer = Consumer.create({
  queueUrl: process.env.QUEUE_URL,
  handleMessage: async (message) => {
    // do some work with `message`
    console.log(message.Body);
    findOrder(parseInt(message.Body))
      .then(() => {
        Promise.resolve();
      })
      .catch(err => {        
        console.log(err);
        Promise.reject(err);
      })
  },
  sqs: new AWS.SQS()
});

appConsumer.on('error', (err) => {
  console.error(err.message);
});

appConsumer.on('processing_error', (err) => {
  console.error(err.message);
});

appConsumer.on('timeout_error', (err) => {
  console.error(err.message);
});

appConsumer.start();


function findOrder(orderId) {
  return new Promise((resolve, reject) => {
    Order.findOne({ orderId: orderId })
      .then(order => {
        if (!order) {
          console.log(`Order with id ${orderId} not found`);
        }

        if (order.userEmail) {
          console.log("Sending email...");          
          console.log("Message sent to email: ", order.userEmail);           
          emailSent = true;
        }
      })
      .then(() => {
        if (emailSent) {
          let message = new Messaging({ orderId: orderId, emailSent: true });
          return message.save(function (err, message) {
            if (err) {
              return console.error(err)
            } else {
              console.log(`Message sent for the order with id ${orderId} and saved to database.`);
              resolve(message);
            }
          });
        }
      })
      .catch(err => {
        /* res.status(500).send({
          message: "Something wrong retrieving order with id " + orderId
        }); */
        console.log("Something wrong retrieving order with id " + orderId);
        reject(err);
      });
  })
};