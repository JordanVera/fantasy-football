/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(v);
      }
    },
    required: [true, 'User phone number required']
  },
  promo: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  bullets: {
    type: Number,
    default: 0
  },
  customerId: '',
  picks: []
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
