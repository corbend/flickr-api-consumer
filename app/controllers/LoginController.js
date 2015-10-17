(function(angular) {"use strict";
    var appName = 'ImageViewer';
    var mainModule = angular.module(appName);

    Controller.$inject = ['$location', '$timeout', '$scope', 'AuthService'];

    function Controller($location, $timeout, $scope, AuthService) {

        var vm = this;

        vm.services = [
            {name: 'flickr', icon_url: 'styles/images/flickr.png', admin_page_url: '/#albums'},
            {name: 'yahoo', icon_url: 'styles/images/yahoo.png', admin_page_url: '/#'}
        ];

        vm.getCurrentService = function() {
            var serviceActive = AuthService.getSession().network;
            var activeService = vm.services.filter(function(service) {
                return service.name == serviceActive;
            })[0];

            return activeService;
        };
        vm.username = "Гость";
        postAuthorization();

        function postAuthorization() {
            if (AuthService.isAuthenticated()) {

                var activeService;
                if (activeService = vm.getCurrentService()) {
                    activeService.authComplete = true;
                    var authData = AuthService.getSession();
                    vm.username = authData.data.fullname;

                }
            }
        }

        vm.authWithService = function(service) {
            AuthService.login(service.name).then(function() {
                console.log("service auth complete to - ", service.name);
                $timeout(function() {
                    postAuthorization();
                    $location.path(service.admin_page_url);
                });
            });
        };

        vm.logoutMe = function(service) {
            var currentService;
            if (currentService = vm.getCurrentService()) {
                AuthService.logout(currentService.name).then(function() {
                    console.log("service logout complete from - ", currentService.name);
                    $timeout(function() {
                        currentService.authComplete = false;
                        $location.path('/#login');
                        postAuthorization();
                    });
                });
            }
        }
    }

    mainModule.controller('LoginController', Controller);

    return Controller;
})(angular);