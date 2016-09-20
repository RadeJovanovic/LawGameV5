angular.module('loginCtrl', []).controller('loginController', function($scope) {

	$scope.tagline = 'This is the login page';
    
    $scope.login = function(){
        console.log('Yay you logged in!!')
    }
});