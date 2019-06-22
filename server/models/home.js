const mongoose = require('mongoose');

var Home = mongoose.model('Home', {
  name: {
    type: String,
    required: true,
  },
  "top-h1-span1": {
    type: String,
  },
  "top-h1-span2": {
    type: String,
  },
  "top-h1-span3": {
    type: String,
  },
  "top-p": {
    type: String,
  },
});

module.exports = {
  Home,
};
