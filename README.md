# MS12-Node11
## Section 13 - Working with Mongoose

![a](../assets/a.png?raw=true)
![b](../assets/b.png?raw=true)
![c](../assets/c.png?raw=true)

* Use `mongoose` to connect to `ms12_13` database on MongoDB Atlas
  * Collections: `products`, `users`, `orders`
* Use `dotenv` package for environment variables in `.env` file
* Run `$ npm start`
  * Creates default user if none exists
  * Middleware adds default user to `req.user` for every request
* User can 
  * Create/delete products
  * Add/remove products to/from cart
  * Place order by moving cart to `orders` collection
* See `mongoose` docs for: `$in`, `$pull`, `populate()`, `select`...
