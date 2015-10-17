(function(angular) {"use strict";
    var appName = 'ImageViewer';
    var mainModule = angular.module(appName);

    Service.$inject = ['$q', '$http', 'AuthService'];

    function Service($q, $http, AuthService) {

        var currentAlbum = "";

        return {
            query: function(network, id) {
                var defer = $q.defer();
                hello(network).api('/me/albums', function(p){
                    defer.resolve(p);
                    console.log("RETRIEVE ALBUMS", p);
                });

                return defer.promise;
            },
            setCurrentAlbum: function(item) {
                currentAlbum = item;
            },
            getCurrentAlbum: function(id) {
                var defer = $q.defer();
                if (!currentAlbum && id) {
                    this.query(AuthService.getSession().network, id).then(function(albums) {
                        currentAlbum = albums.data.filter(function(album) {
                            return album.id == id;
                        })[0];
                        defer.resolve(currentAlbum);
                    });
                } else {
                    defer.resolve(currentAlbum);
                }

                return defer.promise;
            },
            save: function(newAlbum) {
                var sessionData = AuthService.getAuthData();
                return $http.post('/albums?oauth_secret='+sessionData.oauth_token_secret,
                    angular.copy(newAlbum));
            },
            appendToAlbum: function(album_id, photo_id) {
                var sessionData = AuthService.getAuthData();
                return $http.post('/albums/append?oauth_secret='+sessionData.oauth_token_secret, {
                    photoset_id: album_id,
                    photo_id: photo_id
                });
            }
        }
    }

    mainModule.service('PhotoAlbumsService', Service);

    return mainModule;
})(angular);