'use strict';

module.exports = function(app, passport, auth) {
    var index = require('../app/controllers/index');
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin',index.index, users.signin);
    app.get('/signup',index.index, users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me',index.index, users.me);

    //Setting up the users api
    app.post('/users', users.create);

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    //Setting the facebook oauth routes
    app.get('/auth/facebook',passport.authenticate('facebook', {
        scope: ['email', 'user_about_me','publish_stream'],
        failureRedirect: '/signin'
    }), users.signin);
    app.post('/auth/facebook', users.url,passport.authenticate('facebook', {
        scope: ['email', 'user_about_me','publish_stream'],
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);
    
    //Article Routes
    var articles = require('../app/controllers/articles');
    var categories = require('../app/controllers/categories');
    app.get('/articles', articles.all);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:articleId', articles.show);
    app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

    //Finish with setting up the articleId param
    app.param('articleId', articles.article);

    
    //ADMIN
    var admins = require('../app/controllers/admins/index');
    
    var images = require('../app/controllers/images');
     var tags = require('../app/controllers/tags');
     var infos = require('../app/controllers/infos');
    app.get('/admin1234567890/', auth.requiresLogin,auth.admins.hasAuthorization,admins.render);
    app.get('/admin1234567890/categoriesadmin', auth.requiresLogin,auth.admins.hasAuthorization,categories.all);
    app.post('/admin1234567890/subcategoriesadmin', auth.requiresLogin,auth.admins.hasAuthorization,categories.subcat);
    app.get('/admin1234567890/categoryonly', auth.requiresLogin,auth.admins.hasAuthorization,categories.categoryonly);
    app.post('/admin1234567890/categoriesadmin', auth.requiresLogin,auth.admins.hasAuthorization, categories.create);
    app.post('/admin1234567890/subcreate', auth.requiresLogin,auth.admins.hasAuthorization, categories.subcreate);
    app.get('/admin1234567890/categoriesadmin/:categoryId', auth.requiresLogin,auth.admins.hasAuthorization, categories.show);
    app.put('/admin1234567890/categoriesadmin/:categoryId', auth.requiresLogin,auth.admins.hasAuthorization, categories.update);
    app.delete('/admin1234567890/categoriesadmin/:categoryId', auth.requiresLogin,auth.admins.hasAuthorization, categories.destroy);
    app.get('/admin1234567890/articlesadmin', auth.requiresLogin,auth.admins.hasAuthorization,articles.all);
    app.post('/admin1234567890/articlesadmin', auth.requiresLogin,auth.admins.hasAuthorization, articles.create);
    app.get('/admin1234567890/tagsadmin', auth.requiresLogin,auth.admins.hasAuthorization, tags.all);
    app.post('/admin1234567890/tagsadmin', auth.requiresLogin,auth.admins.hasAuthorization, tags.create);
    app.get('/admin1234567890/tagsadmin/:tagId', auth.requiresLogin,auth.admins.hasAuthorization, tags.show);
    app.put('/admin1234567890/tagsadmin/:tagId', auth.requiresLogin,auth.admins.hasAuthorization, tags.update);
    app.delete('/admin1234567890/tagsadmin/:tagId', auth.requiresLogin,auth.admins.hasAuthorization, tags.destroy);
    app.get('/admin1234567890/articlesadmin/:articleId', auth.requiresLogin,auth.admins.hasAuthorization, articles.show);
    app.put('/admin1234567890/articlesadmin/:articleId', auth.requiresLogin,auth.admins.hasAuthorization, articles.update);
    app.delete('/admin1234567890/articlesadmin/:articleId', auth.requiresLogin,auth.admins.hasAuthorization, articles.destroy);
    app.get('/admin1234567890/infosadmin', auth.requiresLogin,auth.admins.hasAuthorization, infos.all);
    app.post('/admin1234567890/infosadmin', auth.requiresLogin,auth.admins.hasAuthorization, infos.create);
    app.get('/admin1234567890/infosadmin/:infoId', auth.requiresLogin,auth.admins.hasAuthorization, infos.show);
    app.put('/admin1234567890/infosadmin/:infoId', auth.requiresLogin,auth.admins.hasAuthorization, infos.update);
    app.delete('/admin1234567890/infosadmin/:infoId', auth.requiresLogin,auth.admins.hasAuthorization, infos.destroy);
    app.post('/galleriesadmin/upload', auth.requiresLogin,auth.admins.hasAuthorization,images.upload);
    app.post('/articlesslide', auth.requiresLogin, auth.admins.hasAuthorization,articles.slide);
    app.post('/articlespublish', auth.requiresLogin, auth.admins.hasAuthorization,articles.publish);
    app.param('categoryId', categories.category);
    app.param('tagId', tags.tag);
    app.param('infoId', infos.info);
    
    //Home route
    app.get('/',index.index, index.home);
    app.get('/sitemap.xml', function (req, res) {
      res.render('sitemap');
    });
    app.get('/category/:categoryUrl',index.index, index.index2,index.categorylist);
    app.get('/tag/:tagUrl',index.index, index.index2,index.taglist);
    app.get('/info/:infoUrl',index.index, index.index2,index.infodetail);
    app.post('/postcomment/:articleUrl', auth.requiresLogin, index.postcomment);
    app.post('/check',index.check);
    app.get('/tags', tags.all);
    app.get('/clearer',index.clearer);
    app.get('/:url',index.index,index.index2, index.detail);
    app.param('infoUrl', index.info);
    app.param('url', index.article);
    app.param('categoryUrl', index.category);
    app.param('tagUrl', index.tag);
};
