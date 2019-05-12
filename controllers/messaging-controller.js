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
    console.log("Check order with id: ", message.Body);
    return findOrder(parseInt(message.Body));
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

let emailSent = false;
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
              return reject(err)
            } else {
              console.log(`Message sent for the order with id ${orderId} and saved to database.`);
              return resolve(message);
            }
          });
        }
      })
      .catch(err => {
        console.log("Something wrong retrieving order with id " + orderId);
        reject(err);
      });
  })
};

exports.findOne = (req, res) => {
  Order.findOne({ orderId: req.params.orderId })
    .then(order => {
      if (!order) {
        console.log(`Order with id ${req.params.orderId} not found`);
      }

      if (order.userEmail) {
        console.log("Sending email...");
        console.log("Message sent to email: ", order.userEmail);
        emailSent = true;
      }
      res.send(order)
    })
    .then(() => {
      if (emailSent) {
        let message = new Messaging({ orderId: req.params.orderId, emailSent: true });
        return message.save(function (err, message) {
          if (err) {
            console.error(err)
          } else {
            console.log(`Message sent for the order with id ${req.params.orderId} and saved to database.`);
          }
        });
      }
    })
    .catch(err => {
      console.log("Something wrong retrieving order with id " + req.params.orderId + " cause by error: ", err);
    });
}

