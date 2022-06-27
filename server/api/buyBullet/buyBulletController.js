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
  const mongooseUser = await User.findOne(query);
  const update = { bullets: (mongooseUser.bullets += parseInt(quantity, 10)) };

  await User.findOneAndUpdate(query, update, { new: true });
};

function bulletsRepo() {
  const client = new CoinqvestClient(process.env.PUBLIC, process.env.PRIVATE);

  function testAuth() {
    client.get('/auth-test', null, (response) => {
      console.log(response.status);
      console.log(response.data);
    });
  }

  // This controller gets used in userController in postRegister controller
  // when a user signs up it creates a customer in COIMQVEST api
  function createCustomer(customerObj) {
    return new Promise((resolve, reject) => {
      client.post('/customer', customerObj, (response) => {
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
    const chargeObj = {
      charge: {
        customerId: req.user.customerId,
        currency: 'USD',
        lineItems: [
          {
            description: 'NFL Last Longer Entry',
            netAmount: process.env.BUYIN,
            quantity: req.body.bulletCount,
          },
        ],
      },
      webhook: `${process.env.WEBHOOK}/bullets/hook`,
      links: {
        returnUrl: `https://fantasy--football.herokuapp.com/dashboard`,
        cancelUrl: `https://fantasy--football.herokuapp.com/dashboard`,
      },
      pageSettings: {
        displaySellerInfo: false,
        shopName: 'NFL Last Longer',
      },
      settlementCurrency: 'USD',
    };

    client.post('/checkout/hosted', chargeObj, (response) => {
      console.log(response.status);
      console.log(response.data);

      if (response.status !== 200) {
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
    console.log(chalk.greenBright('COINQVEST WEBHOOK REQ.BODY'));
    console.log(req.body);

    switch (req.body.eventType) {
      case 'CHECKOUT_COMPLETED':
        const { payload } = req.body.data.checkout;
        const { customerId } = payload.charge;
        const { quantity } = payload.charge.lineItems[0];

        updateUserBullets(customerId, quantity);
        break;
      case 'UNDERPAID_ACCEPTED':
        const customerIdX = req.body.data.checkout.payload.charge.customerId;
        const quantityX =
          req.body.data.checkout.payload.charge.lineItems[0].quantity;

        updateUserBullets(customerIdX, quantityX);
        break;
      case 'REFUND_COMPLETED':
        console.log(chalk.greenBright('REFUND_COMPLETED'));

        break;
      case 'CHECKOUT_UNDERPAID':
        console.log(chalk.redBright('CHECKOUT_UNDERPAID'));

        break;
    }

    return res.sendStatus(200);
  }

  return { testAuth, createCustomer, buyBullet, hook };
}

module.exports = bulletsRepo();
