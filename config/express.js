'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    config = require('./config');

module.exports = function(app, passport, db) {
    app.set('showStackError', true);

    //Prettify HTML
    app.locals.pretty = true;

    //Should be placed before express.static
    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    //Don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
        app.use(express.logger('dev'));
    }

    //Set views path, template engine and default layout
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    //Enable jsonp
    app.enable("jsonp callback");

    app.configure(function() {
        function removeWWW(req, res, next){
            if (req.headers.host.match(/^www/) !== null ) {
                res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
            } else {
                next();     
            } 
        }
        app.use(removeWWW);
        app.use(function (req, res, next) {
            if ('/robots.txt' == req.url) {
                res.type('text/plain')
                res.send("User-agent: *\nDisallow: /admin1234567890/");
            } else {
                next();
            }
        });
        //cookieParser should be above session
        app.use(express.cookieParser('b312n4nd4'));
        app.use(express.bodyParser());
        // request body parsing middleware should be above methodOverride
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(express.methodOverride());
        
        //express/mongo session storage
        app.use(express.session({
            secret: 'b312n4nd4',
            cookie: {maxAge: 3600000*24*14},
            store: new mongoStore({
                db: db.connection.db,
                collection: 'sessions'
            })
        }));
        app.use(function(req, res, next) {
            req.session._garbage = Date();
            req.session.touch();
            next();
        });
        //connect flash for flash messages
        app.use(flash());

        //dynamic helpers
        app.use(helpers(config.app.name));

        //use passport session
        app.use(passport.initialize());
        app.use(passport.session());

        //routes should be at the last
        app.use(app.router);
        
        //Setting the fav icon and static folder
        app.use(express.favicon());
        app.use(express.static(config.root + '/public', { maxAge: 86400000 }));

        //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
        app.use(function(err, req, res, next) {
            //Treat as 404
            if (~err.message.indexOf('not found')) return next();

            //Log it
            console.error(err.stack);

            //Error page
            res.status(500).render('500', {
                error: err.stack
            });
        });

        //Assume 404 since no middleware responded
        app.use(function(req, res, next) {
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });

    });
};