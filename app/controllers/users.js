'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Comment = mongoose.model('Comment'),
    Article = mongoose.model('Article'),
    api=require('../../config/facebook'),
    moment = require('moment');
    moment.lang('id');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    if(req.signedCookies.message){
        var comm=req.signedCookies.message;
        console.log(comm);
        var comment=new Comment(comm);
        comment.user=req.user._id;
        comment.save(function(err,dat){
            if(err)console.log(err);
            if(comm.comment){
                Comment.update({_id:comm.comment},{$addToSet:{comments:dat._id}}).exec(function(err,sub){
                    process(req,res);
                })
            }else{
                console.log(comment);
                Article.update({_id:dat.article},{$addToSet:{comments:dat._id}}).exec(function(err,sub){
                    res.clearCookie('message');
                    api.postMessage(req.user.facebook.token,dat.message,req.signedCookies.url,res);
                    process(req,res);
                });
            }
        });
    }else{
        process(req,res);
    }
    /* console.log(req.signedCookies.message);
    if(req.user.level=='k4b4rw0n0g1r14dm1n'){
                res.redirect('/admin1234567890/');
            }else{
                res.redirect('/');
            } */
};
function process(req,res){
    if(req.signedCookies.url){
        res.redirect(req.signedCookies.url);
        res.clearCookie('url');
    }else{
        if(req.user.level=='k4b4rw0n0g1r14dm1n'){
            res.redirect('/admin1234567890/');
        }else{
            res.redirect('/');
        }
    }
}
/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error'),
        heads:req.heads,
        moment:moment
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User(),
        heads:req.heads,
        moment:moment
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    if(req.signedCookies.message){
        if(req.user.facebook){
        var comm=req.signedCookies.message;
        console.log(comm);
        var comment=new Comment(comm);
        comment.user=req.user._id;
        comment.save(function(err,dat){
            if(err)console.log(err);
            if(comm.comment){
                Comment.update({_id:comm.comment},{$addToSet:{comments:dat._id}}).exec(function(err,sub){
                    process(req,res);
                })
            }else{
                console.log(comment);
                Article.update({_id:dat.article},{$addToSet:{comments:dat._id}}).exec(function(err,sub){
                    res.clearCookie('message');
                    api.postMessage(req.user.facebook.token,dat.message,req.signedCookies.url,res);
                    process(req,res);
                });
            }
        });
        }else{
            process(req,res);
        }
    }else{
        process(req,res);
    }
};

/**
 * Create user
 */
exports.create = function(req, res, next) {
    var user = new User(req.body);
    var message = null;

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = 'Username already exists';
                    break;
                default:
                    message = 'Please fill all the required fields';
            }

            return res.render('users/signup', {
                message: message,
                user: user,
                heads:req.heads,
                moment:moment
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            if(req.signedCookies.message){
                if(req.user.facebook){
                var comm=req.signedCookies.message;
                console.log(comm);
                var comment=new Comment(comm);
                comment.user=req.user._id;
                comment.save(function(err,dat){
                    if(err)console.log(err);
                    if(comm.comment){
                        Comment.update({_id:comm.comment},{$addToSet:{comments:dat._id}}).exec(function(err,sub){
                            process(req,res);
                        })
                    }else{
                        console.log(comment);
                        Article.update({_id:dat.article},{$addToSet:{comments:dat._id}}).exec(function(err,sub){
                            res.clearCookie('message');
                            api.postMessage(req.user.facebook.token,dat.message,req.signedCookies.url,res);
                            process(req,res);
                        });
                    }
                });
                }else{
                    process(req,res);
                }
            }else{
                process(req,res);
            }
            
        });
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};
exports.url=function(req,res,next){
    console.log(req.body.url);
    res.cookie('url', req.body.url, { signed: true });
    next();
}
exports.formlogin=function(url){
  return '<div class="row">\
            <div class="col-md-6"><form action="/auth/facebook" method="post"><input type="hidden" name="url" value="'+url+'"><button type="submit"><img src="/img/icons/facebook.png"></button></form><a href="/auth/twitter"><img src="/img/icons/twitter.png"></a></div>\
            <div class="col-md-6">\
              <form action="/users/session" method="post" class="signin form-horizontal">\
                <input type="hidden" name="url" value="'+url+'"><div class="control-group">\
                  <label for="email" class="control-label">Email</label>\
                  <div class="controls">\
                    <input id="email" type="text" name="email" placeholder="Email">\
                  </div>\
                </div>\
                <div class="control-group">\
                  <label for="password" class="control-label">Password</label>\
                  <div class="controls">\
                    <input id="password" type="password" name="password" placeholder="Password">\
                  </div>\
                </div>\
                <div class="form-actions">\
                  <button type="submit" class="btn btn-primary">Sign in</button>&nbsp;\
                  or&nbsp;<a href="/signup" class="show-signup">Sign up</a>\
                </div>\
              </form>\
            </div>\
          </div>';
}
exports.formfb=function(url){
  return '<div class="row">\
            <div class="col-md-12"><a href="/auth/facebook"><img src="/img/icons/facebook.png"></a><a href="/auth/twitter"><img src="/img/icons/twitter.png"></a></div>\
          </div>';
}