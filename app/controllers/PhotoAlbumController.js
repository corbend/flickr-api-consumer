(function(angular) {"use strict";
    var appName = 'ImageViewer';
    var mainModule = angular.module(appName);

    Controller.$inject = ['AuthService', 'PhotoAlbumsService'];

    function Controller(AuthService, PhotoAlbumsService) {

        var vm = this;
        vm.items = [];
        vm.loadComplete = false;

        vm.getServiceName = function() {
            var currentSession = AuthService.getSession();
            return currentSession && currentSession.network;
        };

        vm.getAlbumPhotos = function() {
            vm.loadComplete = false;
            PhotoAlbumsService.query(vm.getServiceName()).then(function (result) {
                vm.items = angular.copy(result.data);
                vm.loadComplete = true;
            });
        };

        vm.getAlbumPhotos();

        vm.selectAlbum = PhotoAlbumsService.setCurrentAlbum;

        vm.createNew = function(formData) {
            PhotoAlbumsService.save(formData).then(function(data) {
                console.log("new album success");
                vm.items.push(angular.copy(data));
                vm.showForm = false;
            });
        }
    }

    mainModule.controller('PhotoAlbumController', Controller);

    return mainModule;
})(angular);