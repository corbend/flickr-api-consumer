(function(angular) {"use strict";
    var appName = 'ImageViewer';
    var mainModule = angular.module(appName);

    Service.$inject = ['$log', 'clientIDs'];

    var SESSION_KEY = 'image_viewer.session';

    function Service($log, clientIDs) {

        var currentSession, rawSession;
        rawSession = window.localStorage.getItem(SESSION_KEY);

        if (rawSession) {
            currentSession = JSON.parse(rawSession);
            currentSession.expired = new Date(currentSession.expired);

            if (!(currentSession && currentSession.network) && currentSession.data) {
                currentSession.network = currentSession.data.network;
            }
        }

        if (!currentSession) {
            currentSession = {};

            window.localStorage.setItem(SESSION_KEY, JSON.stringify({}));
        }

        hello.init({
            yahoo: clientIDs.YAHOO_CLIENT_ID,
            flickr: {
                id: clientIDs.FLICKR_CLIENT_ID,
                oauth: {
                    version: '1.0a',
                    auth: 'https://www.flickr.com/services/oauth/authorize?perms=write',
                    request: 'https://www.flickr.com/services/oauth/request_token',
                    token: 'https://www.flickr.com/services/oauth/access_token'
                }
            }
        }, {
            scope: 'friends,photos,publish,publish_files'
        });

        hello.on('auth.login', function(r) {
            console.log("logged in");
        });

        function isSessionActive() {
            if (currentSession.expired) {
                var curTime = new Date().valueOf();
                return (curTime - currentSession.expired.valueOf()) / (60 * 60 * 1000) < 1;
            }

            return false;
        }

        var ServiceConstr = {
            getAuthData: function() {

                var authResponse = hello('flickr').getAuthResponse();
                var authorizationToken = authResponse.access_token;
                var oauthToken = authorizationToken.split(":")[0];

                var oauthData = {
                    oauth_consumer_key : authResponse.client_id,
                    oauth_consumer_secret: clientIDs.FLICKR_SECRET_KEY,
                    oauth_token : oauthToken,
                    oauth_token_secret : authorizationToken.split(":")[1].split("@")[0],
                    oauth_timestamp : Math.floor(new Date().valueOf()/1000),
                    oauth_signature_method : 'HMAC-SHA1',
                    oauth_version : '1.0'
                };

                return oauthData;
            },
            getSession: function() {
                return currentSession || {};
            },
            isAuthenticated: function() {

                return currentSession && currentSession.data && isSessionActive();
            },
            logout: function() {
                return hello.logout(currentSession.network, function() {
                    console.log("success logout");
                    currentSession = {};
                    window.localStorage.setItem(SESSION_KEY, "{}");
                });
            },
            login: function(serviceName) {

                var loginPromise = hello.login(serviceName, {
                    scope: 'friends,photos,publish,publish_files'
                });

                loginPromise.then(function(result) {
                    $log.debug("login to", serviceName, result.authResponse);
                    console.log("user logged in");
                    currentSession.network = result.network;
                    currentSession.data = result.authResponse;
                    currentSession.expired = new Date();
                    window.localStorage.setItem(SESSION_KEY, JSON.stringify(currentSession));
                    //retreiveApi(result.network);
                }, function(e) {
                    $log.error("login error", e);
                });

                return loginPromise;
            }
        };

        return ServiceConstr;
    }

    mainModule.service('AuthService', Service);

    return mainModule;
})(angular);