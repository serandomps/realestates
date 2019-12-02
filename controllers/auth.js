var serand = require('serand');
var utils = require('utils');
var auth = require('auth');
var redirect = serand.redirect;

var base = utils.resolve('accounts://');
var loginUri = utils.resolve('realestates:///auth');

module.exports.signin = function (ctx, next) {
    var location = ctx.query.redirect_uri

    serand.store('state', {
        location: location
    });

    auth.authenticator({
        type: 'serandives',
        location: loginUri
    }, function (err, uri) {
        if (err) {
            return next(err);
        }
        redirect(uri);
    });
};

module.exports.force = function (ctx, next) {
    if (ctx.token) {
        return next();
    }
    var location = ctx.path;
    var self = utils.resolve('accounts://');
    if (location.indexOf(self) === 0) {
        location = location.substring(self.length);
    }
    serand.store('state', {
        location: location
    });
    redirect('/signin');
};
