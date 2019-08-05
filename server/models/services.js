const mongoose = require('mongoose');

var Services = mongoose.model('Services', {
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
    head1: String,
    "head-content1": {
      p1: String,
      p2: String,
      img: String
    },
    head2: String,
    "head-content2": {
      p1: String,
      p2: String,
      img: String
    },
    head3: String,
    "head-content3": [String],
    head4: String,
    "head-content4": [String],
    head5: String,
    "head-content5": [String]
  },
  container2: {
    head1: String,
    "head-content1": {
      p1: String,
      p2: String,
      img: String
    },
    head2: String,
    "head-content2": {
      p1: String,
      p2: String,
      img: String
    },
    head3: String,
    "head-content3": [String],
    head4: String,
    "head-content4": [String],
    head5: String,
    "head-content5": [String]
  },
  container3: {
    head1: String,
    "head-content1": {
      p1: String,
      p2: String,
      img: String
    },
    head2: String,
    "head-content2": {
      p1: String,
      p2: String,
      img: String
    },
    head3: String,
    "head-content3": [String],
    head4: String,
    "head-content4": [String],
    head5: String,
    "head-content5": [String]
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
  Services,
};
