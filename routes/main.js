
module.exports = app => {
  app.get('/', function(req, res, next){
    res.redirect('/pins/index');
  });
}
