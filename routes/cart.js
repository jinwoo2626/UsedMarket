const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const {ensureAuthenticated} = require('../libs/auth');

router.get('/cart/:id', ensureAuthenticated, (req, res) => {
    Product.find({_id: req.params.id}).then(products => {
      res.render('carts/cart', {products, user: req.user.name});
    }).catch(err => console.log(err));
  }); 
  router.post('/cart/:id', (req, res) => {
    Product.findById({_id: req.params.id}).then(products => {
       
    let errors = [];
    if (!req.body.quantity)
      errors.push({text: 'Please add a quantity'});
    if (errors.length > 0) {
      res.render('carts/cart', {
        errors,
        quantity: req.body.quantity
      });
    } else if(req.body.quantity <= products.quantity){  
      console.log(req.body.quantity);
       Cart.create({name: products.name, price: products.price, quantity: req.body.quantity, 
         user: req.user.id, productid: req.params.id}).then(() => {
        console.log('장바구니에 추가되었습니다!');
        res.redirect('/products');
       }).catch(err => console.log(err));      
    } else if(req.body.quantity == 0 || req.body.quantity > products.quantity){
      console.log('수량을 다시 작성해주세요');
        res.redirect('/products');
    }
  })
  });
  router.get('/cartview', ensureAuthenticated, (req, res) => {
    Cart.find({user: req.user.id}).then(carts => {
      res.render('carts/cartview', {carts, user: req.user.name});
    }).catch(err => console.log(err));
  }); 
  var products;
  router.put('/:id', (req, res) => {
    Product.findById({_id: req.params.id}).then(products => {
        products = products.quantity - req.body.quantity;         
    // Product.update({_id: {$in : req.params.id}}, {$set:{quantity: products}});
    Product.findOne({_id: req.params.id}).exec(function(err, doc){
        if(doc){
            doc.quantity = products;
            doc.save(function(err, product){
                console.log("구매완료");
            })
        }
    })
    Cart.findByIdAndRemove(req.body.cartid).then(() => {
        console.log(`Product deleted!`);
        res.redirect('/carts/cartview');
    }).catch(err => console.log(err));
})
  });
  router.delete('/:id', (req, res) => {
    Cart.findByIdAndRemove(req.params.id).then(() => {
      console.log(`Product deleted!`);
      res.redirect('/carts/cartview');
    }).catch(err => console.log(err));
  });

  module.exports = router;