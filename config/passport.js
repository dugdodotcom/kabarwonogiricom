'use strict';

var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    User = mongoose.model('User'),
    config = require('./config'),
    _ = require('lodash'),
    fs = require('fs'),
    request = require('request'),
    im = require('imagemagick');

var download = function(uri, filename, cb){
  console.log(filename);
  var newPath='./public/img/real/'+filename,
  profilePath='./public/img/profile/'+filename;
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(newPath)).on('close',function(err){
        if(err){
            console.log(err);
        }
        im.crop({
            srcPath: newPath,
            dstPath: profilePath,
            height: 90
        },cb);
    });
  });
};
function convertToSlug(Text)
    {
        console.log(Text);
        return Text
            .toLowerCase()
            .replace(/[^\w ]+/g,'')
            .replace(/ +/g,'-')
            ;
    }
module.exports = function(passport,req,res) {
    //Serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, '-salt -hashed_password', function(err, user) {
            done(err, user);
        });
    });

    //Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, user);
            });
        }
    ));

    //Use twitter strategy
    passport.use(new TwitterStrategy({
            consumerKey: config.twitter.clientID,
            consumerSecret: config.twitter.clientSecret,
            callbackURL: config.twitter.callbackURL
        },
        function(token, tokenSecret, profile, done) {
            User.findOne({
                'twitter.id_str': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        username: profile.username,
                        provider: 'twitter',
                        twitter: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));

    //Use facebook strategy
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL,
            passReqToCallback: true,
            profileFields: ['id','displayName','name','gender','birthday','profileUrl','emails','photos']
        },
        function(req,accessToken, refreshToken, profile, done) {
            if(req.user){
                if(req.user.facebook && req.user.facebook.id==profile.id){
                    return done('', req.user);
                }else{
                    var user=req.user;
                    profile._json.token=accessToken;
                    user = _.extend(user, {
                        facebook: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                }
            }else{
                User.findOne({
                    'facebook.id': profile.id
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        User.findOne({email:profile.emails[0].value},function(err, there){
                            if(there){
                                var user=there;
                                profile._json.token=accessToken;
                                user = _.extend(user, {
                                    facebook: profile._json
                                });
                                user.save(function(err) {
                                    if (err) console.log(err);
                                    return done(err, user);
                                });
                            }else{
                                profile._json.token=accessToken;
                                user = new User({
                                    id: profile.id,
                                    name: profile.displayName,
                                    email: profile.emails[0].value,
                                    username: convertToSlug(profile.displayName),
                                    provider: 'facebook',
                                    facebook: profile._json
                                });
                                user.save(function(err,dat) {
                                    if(err)console.log(err);
                                    download(profile.photos[0].value, dat.picture+'.jpg', function(err,cb){
                                        if (err) console.log(err);
                                        return done(err, dat);
                                    });
                                });
                                
                            }
                        });
                    } else {
                        return done(err, user);
                    }
                });
            }
        }
    ));

    //Use github strategy
    passport.use(new GitHubStrategy({
            clientID: config.github.clientID,
            clientSecret: config.github.clientSecret,
            callbackURL: config.github.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'github.id': profile.id
            }, function(err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'github',
                        github: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));

    //Use google strategy
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'google.id': profile.id
            }, function(err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'google',
                        google: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));
};