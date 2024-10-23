const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const app = express();
const { db, auth } = require('./firebaseConfig.js');

app.post('/placeorder', async (req, res) => {
  try {
    let checkoutProducts = [];
    let totalPrice = 0;
    let orderData = {};
    let successOrderId = '';
    const checkoutData = req.body.checkout;
    console.log('checkoutData', checkoutData);
    const products = checkoutData.products;

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

      orderData = {
        ...checkoutData,
        chargeId: `charge ${orderId}`,
        products: checkoutProducts,
        totalPrice,
        paymentMethod: 'rabbit_linepay',
        createAt: new Date(),
        status: 'successful',
      };
      transaction.set(orderRef.doc(orderId), orderData);

      successOrderId = orderId;
    });

    // Send response back
    res.json({
      message: 'Hello from firebase',
      redirectUrl: `http://localhost:5173/success?order_id=${successOrderId}`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error processing order',
      error: error.message,
    });
  }
});

// Expose the API
exports.api = onRequest(app);
