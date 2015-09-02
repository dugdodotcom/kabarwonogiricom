'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    Image = mongoose.model('Image'),
    Tag = mongoose.model('Tag'),
    _ = require('lodash'),
    fs = require('fs'),
    im = require('imagemagick');


/**
 * Find article by id
 */
exports.upload=function(req,res){
    fs.readFile(req.files.file.path, function (err, data) {
        var imageName = req.files.file.name;
        if(err){
            console.log(err);
        }
        if(!imageName){
            console.log('There was an error');
            res.redirect('/');
            res.end();
        }else{
            var newPath='./public/img/real/'+imageName;
            var hugePath='./public/img/huge/'+imageName;
            var regularPath='./public/img/regular/'+imageName;
            var slidePath='./public/img/slide/'+imageName;
            var thumbPath='./public/img/thumbs/'+imageName;
            fs.writeFile(newPath, data, function (err) {
								if(err){
									console.log(err);
								}
								im.resize({
										srcPath: newPath,
										dstPath: hugePath,
										width:   560
									}, function(err/* , stdout, stderr */){
											if (err) throw err;
											im.resize({
                        srcPath: hugePath,
                        dstPath: regularPath,
                        width:   300
                      }, function(err/* , stdout, stderr */){
                          if (err) throw err;
                          im.resize({
                            srcPath: hugePath,
                            dstPath: slidePath,
                            height:   430,
                            width:   760,
                          }, function(err/* , stdout, stderr */){
                              if (err) throw err;
                              im.resize({
                                srcPath: regularPath,
                                dstPath: thumbPath,
                                width:   160,
                                height: 90
                              }, function(err/* , stdout, stderr */){
                                  if (err) throw err;
                                  var image= new Image({image:imageName,alt:req.body.alt})
                                  image.save(function(err,data){
                                      res.jsonp({success:1,img:data.image});
                                  });
                                });
                            });
                        });
										});
							});
        }
    });
};
exports.slide = function(req,res){
    Article.update({_id:req.body._id},{$set:{slide:req.body.slide==1?0:1}}).exec(function(err,dat){
        res.jsonp({slide:req.body.slide==1?0:1});
    });
};
exports.publish = function(req,res){
    Article.update({_id:req.body._id},{$set:{publish:req.body.publish==1?0:1}}).exec(function(err,dat){
        res.jsonp({publish:req.body.publish==1?0:1});
    });
};
exports.article = function(req, res, next, id) {
    Article.load(id, function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};

/**
 * Create a article
 */
exports.create = function(req, res) {
    var article = new Article(req.body);
    article.limit=luimit(req.body.limit);
    article.author = req.user._id;
    article.save(function(err,dat) {
        if(err){console.log(err);}else{
            res.jsonp({success:1});
        }
    });
};
function luimit(d){
    var limits=d.split("",150);
    var limiter='';
    for(var i=0;i<limits.length;i++){
        limiter=limiter+limits[i];
    }
    return limiter;
}
/**
 * Update a article
 */
exports.update = function(req, res) {
    var article = req.article;
    req.body.limit=luimit(req.body.limit);
    article = _.extend(article, req.body);

    article.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                article: article
            });
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
    var article = req.article;

    article.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                article: article
            });
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.article);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    Article.find().sort('-created').populate('author image category sub').exec(function(err, articles) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(articles);
        }
    });
};