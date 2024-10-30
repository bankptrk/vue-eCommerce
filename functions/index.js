const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentWritten } = require('firebase-functions/v2/firestore');

const express = require('express');
const app = express();
const { db, realtimeDB } = require('./firebaseConfig.js');

const omise = require('omise')({
  secretKey: process.env.OMISE_SECRET_KEY,
  omiseVersion: '2019-05-29',
});

const createCharge = (source, amount, orderId) => {
  return new Promise((resolve, reject) => {
    omise.charges.create(
      {
        amount: amount * 100,
        currency: 'THB',
        return_uri: `http://localhost:5173/success?order_id=${orderId}`,
        metadata: {
          orderId,
        },
        source,
      },
      (err, resp) => {
        if (err) {
          return reject(err);
        }
        resolve(resp);
      }
    );
  });
};

app.post('/placeorder', async (req, res) => {
  try {
    let checkoutProducts = [];
    let totalPrice = 0;
    let orderData = {};
    let omiseResponse = {};
    const checkoutData = req.body.checkout;
    const products = checkoutData.products;
    const sourceOmise = req.body.source;

    await db.runTransaction(async (transaction) => {
      for (const product of products) {
        const productRef = db.collection('products').doc(product.productId);
        const productSnapshot = await productRef.get();
        const productData = productSnapshot.data();

        let checkoutProduct = product;
        checkoutProduct.name = productData.name;
        checkoutProduct.imageUrl = productData.imageUrl;
        checkoutProduct.price = productData.price;
        checkoutProduct.totalPrice = productData.price * product.quantity;
        totalPrice += productData.price * product.quantity;
        checkoutProducts.push(checkoutProduct);

        // Decrease quantity
        if (productData.remainQuantity - product.quantity < 0) {
          throw new Error(`Product ${productData.name} out of stock`);
        }
        transaction.update(productRef, {
          remainQuantity: productData.remainQuantity - product.quantity,
        });
      }

      const orderRef = db.collection('orders');
      const orderId = orderRef.doc().id;

      omiseResponse = await createCharge(sourceOmise, totalPrice, orderId);

      orderData = {
        ...checkoutData,
        chargeId: omiseResponse.id,
        products: checkoutProducts,
        totalPrice,
        paymentMethod: 'rabbit_linepay',
        createAt: new Date(),
        status: 'pending',
      };
      transaction.set(orderRef.doc(orderId), orderData);

      successOrderId = orderId;
    });

    // Send response back
    res.json({
      message: 'Hello from firebase',
      redirectUrl: omiseResponse.authorize_uri,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error processing order',
      error: error.message,
    });
  }
});

app.post('/webhook', async (req, res) => {
  // console.log('webhook body', req.body);
  // res.json({
  //   message: 'hook ok',
  // });
  try {
    if (req.body.key === 'charge.complete') {
      const webhookData = req.body.data;
      const orderId = webhookData.metadata.orderId;
      const chargeId = webhookData.id;
      const statusOrder = webhookData.status;

      const orderRef = db.collection('orders').doc(orderId);
      const orderSnapshot = await orderRef.get();
      const orderData = orderSnapshot.data();

      if (orderData.chargeId !== chargeId) {
        throw new Error('charge not found');
      }
      if (orderData.status === 'pending') {
        await orderRef.update({
          status: statusOrder,
        });
        if (statusOrder !== 'successful') {
          db.runTransaction(async (transaction) => {
            for (const product of orderData.products) {
              const productRef = db
                .collection('products')
                .doc(product.productId);
              const productSnapshot = await productRef.get();
              const productData = productSnapshot.data();
              transaction.update(productRef, {
                remainQuantity: productData.remainQuantity + product.quantity,
              });
            }
          });
        }
      }
    }
  } catch (error) {
    console.log('error', error);
  }
});

// Expose the API
exports.api = onRequest(app);

exports.updateOrder = onDocumentWritten('orders/{orderId}', async (event) => {
  const oldData = event.data.before.data();
  const newData = event.data.after.data();

  const orderStatRef = realtimeDB.ref('stats/order');
  const successfulOrderCountRef = realtimeDB.ref('stats/user');

  if (
    newData.status === 'successful' &&
    (!oldData || oldData.status === 'pending')
  ) {
    await orderStatRef.transaction((curr) => {
      return (curr || 0) + newData.totalPrice;
    });

    await successfulOrderCountRef.transaction((curr) => {
      return (curr || 0) + 1;
    });
  }
});

exports.updateProduct = onDocumentWritten(
  'products/{productId}',
  async (event) => {
    const oldData = event.data.before.data();
    const newData = event.data.after.data();

    console.log('oldData', oldData);
    console.log('newData', newData);

    const orderStatRef = realtimeDB.ref('stats/product');

    if (
      oldData &&
      newData &&
      oldData.remainQuantity !== newData.remainQuantity
    ) {
      const quantityPurchased = oldData.remainQuantity - newData.remainQuantity;
      if (quantityPurchased > 0) {
        await orderStatRef.transaction((curr) => {
          return (curr || 0) + quantityPurchased;
        });
      }
    }
  }
);
