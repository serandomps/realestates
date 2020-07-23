var dust = require('dust')();

var serand = require('serand');
var auth = require('auth');
var utils = require('utils');
var uready = require('uready');
var page = serand.page;
var redirect = serand.redirect;
var current = serand.current;

var app = serand.app({
    self: 'realestates',
    from: 'serandomps'
});

var layout = serand.layout(app);

var loginUri = utils.resolve('realestates:///auth');

var can = function (permission) {
    return function (ctx, next) {
        next();
    };
};

page('/signin', auth.signin({
    loginUri: loginUri
}));

page('/signup', function (ctx, next) {
    var query = ctx.query | {};
    utils.emit('user', 'login', query.dest || '/');
});

page('/auth', function (ctx, next) {
    var el = $('#content');
    var o = {
        tid: sera.tid,
        username: sera.username,
        access: sera.access,
        expires: sera.expires,
        refresh: sera.refresh
    };
    if (o.username) {
        return utils.emit('user', 'initialize', o);
    }
    utils.emit('user', 'logged out');
});

page('/', function (ctx, next) {
    layout('two-column-right')
        .area('#header')
        .add('realestates-client:navigation')
        //.add('breadcrumb')
        .area('#right')
        .add('model-realestates:recent')
        .area('#middle')
        .add('realestates-client:home')
        .add('model-realestates:featured')
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/realestates', function (ctx, next) {
    var o = utils.fromQuery(ctx.query);
    o.count = o.count || 15;
    layout('two-column-left')
        .area('#header')
        .add('realestates-client:navigation')
        //.add('breadcrumb')
        .area('#left')
        .add('model-realestates:filter', {query: o.query})
        .area('#middle')
        .add('model-realestates:search', {
            loadable: true,
            query: o
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/create-realestates', function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('realestates-client:navigation')
        .area('#middle')
        .add('model-realestates:create')
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/realestates/:id', function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('realestates-client:navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('model-realestates:findone', {
            id: ctx.params.id
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/:model/:about/report', function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('realestates-client:navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('model-messages:create', {
            model: ctx.params.model,
            about: ctx.params.about
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/realestates/:id/edit', function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('realestates-client:navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('model-realestates:create', {
            id: ctx.params.id
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/realestates/:id/delete', function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('realestates-client:navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('model-realestates:remove', {
            id: ctx.params.id
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/mine', can('user'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('realestates-client:navigation')
        .area('#middle')
        .add('model-realestates:mine')
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

utils.on('user', 'login', function (location) {
    if (!location) {
        location = serand.path();
    }
    serand.persist('state', {
        location: location
    });

    auth.authenticator({
        type: 'serandives',
        location: loginUri
    }, function (err, uri) {
        if (err) {
            return console.error(err);
        }
        redirect(uri);
    });
});

utils.on('user', 'logged in', function (token) {
    var state = serand.persist('state', null);
    redirect(state && state.location || '/');
});

utils.on('user', 'logged out', function (usr) {
    var state = serand.persist('state', null);
    redirect(state && state.location || '/');
});

utils.emit('serand', 'ready');
