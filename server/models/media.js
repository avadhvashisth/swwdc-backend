const mongoose = require('mongoose');

var Media = mongoose.model('Media', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  heading: String,
  images: [{name: String, url: String, category: String}],
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
  Media,
};
