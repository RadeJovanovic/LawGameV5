angular.module('selectorCtrl', []).controller('selectorController', ['$scope', '$state', 'sceneService', 'utility', function($scope) {
    
    $scope.scenes = scenes;

	$scope.tagline = 'This is the selector page';	

}]);