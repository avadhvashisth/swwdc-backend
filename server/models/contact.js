const mongoose = require('mongoose');

var Contact = mongoose.model('Contact', {
  name: {
    type: String,
    minlength: 1,
    trim: true,
  },
  email: {
    type: String,
    minlength: 1,
    trim: true,
  },
  subject: {
    type: String,
    minlength: 1,
    trim: true,
  },
  msg: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
});

module.exports = {
  Contact,
};
