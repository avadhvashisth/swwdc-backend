require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const multer = require('multer');
const fs = require('fs');
var path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    let ext = file.originalname.slice(file.originalname.lastIndexOf('.'))
    let name = req.body.name;
    cb(null, name+ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: function(req, file, cb) {
    if(!req.body.name)
      cb(null, false);
    else
      cb(null, true);
  }
});

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { Contact } = require('./models/contact');
var { ContactUs } = require('./models/contact-us');
var { Home } = require('./models/home');
var { About } = require('./models/about');
var { Product } = require('./models/product');
var { Media } = require('./models/media');
var { Services } = require('./models/services');
var { util } = require('./util');
var { authenticate } = require('./middleware/authenticate');

var app = express();

//cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization, x-auth");
  next();
});

var port = process.env.PORT || 4000;

app.use('/uploads', express.static('uploads'));
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
    console.log(e);
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


//image upload apis
app.post('/upload', authenticate, upload.single('siteImage'), (req, res, next) => {
  console.log(req.file);
  if(req.body.name)
    res.send(util.setResData(true, req.body.name + " updated successfully"));
  else
    res.status(400).send(util.setResData(false, "Name not provided."));
});

app.get('/uploads/:name', (req, res) => {
  fs.readdir('uploads/', function(err, items) {
    for (var i=0; i<items.length; i++) {
      if(items[i].includes(req.params.name)){
        console.log(req.params.name);
        res.sendFile(path.join(__dirname, '../uploads', items[i]));
      }
    }
  });
});

//Add media
app.post('/mediaimage', authenticate, (req, res, next) => {
  console.log(req.file);
  var fullUrl = req.protocol + '://' + req.get('host');
  console.log(fullUrl);
  Media.findOne({ name: "media" }).then((media) => {
    if(media){
      if(media.images && Array.isArray(media.images)){
        media.images.push({
          name: req.body.name,
          url: req.body.url,
          category: req.body.category
        });
        media.save(function(err) {
          if (err) {
            res.status(400).send(util.setResData(false, "unable to add images"));
          }
            res.send(util.setResData(true, req.body.name + " updated successfully"));
        });
      }else{
        media.images = {
          name: req.body.name,
          url: req.body.url,
          category: req.body.category
        };
      }
    }else{
      res.status(400).send(util.setResData(false, "unable to add images"));
    }
  });
});

app.delete('/mediaimage/:id', authenticate, (req, res, next) => {
  Media.findOne({ name: "media" }).then((media) => {
    if(media && media.images && Array.isArray(media.images)){
      for (var i = 0; i < media.images.length; i++) {
        var obj = media.images[i];
        if (obj._id == req.params.id) {
          media.images.splice(i, 1);
        }
      }
      console.log(media.images);
      
      media.save(function(err) {
        if (err) {
          res.status(400).send(util.setResData(false, "unable to delete image"));
        }
          res.send(util.setResData(true, "deleted successfully"));
      });
    }else{
      res.status(400).send(util.setResData(false, "unable to delete images"));
    }
  });
});


app.put('/media',authenticate, (req, res) => {
  var params = [
    'images',
    'header',
    'heading',
    'footer',
  ];
  var body = _.pick(req.body, params);
  
  Media.updateOne({ name: "media" }, body, { upsert: true, runValidators: true}).then((doc) => {
    res.send(util.setResData(true, "Media data updated successfully"));
  }).catch((e) => {
    console.log(e);
    res.status(400).send(util.setResData(false, "Error occured while updating media data"));
  });
});

app.get('/media', (req, res) => {
  Media.findOne({ name: "media" }, { _id: 0 }) .then((data) => {
    res.send(data);
  }, (e) => {
    res.status(400).send(util.setResData(false, "Error occured while getting media data"));
  });
});


