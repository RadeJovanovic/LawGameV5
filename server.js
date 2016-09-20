var express        = require('express');
var app            = express();
app.use(express.static(__dirname+'/public')); 

var bodyParser     = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lawData');
var db = mongoose.connection;

var port = process.env.PORT || 8080;
app.listen(port);

db.on('error', function (err) {
console.log('Server.js alerts of a connection error', err);
});
db.once('open', function () {
console.log('Rads Law Game is connected on port '+ port);
});

var Schema = mongoose.Schema;
var sceneSchema = new Schema({
//  id: {type: Number, unique: true},
  storynumber: Number,
  scenenumber: Number,
//  title: String,
//  question: String,
//  answer1: {
//    response: String,
//    text: String,
//    next: Number
//  },
//  answer2: {
//    response: String,
//    text: String,
//    next: Number
//  },
//  authority: String,
//  video: Boolean,
  resource: String
//  thumbnail: String,
//  time: Number
});

var Scene = mongoose.model('Scene', sceneSchema);
module.exports = Scene;

// routes ==================================================
//require('./app/routes')(app); // pass our application into our routes
    console.log('You have entered the routes export thingamabob')
        
    app.get('/scenes', function(req, res, next) {
        console.log('All scenes requested');
        Scene.find(function(err, scenes){
            if(err) res.send(err);
            res.json(scenes);
        });
    });

    app.post('/scenes', function(req, res, next) {
        console.log('One new scene made');
        console.log(req.body.newScene);
        var newScene = new Scene(req.body.newScene);
        newScene.save(function(err, scene){
            if(err) res.send(err);
            res.json(scene);
        });
    });

    app.get('/scenes/:id', function(req, res, next) {
        console.log('One scene requested');
        var id = req.params.id;
        Scene.findById(id, function (err, scene) {
            if(err) res.send(err);
            res.json(scene);
        });
    });

    app.put('/scenes/:id', function(req, res, next) {
        console.log('One existing scene edited');
        var scene = new Scene(req.body.newScene);
        var id = req.params.id;
        console.log(id);
        console.log('This should be the scene: ' + scene);
        Scene.findByIdAndUpdate(id, scene, function (err, scene) {
            if(err) res.send(err);
            res.json(scene);
        });
    });

    app.delete('/scenes/:id', function(req, res, next) {
        console.log('One scene will be deleted');
        var id = req.params.id;
        Scene.findByIdAndRemove(id, function (err, scene) {
            if(err) res.send(err);
            res.json(scene);
        });
    });

    app.get('/scenes/:story/:scene', function(req, res, next) {
        console.log('Resolving one scene')
        var story = req.params.story;
        var scene = req.params.scene;
        console.log(story, scene)
        Scene.findOne({storynumber:story, scenenumber:scene}, function(err, scene) { //maybe square brackets around
            if (err) res.send(err);
            console.log(scene)
            res.json(scene);
        })
    })


// start app ===============================================

exports = module.exports = app; 						// expose app