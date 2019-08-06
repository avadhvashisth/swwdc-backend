const mongoose = require('mongoose');

var About = mongoose.model('About', {
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
  section: {
    _type: {
      head1: String,
      "head-content1": {
        p1: String,
        p2: String,
        strong: String,
        img: String
      },
      "head-content2": {
        p1: String,
        p2: String,
        img: String
      },
      head2: String,
      "head-content3": {
        p: String
      }
    },
  },
  table: {
    header: String,
    data: [{label: String, value: String}]
  },
  footer: {
    img: String,
    p: String,
    "useful-links": [{link: String, title: String}],
    configuration: [{link: String, title: String}],
    "social-links": [{link: String, title: String}],
    address: {
      l1: String,
      l2: String,
      l3: String
    }
  },
});

module.exports = {
  About,
};
