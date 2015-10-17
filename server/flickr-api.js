var flickr = require('flickr-with-uploads');
var fs = require('fs');

module.exports = function(oauthSecret) {

    var OAUTH_CONSUMER_KEY = "dba9190df0addec722c1c8497c4a6db8";
    var OAUTH_SECRET_KEY = "5f87902845eef433";
    var OAUTH_TOKEN = "72157659858713742-3bc806d41485e77e";

    function api(options, callback) {
        return flickr(
            OAUTH_CONSUMER_KEY,
            OAUTH_SECRET_KEY,
            OAUTH_TOKEN,
            oauthSecret
        )(options, callback);
    }

    this.oauthSecret = oauthSecret;

    this.uploadPhoto = function(options) {

        console.log("PREPARE TO UPLOAD", options);
        api({
            method: 'upload',
            title: options.title,
            description: options.description,
            is_public: 0,
            is_friend: 1,
            is_family: 1,
            hidden: 2,
            photo: fs.createReadStream(options.file.path)
        }, function(err, response) {
            console.log("response", response);
            if (err) {
                console.error('Could not upload photo:', err);
                options.error(err);
            }
            else {
                console.log("success");
                return options.success(response);
            }
        });
    };

    this.createAlbum = function(options) {

        console.log("PREPARE TO CREATE ALBUM", options);
        api({
            method: 'flickr.photosets.create',
            title: options.title,
            description: options.description,
            primary_photo_id: parseInt(options.primary_photo_id)
        }, function(err, response) {
            console.log("response", response);
            if (err) {
                console.error('Could not create album:', err);
                options.error(err);
            }
            else {
                console.log("create album success", response.photoset);
                options.success(response.photoset);
            }
        });
    };

    this.appendToAlbum = function(options) {

        console.log("PREPARE TO APPEND PHOTO", options);
        api({
            method: 'flickr.photosets.addPhoto',
            photo_id: options.photo_id,
            photoset_id: options.photoset_id
        }, function(err, response) {
            console.log("response", response);
            if (err) {
                console.error('Could not append photo:', err);
                options.error(err);
            }
            else {
                console.log("append photo success", response);
                options.success(response);
            }
        });
    }
};