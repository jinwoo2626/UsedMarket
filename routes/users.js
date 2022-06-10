
  const express = require('express'),
        bcrypt = require('bcryptjs'),
        router = express.Router(),
        passport = require('passport'),
        User = require('../models/User'),
        Product = require('../models/Product'),
        {ensureAuthenticated} = require('../libs/auth'),
        Purchaseinfo = require('../models/Purchaseinfo');

  //로그인 화면이동
  router.get('/login', (req, res) => {
    res.render('users/login', {error: ''});
  });

  //회원가입 화면이동
  router.get('/register', (req, res) => {
    res.render('users/register', {
      errors: [],
      idemail: '',
      password: '',
      rpassword: '',
      name: '',
      phone: ''
    });
  });

  //로그아웃
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
  });

  //회원가입처리
  router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.rpassword)  //비밀번호와 비밀번호 확인란이 같은경우
      errors.push({text: '비밀번호가 동일하지 않습니다'});
    if (req.body.password.length <5 )            //비밀번호가 5자 미만인 경우
      errors.push({text: '비밀번호는 최소 5자 이상 작성하셔야 합니다!'});
    if (errors.length > 0) {                     //에러 시
      res.render('users/register', {    //users/register 화면으로 이동
        errors,
      });
    }  else {   //에러가 없을 시 회원가입처리
      User.findOne({idemail: req.body.idemail}).then(user => {  //User 에서 idemail이 req.body.idemail인값을 찾음
        if (user) { 
          errors.push({text: 'User already exist!'});
          res.render('users/register', {errors, idemail: '', password: '', rpassword: '', name: '', phone: ''});
        } else {  //전달받은값 저장
          const newUser = new User({
            idemail: req.body.idemail,
            password: req.body.password,
            name: req.body.name,
            phone: req.body.phone
          });
          bcrypt.genSalt(10, (err, salt) => { //비밀번호 암호화
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save().then( user => {  //save함
                console.log(`User ${user.name} register!`);
                res.redirect('/users/login');
              }).catch(err => console.log(err));
            });
          });
        }
      });
    }
  });

  //로그인처리
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', {  //로컬인증방식
      successRedirect: '/',           //인증성공시
      failureRedirect: '/users/login' //인증실패시
    })(req, res, next);
  });

  //회원정보 화면이동
  router.get('/info/:id', ensureAuthenticated, (req, res) => {
    User.find({_id: req.params.id}).then(users => { //User에서 _id가 req.params.id인 값을 찾음
      res.render('users/info', {users, user: req.user.name}); //users와 req.user.name값을 users/info로 넘겨줌
    }).catch(err => console.log(err));
  }); 

  //회원정보 화면이동(id값이 없을때 메인화면으로 이동처리)
  router.get('/info', (req, res) => {
    res.redirect('/');
  });
  
  //회원정보 수정화면이동
  router.get('/updateinfo/:id', (req, res) => {
    User.find({_id: req.params.id}).then(users => { //User에서 _id가 req.params.id인 값을 찾음
      res.render('users/updateinfo', {users, user: req.user.name}); //users와 req.user.name값을 users/updateinfo로 넘겨줌
    }).catch(err => console.log(err));
  });

  //회원정보 수정
  router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body).then(user => {  //User에서 req.params.id로 값을 찾고 req.body값으로 변경
      console.log(`${user.name} 님 회원정보 수정완료`);
      res.redirect('/users/info');
    }).catch(err => console.log(err));

    //회원이름 변경 시 자신이 등록한 제품의 판매자명도 수정
    Product.findOne({user: req.params.id}).exec(function(err, doc){  // Product에서 uesr가 req.params.id인 값을 찾음
      if(doc){    //에러가 아닐 때
          doc.username = req.body.name; //수량변경한 값을 저장
          doc.save(function(err, product){
              console.log("제품판매자명 변경완료");
          })
      }
    })
  });

  //회원정보 삭제 / (회원정보 및 회원이 보유한 제품 모두 삭제)
  router.delete('/:id', (req, res) => {
    Product.findOne({user: req.params.id}).exec(function(err, doc){  // Product에서 user가 req.params.id인 값을 찾음
      if(doc){    //에러가 아닐 때
          doc.user = req.params.id; //해당값 삭제
          doc.remove(function(err, product){
              console.log("회원이 보유한 제품 삭제완료");
          })
      }
    })

    User.findByIdAndRemove(req.params.id).then(() => {  //User에서 req.params.id로 값을찾고 삭제함
      console.log(`회원탈퇴`);
      req.logout();
      res.redirect('/');
    }).catch(err => console.log(err));
  });

  //구매기록확인 화면이동
  router.get('/purchaseinfo/:id', (req, res) => { 
    Purchaseinfo.find({user: req.params.id}).then(purchases => {   //Purchaseinfo에서 user가 req.params.id인 값을 찾음
      res.render('users/purchaseinfo', {purchases, user: req.user.name}); //purchases와 req.user.name값을 users/purchaseinfo로 넘겨줌
    }).catch(err => console.log(err));
  });

  module.exports = router;
