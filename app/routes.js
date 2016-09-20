module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
//    var Scene = require('./models/sceneModel')
//    console.log('You have entered the routes export thingamabob')
//    
//    app.get('/scenes', function(req, res, next) {
//      Scene.find(function(err, scenes){
//        if(err) return next(err); 
//        console.log('All scenes requested');
//          res.json(scenes);
//        });
//    });
//
//    app.post('/scenes', function(req, res, next) {
//      var scene = new Scene(req.body.story);
//      Scene.save(function(err, scene){
//        if(err) return next(err);
//          console.log('One new scene made');
//        res.json(scene);
//      });
//    });
//
//    app.get('/scenes/:id', function(req, res, next) {
//      var id = req.params.id;
//        Scene.findById(id, function (err, scene) {
//        if (err) return next(err);
//          console.log('One scene requested');
//        res.json(scene);
//      });
//    });
//
//    app.put('/scenes/:id', function(req, res, next) {
//      var scene = new Scene(req.body.story);
//        var id = req.params.id;
//        console.log(scene);
//        Scene.findByIdAndUpdate(id, scene, function (err, scene) {
//        if (err) return next(err);
//          console.log('One existing scene edited');
//        res.json(scene);
//      });
//    });
//
//    app.delete('/scenes/:id', function(req, res, next) {
//      Scene.findByIdAndRemove(req.params.id, req.body, function (err, scene) {
//        if (err) return next(err);
//          console.log('One scene deleted');
//        res.json(scene);
//      });
//    });

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};