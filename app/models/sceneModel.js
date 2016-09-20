var mongoose = require('mongoose');

var sceneSchema = new mongoose.Schema({
   id: {type: Number, unique: true},
  story: Number,
  number: Number,
  title: String,
  question: String,
  answer1: {
    response: String,
    text: String,
    next: Number
  },
  answer2: {
    response: String,
    text: String,
    next: Number
  },
  authority: String,
  video: Boolean,
  resource: String,
  thumbnail: String,
  time: Number
});

module.exports = mongoose.model('Scene', sceneSchema);