app.directive('storyInfo', function() {
    return {
        restrict: 'E',
        scope: {
            info: '='
        },
        templateUrl: './js/directives/storyInfo.hmtl'
    };
});