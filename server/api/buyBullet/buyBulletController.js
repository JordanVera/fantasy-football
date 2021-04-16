/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
const CoinqvestClient = require('coinqvest-merchant-sdk');
const dotenv = require('dotenv');
const chalk = require('chalk');
const User = require('../user/userModel');

require('crypto');

dotenv.config();

const updateUserBullets = async (userId, quantity) => {
  const query = { customerId: userId };
  const update = { bullets: quantity };

  const userX = await User.findOneAndUpdate(query, update, { new: true });

  // console.log('quantity', quantity);
  // console.log(chalk.blue('user'), userX);
};

function bulletsRepo() {
  const client = new CoinqvestClient(
    process.env.PUBLIC,
    process.env.PRIVATE
  );

  function testAuth() {
    client.get('/auth-test', null, (response) => {
      console.log(response.status);
      console.log(response.data);
    });
  }

  // This controller gets used in userController in postRegister controller
  function createCustomer(customerObj) {
    return new Promise((resolve, reject) => {
      client.post('/customer',
        customerObj,
        (response) => {
          console.log(response.status);
          console.log(response.data);
          if (response.status !== 200) {
            console.log('Could not create customer. Inspect above log entry.');
            return reject();
          }
          const { customerId } = response.data;
          resolve(customerId);
        });
    });
  }

  function buyBullet(req, res, next) {
    // this object get passed to Coinqvest API
    const chargeObj = {
      charge: {
        customerId: req.user.customerId,
        currency: 'USD', // specifies the billing currency
        lineItems: [{ // a list of line items included in this charge
          description: 'NFL Last Longer Entry',
          netAmount: process.env.BUYIN,
          quantity: req.body.bulletCount
        }],
      },
      webhook: `${process.env.WEBHOOK}/api/bullets/hook`,
      links: {
        returnUrl: `${process.env.WEBHOOK}/api/dashboard`
      },
      pageSettings: {
        displaySellerInfo: false,
        shopName: 'NFL Last Longer'
      },
      settlementCurrency: 'USD' // specifies in which currency you want to settle
    };

    client.post('/checkout/hosted',
      chargeObj,
      function (response) {
        console.log(response.status);
        console.log(response.data);
        // console.log(`bullet count = ${req.body.bulletCount}`);
        // console.log(`customer ID = ${req.user.customerId}`)

        if (response.status !== 200) {
          // something went wrong, let's abort and debug by looking at our log file
          console.log('Could not create checkout.');
          return;
        }

        // the checkout was created
        // response.data now contains an object as specified in the success response here: https://www.coinqvest.com/en/api-docs#post-checkout
        const { checkoutId } = response.data; // store this persistently in your database
        const { url } = response.data; // redirect your customer to this URL to complete the payment

        res.redirect(url);
      });
  }

  function hook(req, res, next) {
    const { payload } = req.body.data.checkout;

    console.log(req.body.eventType);
    console.log(req.body);
    console.log(payload);

    switch (req.body.eventType) {
      case 'CHECKOUT_COMPLETED':
        const { customerId } = payload.charge;
        const { quantity } = payload.charge.lineItems[0];

        updateUserBullets(customerId, quantity);
        break;
      case 'UNDERPAID_ACCEPTED':
        const { customerIdX } = payload.charge;
        const { quantityX } = payload.charge.lineItems[0];

        updateUserBullets(customerIdX, quantityX);
        break;
    }

    return res.status(200);
  }

  return { testAuth, createCustomer, buyBullet, hook };
}

module.exports = bulletsRepo();
