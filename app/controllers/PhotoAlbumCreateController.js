(function(angular) {"use strict";
    var appName = 'ImageViewer';
    var mainModule = angular.module(appName);

    Controller.$inject = ['$scope', '$location', 'AuthService', 'PhotosService', 'PhotoAlbumsService'];

    function Controller($scope, $location, AuthService, PhotosService, PhotoAlbumsService) {

        var vm = this;
        vm.album = {};
        vm.primaryPhotos = [];
        vm.loadComplete = false;

        vm.getAllPhotos = function() {

            var promise = PhotosService.getFiltered(AuthService.getSession().network);

            promise.then(function (result) {
                console.log("get all photos");
                vm.primaryPhotos = result;
                vm.loadComplete = true;
            });

            return promise;
        };

        vm.getAllPhotos();

        vm.createNew = function(formData) {
            //для добавления альбома нужно обязательно выбрать главную фотку
            var selectedPrimaryPhoto = vm.getSelectedPrimaryPhoto();
            if (!selectedPrimaryPhoto) {
                console.warn("primary_photo_id is required.");
                return false;
            }

            formData.primary_photo_id = selectedPrimaryPhoto.id;

            PhotoAlbumsService.save(formData).then(function(data) {
                console.log("new album success");
                $location.path("/albums");
            });
        };

        vm.getSelectedPrimaryPhoto = function() {
            return vm.primaryPhotos.filter(function(p) {return p.checked;})[0]
        };

        $scope.watchToSelect = true;

        //select only one photo
        vm.selectedPrimaryPhoto = null;

        $scope.$watch(function() {
            return $scope.watchToSelect ? vm.primaryPhotos: null;
        }, function(newItems, oldItems) {

            $scope.watchToSelect = false;

            var selectedItem = null;
            newItems.forEach(function(item) {
                if (item.checked && item !== vm.selectedPrimaryPhoto) {
                    selectedItem = item;
                } else {
                    item.checked = false;
                }
            });

            if (selectedItem) {
                vm.selectedPrimaryPhoto = selectedItem;
            } else {
                if (vm.selectedPrimaryPhoto) {
                    vm.selectedPrimaryPhoto.checked = true;
                } else {
                    vm.selectedPrimaryPhoto = null;
                }
            }

            $scope.watchToSelect = true;

        }, true);
    }

    mainModule.controller('PhotoAlbumCreateController', Controller);

    return mainModule;
})(angular);