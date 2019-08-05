const mongoose = require('mongoose');

var Product = mongoose.model('Product', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  header: {
    name: String,
    img: String
  },
  heading: String,
  container1: {
    h4: String,
    col3: {
      img: String,
      button: String,
    },
    col9: {
      p1: String,
      p2: String,
      p3: String,
      h4: String,
      p4: String,
      p5: String,
      P6: String,
      h6: String,
      ol: [String],
    },
  },
  container2: {
    h4: String,
    col3: {
      img: String,
      button: String,
    },
    col9: {
      p1: String,
      p2: String,
      p3: String,
      h4: String,
      p4: String,
      p5: String,
      P6: String,
      h6: String,
      ol: [String],
    },
  },
  container3: {
    h4: String,
    col3: {
      img: String,
      button: String,
    },
    col9: {
      p1: String,
      p2: String,
      p3: String,
      h4: String,
      p4: String,
      p5: String,
      P6: String,
      h6: String,
      ol: [String],
    },
  },
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
  Product,
};
