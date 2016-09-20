angular.module('lawGame', ['ui.router'])

.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    }
  ]
)

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise('/login');
        
        $stateProvider
        
            .state('login', {
                url:'/login',
                templateUrl: 'views/login.html',
                controller: 'loginController'
            })
        
            .state('selector', {
                url:'/selector',
                templateUrl: 'views/selector.html',
                controller: 'selectorController'
            
            })
                        
             .state('game', {
                url:'/game/:storynumber/:scenenumber',
                templateUrl: 'views/game.html',
                controller: 'gameController',
                resolve: {
                    sceneinfo: ['$stateParams', 'sceneService', function($stateParams, sceneService){
                        var story = $stateParams.storynumber;
                        var scene = $stateParams.scenenumber;
                        console.log(story,scene)
//                        return sceneService.resolveOne(story, scene)
                                
                        return sceneService.resolveOne(story, scene)
                            .success(function(data){
                                sceneData = data;
                                console.log('This is the data coming from the game resolve')
                                console.log(sceneData) //this logs properly to the console
                                return sceneData;
                            })
                            .error(function(data){
                                console.log('Error: '+ data)
                                return null;
                            })
//                        
//                        123;
                    }]
                }
            })
        
            .state('editor', {
                url:'/editor',
                templateUrl: 'views/editor.html',
                controller: 'editorController'
            })
        
            .state('stats', {
                url:'/stats',
                templateUrl: 'views/statistics.html',
                controller: 'statsController'
            });
    }])

/////////////////SERVICES///////////////////////////

.factory('loginService', ['$http', function($http) {
    //login service code to go here
}])

.service('sceneService', ['$http', function($http) {
    
    var baseUrl = 'http://localhost:8080'
    
    this.saveNew = function(newScene) {
        var url = baseUrl+'/scenes'
        return $http.post(url, {"newScene": newScene});
    }
    
    this.getAll = function() {
        var url = baseUrl+'/scenes';
        return $http.get(url);
    }
    
    this.updateOne = function(newScene) {
        console.log('The update function is running')
        var url = baseUrl+'/scenes/'+ newScene._id;
        return $http.put(url, {"newScene": newScene});
    }
    
    this.deleteOne = function(id){
        var url = baseUrl+'/scenes/'+id;
        return $http.delete(url);
    }
    
    this.findOne = function(id){
        var url = baseUrl+'/scenes/'+id;
        return $http.get(url);
    }
    
    this.resolveOne = function(story, scene){
        var url = baseUrl+'/scenes/'+story+'/'+scene;
        return $http.get(url);
    }
}])


//This bit does not work properly
.factory('allSceneService', ['$http', 'utilityService', function($http) {
        console.log('The scene http service is working');
        var path = 'https://api.myjson.com/bins/1jzpr';
        var scenes = $http.get(path)
            .then(function (resp) {
              console.log(scenes); //this returns a promise, cf. in the selectorController
              return resp.data;
            });
               
        var factory = {};
        factory.all = function () {
            return scenes;
        };
    return factory;
}])
    
//////////////////CONTROLLERS//////////////////////

.controller('loginController', function($scope) {

	$scope.tagline = 'This is the login page';
    $scope.login = function(){
        console.log('Yay you logged in!!')
    };
})
//
.controller('selectorController', ['$scope', 'resolvedScenes',
                        function(   $scope,   resolvedScenes) {
    console.log('selectorController running')
	$scope.tagline = 'This is the selector page and this sentence is coming from the controller';	
    $scope.resolvedScenes = resolvedScenes;
    console.log("The selector controller is returning:" + resolvedScenes);
}])

.controller('gameController', ['$scope', 'sceneinfo', '$stateParams',
                    function(   $scope,   sceneinfo,   $stateParams) {
// USE DEPENDENCY INJECTION TO INJECT THE SCENEINFO
    $scope.isQuestion = true;
    var returnedSceneInfo = sceneinfo;
    console.log(returnedSceneInfo)
//    $scope.sceneinfo = sceneinfo;
//    console.log(sceneinfo)
    
//    function resolveScene(story, scene){
//        sceneService.resolveOne(story, scene)
//            .success(function(data){
//                $scope.sceneData = data;
//                console.log('This is the scene data coming from the controller')
//                console.log(sceneData) //this logs properly to the console
//            })
//            .error(function(data){
//                console.log('Error: '+ data)
//            })
//    }
    }])

.controller('editorController', ['$scope', 'sceneService',
                        function( $scope,   sceneService) {
    
    console.log("We have entered the editor controller")
    $scope.newScene = {};
    $scope.editing = false;
    console.log('Editing = ' + $scope.editing)
      
    getAllScenes(); //Do this on page landing
                            
    $scope.saveScene = function(){
        saveScene();
        getAllScenes();
        //when saving scene, need to check whether linking scene has been made, and if not, create an empty linking scene. 
    };
    
    $scope.deleteScene = function(id){
        deleteScene(id);
        getAllScenes();
    };
               
    $scope.editScene = function(id){
        editScene(id);
        $scope.editing = true
        console.log('Editing = ' + $scope.editing)
    };
                            
    $scope.updateScene = function(){
        updateScene($scope.newScene)
        $scope.editing = false
        console.log('Editing = ' + $scope.editing)
        getAllScenes();
    }
    
    function getAllScenes() {
        sceneService.getAll()
            .success(function(data){
                $scope.scenes = data;
                console.log($scope.scenes);
            })
            .error(function(data){
                console.log('Error: '+ data);
            });
    }
                            
    function saveScene() {
        sceneService.saveNew($scope.newScene)
            .success(function(data){
                console.log(data);
                $scope.newScene = {}
                $scope.editing = false;
                console.log('Editing = ' + $scope.editing)
            })
            .error(function(data){
                console.log('Error: ' + data);
            })
    }
    
    function deleteScene(id) {
        sceneService.deleteOne(id)
            .success(function(data){
                $scope.scenes = data; //this is the new set of scenes returned after the delete
            })
            .error(function(data){
                console.log('Error: '+ data)
            });
    }
                            
    function editScene(id){
        sceneService.findOne(id)
            .success(function(data){
                $scope.newScene = data
                
            })
            .error(function(data){
                console.log('Error: '+ data)
            })
    }
                            
    function updateScene(newScene) {
        console.log('From updateScene function: I am trying to update a scene')
        console.log(newScene)
        sceneService.updateOne(newScene)
            .success(function(data){
                $scope.scenes = data;                
            })
            .error(function(data){
            console.log('Error ' + data)
        }) 
    }
                            
}])

.controller('statsController', function($scope) {

	$scope.tagline = 'This is the statistics page';

})

/////////////////DIRECTIVES//////////////////////

.directive('playStory', function() {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'directives/playStory.html',
    link: function(scope, element, attrs) {
      scope.buttonText = "Play"
    },
  };
})

.directive('storyInfo', function() {
    return {
        restrict: 'E',
        scope: {
            sceneInfo: '=info'
        },
//        templateUrl: 'js/directives/story-info.hmtl'
        template: '<p> This is storyInfo</p><img class="icon" ng-src="{{sceneInfo.thumbnail}}"><h2 class="title">Title:{{sceneInfo.title}}</h2>'
    };
});