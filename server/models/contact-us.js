const mongoose = require('mongoose');

var ContactUs = mongoose.model('ContactUs', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  heading: String,
  "map-url": String,
  footer: {
    img: String,
    p: String,
    "useful-links": [{link: String, title: String}],
    configuration: [{link: String, title: String}],
    address: {
      l1: String,
      l2: String,
      l3: String
    }
  },
});

module.exports = {
  ContactUs,
};
