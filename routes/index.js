module.exports = app => {
  //메인화면으로 이동
  app.get('/', (req, res) => {
    res.render('index');
  });
};
