
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var flickrApi = require('./flickr-api');
var utils = require("util");

module.exports = function(app) {

    app.get('/', function(req, res) {
        return req.sendFile(path.join(__dirname, '../app/index.html'));
    });

    app.post('/upload_photo', function(req, res, next) {

        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
            console.log(files);
            if (!err) {
                files.file.forEach(function(file, index) {

                    (new flickrApi(req.query["oauth_secret"])).uploadPhoto({
                        title: 'Title',
                        description: "-",
                        file: file,
                        success: function(response) {
                            console.log("UPLOAD COMPLETE");
                            var new_photo_id = response.photoid[0];
                            return res.json({id: new_photo_id});
                        },
                        error: function(err) {
                            console.error("upload error", err);
                            next(err);
                        }
                    });
                })
            } else {
                next(err);
            }
        });
    });

    app.post('/albums/append', function(req, res, next) {

        var data = req.body;

        var options = data;

        options.success = function(response) {
            res.send(response)
        };

        options.error = function(err) {
            next(err);
        };

        console.log("APPEND PHOTO", req.query, options);
        (new flickrApi(req.query["oauth_secret"])).appendToAlbum(options);
    });

    app.post('/albums', function(req, res, next) {

        var albumData = req.body;

        var options = albumData;

        options.success = function(response) {
            res.send(response)
        };

        options.error = function(err) {
            next(err);
        };

        console.log("CREATE ALBUM", req.query, options);
        (new flickrApi(req.query["oauth_secret"])).createAlbum(options);

    });

};