const mongoose = require('mongoose');

var Home = mongoose.model('Home', {
  name: {
    type: String,
    required: true,
  },
  "top-container": {
    img: String,
    h1: {
      span1: String,
      span2: String,
      span3: String,
      p: String
    }
  },
  container1: {
    heading: String,
    img: String,
    content1: {
      heading: String,
      p1: String,
      p2: String
    },
    content2: {
      heading: String,
      p1: String,
      p2: String
    },
    content3: {
      heading: String,
      p1: String,
      p2: String
    }
  },
  container2: {
    heading: String,
    content1: {
      "data-number": String,
      span: String,
    },
    content2: {
      "data-number": String,
      span: String,
    },
    content3: {
      "data-number": String,
      span: String,
    },
    content4: {
      "data-number": String,
      span: String,
    },
  },
  container3: {
    heading: String,
    questions: [{question: String, answer: String}]
  },
  container4: {
    heading: String,
    "map-url": String
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
  Home,
};