//home site data apis 
app.put('/home',authenticate, (req, res) => {
  var params = [
    'top-container',
    'container1',
    'container2',
    'container3',
    'container4',
    'footer'
  ];
  var body = _.pick(req.body, params);

  Home.updateOne({ name: "home" }, body, { upsert: true, runValidators: true}).then((doc) => {
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


//about site data apis 
app.put('/about',authenticate, (req, res) => {
  var params = [
    'header',
    'section', 
    'table', 
    'footer',
  ];
  var body = _.pick(req.body, params);
  
  About.updateOne({ name: "about" }, body, { upsert: true, runValidators: true}).then((doc) => {
    res.send(util.setResData(true, "About data updated successfully"));
  }).catch((e) => {
    console.log(e);
    res.status(400).send(util.setResData(false, "Error occured while updating about data"));
  });
});

app.get('/about', (req, res) => {
  About.findOne({ name: "about" }, { _id: 0 }) .then((data) => {
    res.send(data);
  }, (e) => {
    res.status(400).send(util.setResData(false, "Error occured while getting about data"));
  });
});


//product site data apis 
app.put('/product',authenticate, (req, res) => {
  var params = [
    'heading', 
    'container1',
    'header',
    'container2',
    'container3',
    'footer',
  ];
  var body = _.pick(req.body, params);

  Product.updateOne({ name: "product" }, body, { upsert: true }).then((doc) => {
    res.send(util.setResData(true, "Product data updated successfully"));
  }).catch((e) => {
    res.status(400).send(util.setResData(false, "Error occured while updating product data"));
  });
});

app.get('/product', (req, res) => {
  Product.findOne({ name: "product" }, { _id: 0 }) .then((data) => {
    res.send(data);
  }, (e) => {
    res.status(400).send(util.setResData(false, "Error occured while getting product data"));
  });
});

//media site data apis 
app.put('/media',authenticate, (req, res) => {
  var params = [
    'heading', 
    'images',
    'footer',
  ];
  var body = _.pick(req.body, params);

  Media.updateOne({ name: "media" }, body, { upsert: true }).then((doc) => {
    res.send(util.setResData(true, "Media data updated successfully"));
  }).catch((e) => {
    res.status(400).send(util.setResData(false, "Error occured while updating media data"));
  });
});

app.get('/media', (req, res) => {
  Media.findOne({ name: "media" }, { _id: 0 }) .then((data) => {
    res.send(data);
  }, (e) => {
    res.status(400).send(util.setResData(false, "Error occured while getting media data"));
  });
});

//services site data apis 
app.put('/services',authenticate, (req, res) => {
  var params = [
    'heading', 
    'container1',
    'header',
    'container2',
    'container3',
    'footer',
  ];
  var body = _.pick(req.body, params);

  Services.updateOne({ name: "services" }, body, { upsert: true }).then((doc) => {
    res.send(util.setResData(true, "Services data updated successfully"));
  }).catch((e) => {
    res.status(400).send(util.setResData(false, "Error occured while updating services data"));
  });
});

app.get('/services', (req, res) => {
  Services.findOne({ name: "services" }, { _id: 0 }) .then((data) => {
    res.send(data);
  }, (e) => {
    res.status(400).send(util.setResData(false, "Error occured while getting services data"));
  });
});

//contactus site data apis 
app.put('/contactus',authenticate, (req, res) => {
  var params = [
    'map-url',
    'heading',
    'header',
    'footer',
  ];
  var body = _.pick(req.body, params);

  ContactUs.updateOne({ name: "contactus" }, body, { upsert: true }).then((doc) => {
    res.send(util.setResData(true, "ContactUs data updated successfully"));
  }).catch((e) => {
    res.status(400).send(util.setResData(false, "Error occured while updating contactus data"));
  });
});

app.get('/contactus', (req, res) => {
  ContactUs.findOne({ name: "contactus" }, { _id: 0 }) .then((data) => {
    res.send(data);
  }, (e) => {
    res.status(400).send(util.setResData(false, "Error occured while getting contactus data"));
  });
});

app.listen(port, () => {
  console.log(`Server is up on PORT: ${port}`);
});

module.exports = {
  app,
};
