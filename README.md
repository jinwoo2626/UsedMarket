# Node.js-gimalproject
node.js 기말과제 프로젝트/ 유저들간에 거래가 가능한 중고거래 사이트

# 사용스택
⊙ front-end : ejs, bootstrap <br>
⊙ back-end : node.js, express <br>
⊙ db : mongoose

# 프로젝트 시연
https://youtu.be/9MSR42T8_co

# 각 모듈별 설명
- User  

users부분은 로그인, 회원가입, 회원정보, 회원탈퇴, 구매기록 확인으로 이루어져있습니다. 회원 가입할 때 아이디, 비밀번호, 비밀번호확인, 이름, 전화번호를 모두 입력해야합니다. 비밀번호와 비밀번호확인에 같은 내용이 작성되어 있어야만 회원가입이 가능합니다. 로그인할 때 회원가입 시 작성하였던 아이디, 비밀번호를 올바르게 작성하여야 합니다. 회원정보에서는 가입할 때 작성하였던 내용들과, 보유금액을 확인해 볼 수 있습니다. 아이디와 비밀번호는 조회 불가능합니다. 회원탈퇴를 하게 되면 회원정보와 보유금액, 회원이 등록하였던 제품들의 정보를 모두 삭제하게 됩니다. 구매기록 확인에서는 해당 회원이 거래한 내용이 기록됩니다. 제품명, 제품가격(단가), 구매한 수량, 총금액, 거래일자와, 구매했는지 판매했는지 비고를 확인할 수 있습니다.  

- Products

products부분은 제품추가(등록), 수정, 삭제, 제품목록(장터), 제품내용확인(자세히보기)으로 이루어져있습니다. 제품을 추가할 때 제품명, 분류, 가격, 설명, 수량을 입력해야합니다. 제품목록화면(장터)은 자신이 올린 제품과 다른 회원이 올린 제품들을 모두 확인 할 수 있습니다. 자신이 올린 제품은 제품내용확인, 제품정보수정하기, 제품삭제하기를 할 수 있고, 다른 회원이 올린 제품은 제품내용확인만 가능합니다. 제품내용확인(자세히보기)은 장터의 제품 목록 중에 자세히 보기 버튼을 누르면 들어갈 수 있는 화면입니다. 해당 화면에서는 장터에서 간략히 제공되었던 제품내용들을 자세히 확인할 수 있습니다. 제품정보 수정에서는 값을 변경하고 제품수정버튼을 누르면 변경된 값이 적용됩니다. 제품삭제를 하게 되면 자신이 등록한 해당 제품이 사라지게 됩니다.

- Carts

carts부분은 장바구니에 담기, 장바구니목록, 장바구니 제품삭제, 장바구니 제품구매로 이루어져 있습니다. 먼저 장바구니에 담기입니다. 장바구니담기화면은 제품내용확인(자세히보기)화면에서 구매하기 버튼을 누르면 볼 수 있는 화면입니다. 자신이 등록한 제품에서는 구매하기버튼이 나타나지 않고, 다른 사람이 등록한 제품에서만 구매하기 버튼이 나타납니다. 다른 사람이 등록한 제품만 장바구니에 담을 수 있습니다. 장바구니담기화면에서 구매하려는 수량을 작성하고 장바구니에 담기 버튼을 누르면 자신의 장바구니에 제품이 담기게 됩니다. 수량을 0개 혹은 음수 값, 제품수량보다 초과된 값으로 입력하면 장바구니에 담기지 않습니다. 장바구니목록에서는 자신이 장바구니에 담은 제품들을 확인할 수 있습니다. 장바구니목록에서 장바구니에 담은 제품을 삭제할 수도 있습니다. 장바구니 목록에서 구매하기 버튼을 누르면 제품을 구매할 수 있습니다. 제품을 장바구니에 담고 구매하는 과정동안 장터의 제품이 품절될 가능성도 있기 때문에 구매할 때 수량이 충분한지 한 번 더 확인하고, 보유금액도 충분한지 확인합니다. 해당 조건을 충족하면 구매자의 금액과 판매자의 보유 금액을 변동시키고, 장터의 제품수량 차감, 구매자와 판매자의 거래기록생성, 제품 구매 시 장바구니에서 구매한 제품을 삭제 등을 진행합니다.

