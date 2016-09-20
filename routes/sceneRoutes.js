var express = require('express');
var router = express.Router();

var Todo = require('../../models/scenes.js');

/* GET /todos listing. */
app.get('/scenes', function(req, res, next) {
  Scene.find(function(err, scenes){
    if(err){ return next(err); }
    res.json(scenes);
  });
});

app.post('/scenes', function(req, res, next) {
  var scene = new Scene(req.body);
  scene.save(function(err, scene){
    if(err){ return next(err); }
    res.json(scene);
  });
});

app.get('/scenes/:id', function(req, res, next) {
  Scene.findById(req.params.id, function (err, scene) {
    if (err) return next(err);
    res.json(scene);
  });
});

app.put('/scenes/:id', function(req, res, next) {
  Scene.findByIdAndUpdate(req.params.id, req.body, function (err, scene) {
    if (err) return next(err);
    res.json(scene);
  });
});

app.delete('/scenes/:id', function(req, res, next) {
  Scene.findByIdAndRemove(req.params.id, req.body, function (err, scene) {
    if (err) return next(err);
    res.json(scene);
  });
});
module.exports = router;
