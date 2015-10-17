(function(angular) {"use strict";
    var appName = 'ImageViewer';
    var mainModule = angular.module(appName);

    Controller.$inject = ['$scope', 'AuthService', 'Upload'];

    function Controller($scope, AuthService, Upload) {

        var vm = this;

        vm.addNew = function() {

            if ($scope.form.file.$valid && $scope.file) {

                var oauthData = AuthService.getAuthData();
                var uploadData = angular.copy(oauthData);

                uploadData.file = $scope.file;

                Upload.upload({
                    url: 'upload_photo?oauth_secret=' + oauthData.oauth_token_secret,
                    data: uploadData
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data);
                    $scope.$emit('upload:complete', resp);
                    $scope.file = null;
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }
    }

    mainModule.controller('PhotoUploadController', Controller);

    return mainModule;
})(angular);