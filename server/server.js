require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, new Date().getTime() + file.originalname)
  }
});

const upload = multer({storage: storage});

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { Contact } = require('./models/contact');
var { Home } = require('./models/home');
var { util } = require('./util');
var { authenticate } = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT || 4000;
const SUCCESS = "success";
const ERROR = "error"

app.use(bodyParser.json());


//login apis
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'name']);
  var user = new User(body);

  user.save().then(() => user.generateAuthToken())
  .then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    console.log(e);
    res.status(400).send();
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


//contact us apis
app.post('/contactmsg', (req, res) => {
  var body = _.pick(req.body, ['name', 'email', 'subject', 'msg']);
  var contact = new Contact(body);

  contact.save().then((doc) => {
    res.send(util.setResData(true, "Response sent."));
  }).catch((e) => {
    res.status(400).send(util.setResData(false, "Some message required."));
  });
});

app.get('/contactmsgs', authenticate, (req, res) => {
  Contact.find({}).then((contactmsgs) => {
    res.send({ contactmsgs });
  }, (e) => {
    res.status(400).send(e);
  });
});


//image upload apis -------incomplete
app.post('/upload', upload.single('siteImage'), (req, res, next) => {
  console.log(req.file);
});


//site data apis 
app.put('/home',authenticate, (req, res) => {
  var body = _.pick(req.body, ['top-h1-span1', 'top-h1-span2', 'top-h1-span3', 'top-p']);

  Home.update({ name: "home" }, body, null).then((doc) => {
    res.send(util.setResData(true, "Home data updated successfully"));
  }).catch((e) => {
    res.status(400).send(util.setResData(false, "Error occured while updating home data"));
  });
});

app.get('/home', (req, res) => {
  Home.findOne({ name: "home" }, { _id: 0 }) .then((data) => {
    res.send(data);
  }, (e) => {
    res.status(400).send(util.setResData(false, "Error occured while getting home data"));
  });
});


app.listen(port, () => {
  console.log(`Server is up on PORT: ${port}`);
});

module.exports = {
  app,
};
