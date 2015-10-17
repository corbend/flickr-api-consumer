(function(angular) {"use strict";
    var appName = 'ImageViewer';
    var mainModule = angular.module(appName, ['ngRoute', 'ngFileUpload']);

    mainModule
        .value('clientIDs', {
            YAHOO_CLIENT_ID: 'dj0yJmk9dkVoREN1R3BLTThhJmQ9WVdrOVYyNUpORXRXTnpZbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1mNw--',
            FLICKR_CLIENT_ID: 'dba9190df0addec722c1c8497c4a6db8',
            FLICKR_SECRET_KEY: '5f87902845eef433'
        })
        .config(['$routeProvider', function($routeProvider) {
            console.log("config start");
            $routeProvider
                .when('/login', {
                    controller: 'LoginController as login',
                    templateUrl: '/partials/enter-page.html'
                })
                .when('/albums', {
                    controller: 'PhotoAlbumController as albums',
                    templateUrl: '/partials/albums-list.html'
                })
                .when('/albums/create', {
                    controller: 'PhotoAlbumCreateController as new',
                    templateUrl: '/partials/albums-create.html'
                })
                .when('/albums/:album_id/photos', {
                    controller: 'PhotosListController as photos',
                    templateUrl: '/partials/photos-list.html'
                })
                .when('/albums/:album_id/photos/:photo_id', {
                    controller: 'PhotoFrameController as frame',
                    templateUrl: '/partials/photo-frame.html'
                })
                .otherwise({
                    redirectTo: '/login'
                });
            console.log("config end");
        }]).run(['$rootScope', '$location', '$route', 'AuthService', function($rootScope, $location, $route, AuthService) {

            $rootScope.$on('$routeChangeSuccess', function($event) {
                if ($route.current.originalPath) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }
            });

            $rootScope.$on('logout', function() {
                AuthService.logout().then(function() {
                    $location.path("/login");
                });
            });

            $rootScope.backToHistory = function() {
                if (window.history) {
                    window.history.back();
                }
            };

            console.log("run main");
        }]);

    return mainModule;
})(angular);