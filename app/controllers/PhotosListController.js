(function(angular) {"use strict";
    var appName = 'ImageViewer';
    var mainModule = angular.module(appName);

    Controller.$inject = ['$scope', 'Upload', '$routeParams', 'AuthService', 'PhotosService', 'PhotoAlbumsService'];

    function Controller($scope, Upload, $routeParams, AuthService, PhotosService, PhotoAlbumsService) {

        var vm = this;
        vm.loadComplete = false;
        vm.photos = [];
        vm.checkRequestAll = false;

        PhotoAlbumsService.getCurrentAlbum($routeParams.album_id).then(function(album) {
            vm.album = album;
        });

        vm.getPhotosForAlbum = function(albumId) {
            if (albumId) {
                vm.loadComplete = false;
                PhotosService.query(AuthService.getSession().network, albumId, true)
                    .then(function (result) {
                        vm.items = angular.copy(result);
                        vm.loadComplete = true;
                    });
            }
        };

        vm.getPhotosForAlbum($routeParams.album_id);

        $scope.$on('upload:complete', function($event, photo) {
            //нужно присоединить фотографию к альбому
            PhotoAlbumsService.appendToAlbum($routeParams.album_id, photo.data.id).then(function() {
                console.log("photo append to album");
                vm.getPhotosForAlbum($routeParams.album_id);
            });
        });

    }

    mainModule.controller('PhotosListController', Controller);

    return mainModule;
})(angular);