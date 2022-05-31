const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const {ensureAuthenticated} = require('../libs/auth');

router.get('/', ensureAuthenticated, (req, res) => {
    Product.find({}).sort({date: 'desc'}).then(products => {
      res.render('products/index', {products, user: req.user.name});
    }).catch(err => console.log(err));
  }); 

  router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('products/add');
  });

router.post('/', (req, res) => {
    let errors = [];
    if (!req.body.name)
      errors.push({text: 'Please add a name'});
    if (!req.body.category)
      errors.push({text: 'Please add a category'});
    if (!req.body.price)
      errors.push({text: 'Please add a price'});
    if (!req.body.explanation)
      errors.push({text: 'Please add a explanation'});
    if (!req.body.quantity)
      errors.push({text: 'Please add a quantity'});

    if (errors.length > 0) {
      res.render('products/add', {
        errors,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        explanation: req.body.explanation,
        quantity: req.body.quantity
      });
    } else {
      Product.create({name: req.body.name, category: req.body.category, price: req.body.price,
         explanation: req.body.explanation, quantity: req.body.quantity, user: req.user.name}).then(() => {
        console.log('Product created!');
        res.redirect('/products');
      }).catch(err => console.log(err));
    }
  });
  router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Product.findById(req.params.id).then(product => {
      if (product.user != req.user.name) {
        console.log('Not authorized!');
        res.redirect('/products');
        return;
      }
      res.render('products/edit', {product});
    }).catch(err => console.log(err));
  });
  router.put('/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body).then(product => {
      console.log(`${product.name} updated!`);
      res.redirect('/products');
    }).catch(err => console.log(err));
  });
  router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(() => {
      console.log(`Product deleted!`);
      res.redirect('/products');
    }).catch(err => console.log(err));
  });
  router.get('/show/:id', ensureAuthenticated, (req, res) => {
    Product.find({_id: req.params.id}).then(products => {
      res.render('products/show', {products, user: req.user.name});
    }).catch(err => console.log(err));
  }); 
  
  module.exports = router;