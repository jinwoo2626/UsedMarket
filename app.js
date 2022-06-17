const express = require('express'),  // 모듈을 불러옴
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      session = require('express-session'),
      mongoose = require('mongoose'),
      MongoStore = require('connect-mongo')(session),
      path = require('path'),
      passport = require('passport');

// init app
const app = express();  //익스프레스 객체를 받은 app

// define port / 3000
const port = process.env.PORT || 3000;  //포트지정

// db
const {MONGO_URL} = require('./libs/db-connection');

// confs
app.use(bodyParser.json());   //json 형태로 parsing
app.use(bodyParser.urlencoded({extended: false})); // extended 는 중첩된 객체표현을 허용할지 말지를 정하는 것이다. 객체 안에 객체를 파싱할 수 있게하려면 true.
app.use(methodOverride('_method')); //ex) method가 post일 때 ?_method=PUT을 붙이면 app.put이 HTTP Request를 받을 수 있게 됨 / (가짜메소드로 변경)? 
app.use(express.static("public")); //파일경로설정 public

//session
app.use(session({
  secret: 'abc123', //필수항목 / cookie-parser의 비밀키와 같은 역할
  resave: true, //요청이 왔을 때 세션에 수정사항이 생기지 않더라도 다시 저장할지에 대한 설정
  saveUninitialized: true, //세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    url: MONGO_URL,
    autoReconnect: true
  })
}));

// passport middleware
app.use(passport.initialize()); //passport를 초기화하는 메서드 / passport는 인증을 요청하는 미들웨어이기 때문에 기본적으로 인증모듈을 초기화하는 작업을 가져야한다.
app.use(passport.session()); // 로그인 세션을 유지하는 메서드

// local vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.errors = [];
  next();
})

//ejs
app.set('view engine', 'ejs');

//routes path
const usersRoute = require('./routes/users');
const productsRoute = require('./routes/product');
const cartsRoute = require('./routes/cart');

// routes
app.use('/users', usersRoute);
app.use('/products', productsRoute);
app.use('/carts', cartsRoute);


// passport config
require('./config/passport')(passport);

// main routes process
const indexRoutes = require('./routes/')(app);

app.listen(port, err => {
  console.log(err ? `Error on port ${port}` : `App running on port ${port}`);
});
