const Product = require('../models/Product');
const Order = require('../models/Order');

// for GET /products route
exports.getProducts = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'MS12-13-Mongoose All Products', 
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

// for GET /products/:id route
exports.getProduct = (req, res, next) => {
  Product
    .findById(req.params.id)
    .then(prod => {
      res.render('shop/product-detail', {
        prod,
        pageTitle: prod.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

// for GET / route
exports.getIndex = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('shop/index', {
        products, 
        pageTitle: 'MS12-13-Mongoose Shop', 
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

// for GET /cart route (see sample output below)
exports.getCart = (req, res, next) => {
  req.user
    // get only '_id', 'title', 'price' fields for product (need '_id' to know which to delete)
    .populate({path: 'cart.items._pid', select: 'title price'})
    .execPopulate()
    .then(user => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'MS12-13-Mongoose Cart',
        cartItems: user.cart.items
      });
    })
    .catch(err => console.log(err));
};

// for POST /add-to-cart route
exports.postAddToCart = (req, res, next) => {
  Product
    .findById(req.body.id)
    .then(product => req.user.addToCart(product))
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

// for POST /del-cart-item route
exports.postDeleteCartItem = (req, res, next) => {
  const {id, qty} = req.body;
  req.user
    .deleteCartItem(id, qty)
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

// for GET /orders route
exports.getOrders = (req, res, next) => {
  Order
    .find({'user._id': req.user._id})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'MS12-13-Mongoose Orders',
        orders
      });
    })
    .catch(err => console.log(err));
};

// for POST /create-order route
exports.postOrder = (req, res, next) => {
  req.user
    .populate({path: 'cart.items._pid', select: '-createdAt -updatedAt'})
    .execPopulate()
    .then(user => {
      // use '_doc' to select the data and avoid other mongoose junk
      const products = user.cart.items.map(i => ({qty: i.qty, ...i._pid._doc}));
      const order = new Order({
        user: {_id: req.user._id, name: req.user.name, email: req.user.email},
        items: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(result => res.redirect('/orders'))
    .catch(err => console.log(err));
};

// Sample output from 'populate'
// {
//   cart: {
//     items: [
//       {
//         _id: 5c0ab1a6147ef9171459e7ca,
//         _pid: { _id: 5c0aaf084ceeea0aec43f4ce, title: 'aaaaaaaaa', price: 11 },
//         qty: 2
//       }
//     ]
//   },
//   admin: true,
//   _id: 5c0aabf1ba11e22cc0bf05e9,
//   name: 'Abbie',
//   email: 'abbie@example.com',
//   password: '123456',
//   image_url: null,
//   createdAt: 2018-12-07T17:20:49.551Z,
//   updatedAt: 2018-12-07T17:45:46.404Z,
//   __v: 1
// }