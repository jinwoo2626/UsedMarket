  const express = require('express'),
        router = express.Router(),
        Cart = require('../models/Cart'),
        Product = require('../models/Product'),
        User = require('../models/User'),
        Purchaseinfo = require('../models/Purchaseinfo'),
        {ensureAuthenticated} = require('../libs/auth');

  //장바구니담기 화면이동
  router.get('/cart/:id', ensureAuthenticated, (req, res) => {
    Product.find({_id: req.params.id}).then(products => { //Product 에서 _id가 req.params.id인값을 찾음
      res.render('carts/cart', {products, username: req.user.name}); //products와 req.user.name값을 carts/cart로 넘겨줌
    }).catch(err => console.log(err));
  }); 

  //장바구니담기 처리
  router.post('/cart/:id', (req, res) => {
    Product.findById({_id: req.params.id}).then(products => { //Product 에서 _id가 req.params.id인값을 찾음
      var ReqQuan = parseInt(req.body.quantity);
     let errors = [];
    if (!req.body.quantity || ReqQuan < 1 || req.body.quantity > products.quantity){  //수량값이 들어오지 않았을 때 혹은 장바구니에 담을 수량이 1개 미만( 0개 혹은 음수값)일 때 / 제품수량이 장바구니에 담을 수량보다 적을 때
        console.log('수량을 다시 작성해주세요');
        res.redirect('/products');
    }else{
        if (errors.length > 0) {  //에러 시
          res.render('carts/cart', { //요청받은 값들을 가지고 carts/cart 화면으로 이동
            errors,
            quantity: req.body.quantity
          });
        } else if(req.body.quantity <= products.quantity){  //제품수량이 장바구니에 담을 수량보다 많을때
          //장바구니에 추가하기 위한 create문
          Cart.create({name: products.name, price: products.price, quantity: req.body.quantity, //넘어온값들을 각 속성에 넣고 create문 실행
            user: req.user.id, productid: req.params.id}).then(() => {
            console.log('장바구니에 추가되었습니다!');
            res.redirect('/products');
          }).catch(err => console.log(err));      
        }
    }
    })
  });

  //장바구니 화면이동
  router.get('/cartview', ensureAuthenticated, (req, res) => { 
    Cart.find({user: req.user.id}).then(carts => {  // Cart에서 req.params.id로 값을 찾음
      res.render('carts/cartview', {carts, user: req.user.id}); //carts와 req.user.id값을 carts/cart로 넘겨줌
    }).catch(err => console.log(err));
  }); 
  
  //장바구니에서 제품구매 처리
  router.put('/:id', (req, res) => {
    Product.findById({_id: req.params.id}).then(products => { // Cart에서 _id가 req.params.id로 값을 찾음

    if(products){ //해당 제품이 존재할 때 / 110라인 else문 전까지 if문 범위

    //제품수량이 장바구니에 담을 수량보다 많거나 같을때 / 보유금액이 충분할 때 / 106라인 else문전까지 if문범위
      if(products.quantity >= req.body.quantity && req.user.money >= (req.body.price * req.body.quantity)){  

          //제품 구매시 구매자의 보유금액 변경
          User.findOne({_id: req.user.id}).exec(function(err, doc){  
            if(doc){    //에러가 아닐 때
                doc.money = req.user.money - (req.body.price * req.body.quantity); //수량변경한 값을 저장
                doc.save(function(err, product){
                    console.log("금액차감");
                })
              }
          });

          //제품 구매시 판매자의 보유금액 변경
          User.findOne({_id: products.user}).exec(function(err, doc2){  
            if(doc2){    //에러가 아닐 때
                doc2.money = doc2.money + (req.body.price * req.body.quantity); //수량변경한 값을 저장
                doc2.save(function(err, product){
                    console.log("금액차증");
                })
            }
          });

          //제품 구매시 제품수량을 변경
          Product.findOne({_id: req.params.id}).exec(function(err, doc3){  // Product에서 _id가 req.params.id로 값을 찾음
            if(doc3){    //에러가 아닐 때
                doc3.quantity = products.quantity - req.body.quantity; //수량변경한 값을 저장
                doc3.save(function(err, product){
                    console.log("구매완료");
                })
            }
          });

          // 앞에서 (Cart에서 _id가 req.params.id로 값을 찾음) 찾은값으로 create문 실행
          //제품 구매시 거래내역을 남기기 위한 create문 / 구매자의 거래기록
          Purchaseinfo.create({name: products.name, price: products.price, quantity: req.body.quantity, 
            user: req.user.id, money: req.body.price * req.body.quantity, state: "구매"}).then(() => {
            console.log('거래내역에 추가되었습니다(구매).');
              }).catch(err => console.log(err));  
          
          //판매자의 거래기록
          Purchaseinfo.create({name: products.name, price: products.price, quantity: req.body.quantity, 
            user: products.user, money: req.body.price * req.body.quantity, state: "판매"}).then(() => {
            console.log('거래내역에 추가되었습니다(판매).');
              }).catch(err => console.log(err));  
      
          //제품 구매시 장바구니에서 구매한 제품을 삭제처리
          Cart.findByIdAndRemove(req.body.cartid).then(() => { // Cart에서 req.body.cartid로 값을 찾아 삭제함
              console.log(`거래가 완료되어 장바구니에서 제품을 삭제합니다.`);
              res.redirect('/carts/cartview');
          }).catch(err => console.log(err));    

        }else{              //제품수량이 장바구니에 담을 수량보다 적을 때
          console.log(`구매하려는 수량보다 물품의 수량이 적거나 보유금액이 부족합니다!`);
          res.redirect('/carts/cartview');
        }
    }else{ //장바구니에 제품을 보관하였는데 구매하기 전에 해당 제품이 장터에서 내려갔을 때
      console.log('제품을 등록한 회원이 제품을 삭제하여서 구매할 수 없습니다.'); 
      res.redirect('/carts/cartview');
    }
    });
   });
   
  //장바구니 제품 삭제처리
  router.delete('/:id', (req, res) => {
    Cart.findByIdAndRemove(req.params.id).then(() => { // Cart에서 req.params.id로 값을 찾아 삭제함
      console.log(`Product deleted!`);
      res.redirect('/carts/cartview');
    }).catch(err => console.log(err));
  });

  module.exports = router;