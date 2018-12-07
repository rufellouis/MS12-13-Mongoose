require('dotenv').config()
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const errController = require('./controllers/errors');
const User = require('./models/User');

const app = express();
app.use(helmet());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to save user to request body for every request
app.use((req, res, next) => {
  User
    .findOne({name: 'Abbie'})
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.set('view engine', 'ejs');
app.set('views', 'views');

// Render '404' page
app.use(errController.get404);

mongoose
  .connect(process.env.MONGOURI, {useNewUrlParser: true, poolSize: 5})
  .then(result => {
    User
      .findOne()
      .then(user => {
        if(!user) {                           // add default user if none exists
          const user = new User({
            name:'Abbie', 
            email: process.env.USER_EMAIL,
            password: process.env.USER_PWD,
            image_url: null,
            admin: 1,
            cart: {items: []}
          });
          user.save();
        }
        app.listen(process.env.PORT, () => console.log(`MS12-13-Mongoose on port ${process.env.PORT}...`));
      })
  })
  .catch(err => console.log(err));
