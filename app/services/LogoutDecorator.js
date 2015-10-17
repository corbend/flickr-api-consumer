(function(angular) {

    angular.module('ImageViewer').config(['$provide', function($provide) {

        function pseudoResourceDecorator($delegate, $q, AuthService) {

            var origCall = $delegate.query;

            $delegate.query = function() {
                if (AuthService.isAuthenticated()) {
                    return origCall.apply(null, arguments);
                } else {
                    console.error("not authorized -> logout");
                    window.location.href = "#/login";
                    var defer = $q.defer();
                    defer.reject("not authorized access");
                    return defer.promise;
                }
            };

            return $delegate;
        }

        $provide.decorator('PhotoAlbumsService', pseudoResourceDecorator);
        $provide.decorator('PhotosService', pseudoResourceDecorator);
    }]);

})(angular);