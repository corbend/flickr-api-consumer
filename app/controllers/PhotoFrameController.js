(function(angular) {"use strict";
    var appName = 'ImageViewer';
    var mainModule = angular.module(appName);

    Controller.$inject = ['$scope', '$routeParams', 'PhotosService'];

    function Controller($scope, $routeParams, PhotosService) {

        var vm = this;
        vm.loadComplete = false;

        PhotosService.getCurrentPhoto($routeParams.album_id, $routeParams.photo_id)
            .then(function(photo) {
                console.log("current photo", photo);
                vm.photo = photo;
                vm.loadComplete = true;
            });

        var wrapper = angular.element('.wrapper');
        var wrapperFixWidth = wrapper.width();
        wrapper.css({
            width: "auto"
        });

        $scope.$on('$destroy', function() {
            wrapper.width(wrapperFixWidth);
        });
    }

    mainModule.controller('PhotoFrameController', Controller);

    return mainModule;
})(angular);