# 주요 코드
- 화면이동(render 사용)  
![image](https://user-images.githubusercontent.com/74890691/204229513-fa96b62b-1646-4126-9d2d-cf3460aee6bd.png)  
routes/users에서 로그인 화면이동 기능입니다. 
get요청(/users/login)이 오면 users아래 login.ejs로 화면을 이동시킵니다. 
  
- 로그인(Passport, Session 사용)  
![image](https://user-images.githubusercontent.com/74890691/204229739-4bae9d19-5775-4051-8852-5dc92d003d89.png)  
post요청(/users/login)이 오면 로컬인증방식을 통해 로그인처리를 합니다. 
인증성공시 메인화면으로 이동하고, 인증실패시 /users/login화면으로 이동합니다.
  
![image](https://user-images.githubusercontent.com/74890691/204229829-aa295726-da2f-4124-84c4-a22d08e9b464.png)  
config/passport.js파일입니다. 해당 파일에서 로그인인증을 하는데 먼저 idemail로 회원을 찾습니다. 해당회원이 User에 존재하지 않으면 로그인이 실패하고, 해당회원이 존재하면 비밀번호 확인을 합니다. 입력한 비밀번호와 회원정보에 작성된 비밀번호와 비교하여 비밀번호가 맞으면 return done(null, {인증된 값의 json})을 통해 값을 보냅니다. 비밀번호가 틀리면 return done에 json값 대신 false를 넣어 보냅니다. 
  
![image](https://user-images.githubusercontent.com/74890691/204229901-4c05cdd5-2a6f-46b5-825d-b2243fa1f9cc.png)  
로그인에 성공했을 때 serializeUser 메서드를 통해 사용자의 정보를 Session에 저장하게 됩니다. deserializeUser메서드는 로그인 정보를 유지하는 작업을 맡습니다. 페이지에 접근할 때마다 사용자 정보를 Session에 가지는 역할입니다. 
  
![image](https://user-images.githubusercontent.com/74890691/204229942-624522a9-42ce-4a68-b60c-f2ee835cba41.png)  
app.js에서 passport를 초기화하는 메서드와 로그인 세션을 유지하는 메서드를 작성합니다. passport는 인증을 요청하는 미들웨어이기 때문에 기본적으로 인증모듈을 초기화하는 작업을 가져야합니다.
  
![image](https://user-images.githubusercontent.com/74890691/204230002-9d041881-3484-4eb8-a960-fc114be79a06.png)  
추가적으로 app.js에서 session값을 설정합니다. secret = 필수항목으로 cookie-pars
er의 비밀키와 같은 역할을 합니다. resave = 요청이 왔을 때 세션에 수정사항이 생기지 않더라도 다시 저장할지에 대한 설정입니다. saveUninitialized = 세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정입니다.  
  
- 로그아웃(req.logout 사용)  
![image](https://user-images.githubusercontent.com/74890691/204230072-97fb3166-5d0d-4327-bb84-76609d983850.png)  
req.logout()을 호출하면 request.user라는 데이터를 삭제하고, session store에 있는passport데이터를 삭제합니다.
  
- 회원가입(create문, findone, save사용, bcrypt암호화 사용)  
![image](https://user-images.githubusercontent.com/74890691/204230228-9b5384fe-646a-48a8-9f10-46ef1f1883e5.png)  
post요청(/users/register)이 오면 먼저 간단하게 비밀번호와 비밀번호 확인란이 같은지, 비밀번호가 5자 미만인지, 에러가 없는지에 대한 유효성검사를 진행합니다. 
  
![image](https://user-images.githubusercontent.com/74890691/204230262-dcaa5749-5655-42d0-b956-a35a78b20eb5.png)  
유효성검사를 통과하면 User에 입력한 idemail이 존재하는지 findOne문으로 찾습니다. idemail이 존재하지 않으면 전달받은 값을 저장하고, 비밀번호 암호화를 진행합니다. 암호화 진행 후 newUser에 저장된 값들을 save문으로 데이터베이스에 저장시킵니다.
bcrypt는 비밀번호 암호화 처리에 필요한 라이브러리입니다.
bcrypt.genSalt()에서 첫 번째 인자는 salt의 자리수를 정해서 비밀번호를 암호화 시켜줍니다. 
bcrypt.hash()의 첫 번째 인자는 password값이고, 두 번째 인자는 bcrypt.genSalt()에서의 salt입니다. bcrypt.genSalt()에서 err가 발생하지 않았기 때문에 salt를 넣어줄 수 있습니다. 마지막으로 세 번째 인자는 암호화된 비밀번호 값입니다.
해당 과정을 거쳐서 에러가 없을 때 hash값을 다른 전달받은 값들과 함께 저장시킵니다.
  
- 회원정보수정(update문, findbyidandupdate 사용)  
![image](https://user-images.githubusercontent.com/74890691/204230435-43233f44-6491-43f3-84f7-db7a35a6f98b.png)  
put요청(/users/:id)이 오면 전달받은 id값으로 User에서 검색한 다음에 해당정보를 user.body의 값으로 수정합니다.
  
- 회원정보삭제(delete문, findbyidandremove, findone, remove 사용)  
![image](https://user-images.githubusercontent.com/74890691/204230521-365fdd30-f2b7-4e59-a502-44012fa0cdcd.png)  
delete요청(/users/:id)이 오면 Product와 User에서 전달받은 id값으로 검색합니다. 
Product쪽에서는 findOne, remove방식을 사용했습니다. 
User쪽에서는 id값으로 검색하자마자 해당 값이 삭제되고 logout처리도 같이 진행합니다. 
  
- 제품등록  
![image](https://user-images.githubusercontent.com/74890691/204230579-055cff25-90a4-4b1a-8080-7486b59bdcc8.png)  
제품등록부분의 create문입니다. 회원가입 쪽에서 사용한 findOne, save방식과는 다르게 create문으로 작성하였습니다. create안에 전달받은 값을 각각 저장시킵니다. 
  
- routes에서 전달받은 값 받기  
![image](https://user-images.githubusercontent.com/74890691/204230664-97489453-63a6-41f7-b9c8-af79a8e188c4.png)  
<% if (carts.length > 0) {%> carts데이터가 정상적으로 넘어왔는지 확인합니다. 
<% carts.forEach(cart => {%> 넘어온 carts를 foreach문으로 반복하여 출력합니다. 









