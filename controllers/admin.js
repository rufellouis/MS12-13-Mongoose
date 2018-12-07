const {ObjectId} = require('mongodb');
const Product = require('../models/Product');
const User = require('../models/User');

// for GET /admin/add-product route
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'MS12-13-Mongoose Add Product', 
    path: '/admin/add-product',
    editing: false
  });
};

// for POST /admin/add-product route
exports.postAddProduct = (req, res, next) => {
  const {title, price, description, image_url} = req.body;
  const product = new Product({title, price, description, image_url, user_id: req.user});
  product
    .save()
    .then(result => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

// for GET /admin/edit-product route
exports.getEditProduct = (req, res, next) => {
  const editMode = !!req.query.edit;
  Product
    .findById(req.params.id)
    .then(prod => {
      res.render('admin/edit-product', {
        pageTitle: 'MS12-13-Mongoose Edit Product', 
        path: '/admin/edit-product',
        editing: editMode,
        prod
      });
    })
    .catch(err => console.log(err));
};

// for POST /admin/edit-product route
exports.postEditProduct = (req, res, next) => {
  const {id, title, price, description, image_url} = req.body;
  Product
    .findByIdAndUpdate(id, {$set: {title, price, description, image_url}})
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

// for GET /admin/products route
exports.getProducts = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('admin/admin-products', {
        products, 
        pageTitle: 'MS12-13-Mongoose All Products', 
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  Product
    .findByIdAndDelete(req.body.id)
    .then(() => User.updateMany({}, {$pull: {'cart.items': {_pid: ObjectId(req.body.id)}}}))
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};
