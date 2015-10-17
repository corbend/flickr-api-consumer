(function(angular) {"use strict";
    var appName = 'ImageViewer';
    var mainModule = angular.module(appName);

    Service.$inject = ['$q', '$http', 'AuthService', 'PhotoAlbumsService'];

    function Service($q, $http, AuthService, PhotoAlbumsService) {

        var currentPhoto;

        function getFiltered(network, predicate) {

            var defer = $q.defer();
            hello(network).api('/me/photos', function (p) {
                var filtered = predicate ? p.data.filter(predicate): p.data;
                defer.resolve(filtered);
                console.log("RETRIEVE ALL PHOTOS - me/photos", p);
            });

            return defer.promise;
        }

        function getAlbumPhotos(network, album_id, predicate) {

            var defer = $q.defer();
            hello(network).api('/me/album', {id: album_id}, function (p) {
                var filtered = predicate ? p.data.filter(predicate): p.data;
                defer.resolve(filtered);
                console.log("RETRIEVE PHOTOS - me/album", p);
            });

            return defer.promise;
        }

        return {
            getFiltered: getFiltered,
            query: function(network, album_id, api) {

                var currentAlbum = PhotoAlbumsService.getCurrentAlbum(album_id);

                return currentAlbum.then(function(album) {
                    return api ? getAlbumPhotos(network, album_id): getFiltered(network);
                });
            },
            setCurrentPhoto: function(photo) {
                currentPhoto = photo;
            },
            getCurrentPhoto: function(album_id, photo_id) {
                var defer = $q.defer();
                var notActualPhoto = currentPhoto && photo_id != currentPhoto.id;
                if (!currentPhoto && album_id && photo_id || notActualPhoto) {
                    this.query(AuthService.getSession().network, album_id).then(function(photos) {
                        currentPhoto = photos.filter(function(p) {
                            return p.id == photo_id;
                        })[0];
                        defer.resolve(currentPhoto);
                    });
                } else {
                    defer.resolve(currentPhoto);
                }

                return defer.promise;
            }
        }
    }

    mainModule.service('PhotosService', Service);

    return mainModule;
})(angular);