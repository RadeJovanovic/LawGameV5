// the function of this directive is to return either one or all of the scenes
angular.module('sceneService', [])
    .factory('sceneService', ['$http', 'utility', function($http) {
        var path = '../app/models/scenes.json';
        var scenes = $http.get(path).then(function (resp) {
            return resp.data.scenes;
          });

        var factory = {};
        factory.all = function () {
            return scenes;
        };
        factory.one = function (id) {
            return scenes.then(function(){
                return utility.findById(scenes, id);
            })
          };
          return factory;


}]);

// will require a uitility to find what the next scene is, based on the current scene - hash/whatever ASK JON??