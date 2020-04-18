var path = require('path');
var Pin = require('../models/pins');

module.exports = app =>{

  app.get('/pins/pin-search', (req,res,next) => {
    Pin.find({"title" : {"$regex": req.query['search'], "$options":"1"}}, (err,pins) => {
        res.render('pins/index',{pins: pins});
    })
  })

  app.get('/pins/saved-pins',(req,res,next) => {
    Pin.find({"isSave": true}, (err,pins) => {
        res.render('pins/index',{pins: pins});
    })
  })

  app.get('/pins/pin-save/:id', (req,res,next) =>{
      Pin.findOne({_id: req.params.id},(err,foundPin) => {
        if(foundPin){
          foundPin.isSave = !(foundPin.isSave);

          foundPin.save( (err) => {
            if(err) return next(err);
            res.redirect('/pins/details/' + foundPin._id);
          })
        }
      })
  })

  app.route('/pins/create')
  .get( (req,res,next) => {
    res.render('pins/create');
  })
  .post( (req,res,next) => {

    var pin = new Pin();
    pin.title = req.body.title;
    pin.desc = req.body.desc;
    pin.username = req.body.username;
    pin.isSave = false;

    if(!req.files){
      return json('error');
    }

    let sampleFile = req.files.sampleFile;
    let fileName = Math.random().toString(26).slice(2) + '.jpg';
    let path = './public/Files/' + fileName;

    pin.path = '/Files/' + fileName;

    sampleFile.mv(path, (err) => {
      if(err){
        return res.status(500).send(err);
      }
    });

    pin.save( (err) => {
      if(err){
        res.send("Pin could not be saved at this moment");
      }
      res.redirect('/pins/index');
    })
  });

  app.get('/pins/index', (req,res,next) =>{
    Pin.find({}, (err,pins) => {
      res.render('pins/index', {pins: pins});
    })
  });

  app.get('/pins/delete/:id', (req,res,next) =>{
    Pin.findOne({_id:req.params.id}).deleteOne().exec((err,foundPin) => {
      res.redirect('/pins/index');
    })

  });

  app.route('/pins/edit/:id').get( (req,res,next) => {
    Pin.findOne({_id:req.params.id}, (err,foundPin) => {
      res.render('pins/edit',{pin: foundPin});
    })
  })
  .post( (req,res,next) => {
    Pin.findOne({_id:req.params.id}, (err,foundPin) => {
      if(foundPin){
        if(req.body.title) foundPin.title = req.body.title;
        if(req.body.desc) foundPin.desc = req.body.desc;

        foundPin.save( (err) => {
          if(err) return next(err);
          res.redirect('/pins/details/' + foundPin._id);
        })
      }

    })
  })

  app.get('/pins/details/:id', (req,res,next) =>{
    Pin.findOne({_id:req.params.id}, (err,foundPin) => {
      res.render('pins/details', {pin: foundPin});
    })
  });

}
