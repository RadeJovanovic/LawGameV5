angular.module('lawGame', ['ui.router', 'youtube-embed'])

.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    }
  ]
)

.config(
  [          '$stateProvider', '$urlRouterProvider', '$locationProvider',
    function ($stateProvider,   $urlRouterProvider, $locationProvider) {
//        $locationProvider.html5Mode(true);
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
                                
                        return sceneService.resolveOne(story, scene)
                            .success(function(data){
                                console.log('This is the data coming from the game resolve:')
                                console.log(data)
                                return data;
                            })
                            .error(function(data){
                                console.log('Error: '+ data)
                                return null;
                            })
                    }]
                }
            })
        
            .state('death', {
                url:'/death',
                templateUrl:'views/death.html',
                controller:''
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

.service('loginService', ['$http', '$state', function($http, $state) {
   console.log('I have entered the service')
   this.goToSelector = function(){
          $state.go('selector')
   }
}])

.service('sceneService', ['$http', function($http) {
    console.log('By injecting, I have entered')
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
    
//////////////////CONTROLLERS//////////////////////

.controller('loginController', ['loginService', '$scope', '$state', 
                        function(loginService,   $scope,   $state) {

	$scope.tagline = 'This is the login page';
    $scope.login = function(){
        console.log('Yay you logged in!!')
        loginService.goToSelector()
    };
}])
//
.controller('selectorController', ['$scope', 'sceneService', '$state',
                        function(   $scope,   sceneService,   $state) {
    console.log('selectorController running')
    
    getAllScenes();
     
    $scope.play = function(s){
        var story = s.storynumber;
        $state.go('game', {storynumber: story, scenenumber: 1});
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
}])

.controller('gameController', ['$scope', 'sceneinfo', '$stateParams', '$sce',
                    function(   $scope,   sceneinfo,   $stateParams,   $sce) {

//  View setup
    var sceneInfo = sceneinfo.data;
    $scope.videoID = sceneInfo.resource; // videoID gets passed to the directive
                        
//  Video playback
    $scope.playerVars = {
    controls: 0,
    autoplay: 1
    };
    $scope.$on('youtube.player.ended', function ($event, player) {
    // play it again
    $state.go('game', {storynumber: 1, scenenumber: 2})
    });                    
    
//  Gameplay
    $scope.isQuestion = true;
    }])

.controller('editorController', ['$scope', 'sceneService',
                        function( $scope,   sceneService) {
    
    console.log("We have entered the editor controller")
    $scope.newScene = {};
    $scope.editing = false;
    console.log('Editing = ' + $scope.editing)
      
    getAllScenes(); //Do this on page landing
                            
    $scope.saveScene = function(){
        //Rules: each story must have a number 1 scene
        
        //check if scene is ok to save
        //check if the story has a new 
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

.directive('storyInfo', function() {
    return {
        restrict: 'E',
        scope: {
            sceneInfo: '=info'
        },
//        templateUrl: 'js/directives/story-info.hmtl'
        template: '<p> This is storyInfo</p><img class="icon" ng-src="{{sceneInfo.thumbnail}}"><h2 class="title">Story:{{sceneInfo.storynumber}}</h2>'
    };
});