  const express = require('express'),
        router = express.Router(),
        Product = require('../models/Product'),
        {ensureAuthenticated} = require('../libs/auth');

  //제품목록(장터) 화면이동
  router.get('/', ensureAuthenticated, (req, res) => {
    Product.find({}).sort({date: 'desc'}).then(products => {  //Product에서 모든 목록을 불러와서 내림차순정렬
      res.render('products/index', {products, username: req.user.name});  //products와 req.user.name값을 products/index로 넘겨줌
    }).catch(err => console.log(err));
  }); 

  //제품등록 화면이동
  router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('products/add');
  });

  //제품등록처리
  router.post('/', (req, res) => {
    let errors = [];
    //제품등록처리시 값이 비었을 경우
    if (!req.body.name)
      errors.push({text: '제품명을 입력해주세요'});
    if (!req.body.category)
      errors.push({text: '제품분류를 입력해주세요'});
    if (!req.body.price)
      errors.push({text: '제품가격을 입력해주세요'});
    if (!req.body.explanation)
      errors.push({text: '제품설명을 입력해주세요'});
    if (!req.body.quantity)
      errors.push({text: '제품수량을 입력해주세요'});

    if (errors.length > 0) {  //에러 시
      res.render('products/add', {  //요청받은 값들을 가지고 products/add 화면으로 이동
        errors,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        explanation: req.body.explanation,
        quantity: req.body.quantity
      });
    } else {  //에러가 없을 시 create문 실행 
      //전달받은 req.body값들로 create문 실행 / 각 속성에 req.body.속성명으로 값 넣기
      Product.create({name: req.body.name, category: req.body.category, price: req.body.price,
         explanation: req.body.explanation, quantity: req.body.quantity, user: req.user.id, username: req.user.name}).then(() => {
        console.log('Product created!');
        res.redirect('/products');
      }).catch(err => console.log(err));
    }
  });

  //제품수정 화면이동
  router.get('/edit/:id', ensureAuthenticated, (req, res) => { 
    Product.findById(req.params.id).then(product => {  //Product에서 req.params.id로 값을찾음
      if (product.user != req.user.id) {  //제품판매자와 유저정보가 다를때
        console.log('Not authorized!');
        res.redirect('/products');
        return;
      }
      res.render('products/edit', {product}); //product값을 가지고 products/edit로 이동
    }).catch(err => console.log(err));
  });

  //제품수정 처리
  router.put('/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body).then(product => { //Product에서 req.params.id로 값을찾고 req.body값으로 수정
      console.log(`${product.name} 제품정보 수정`);
      res.redirect('/products');
    }).catch(err => console.log(err));
  });

  //제품삭제 처리
  router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(() => { //Product에서 req.params.id로 값을찾고 삭제
      console.log(`제품삭제완료`);
      res.redirect('/products');
    }).catch(err => console.log(err));
  });

  //제품상세정보보기 화면이동
  router.get('/show/:id', ensureAuthenticated, (req, res) => {
    Product.find({_id: req.params.id}).then(products => {  //Product에서 req.params.id로 값을찾기
      res.render('products/show', {products, username: req.user.name}); //products와 req.user.name값을 products/show로 넘겨줌
    }).catch(err => console.log(err));
  }); 
  
  module.exports = router;