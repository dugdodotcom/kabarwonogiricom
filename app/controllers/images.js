'use strict';

var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    Image = mongoose.model('Image'),
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
            var widePath='./public/img/wide/'+imageName;
            var gallerythumbPath='./public/img/gallerythumbs/'+imageName;
            fs.writeFile(newPath, data, function (err) {
								if(err){
									console.log(err);
								}
								im.resize({
										srcPath: newPath,
										dstPath: hugePath,
										width:   587
									}, function(err/* , stdout, stderr */){
											if (err) throw err;
											im.crop({
                        srcPath: hugePath,
                        dstPath: regularPath,
                        width:   306,
                        height: 172
                      }, function(err/* , stdout, stderr */){
                          if (err) throw err;
                          im.crop({
                            srcPath: newPath,
                            dstPath: slidePath,
                            width:   641,
                            height:   362
                          }, function(err/* , stdout, stderr */){
                              if (err) throw err;
                              im.crop({
                                srcPath: regularPath,
                                dstPath: thumbPath,
                                width:   160,
                                height: 90
                              }, function(err/* , stdout, stderr */){
                                  if (err) throw err;
                                  im.crop({
                                    srcPath: thumbPath,
                                    dstPath: gallerythumbPath,
                                    width:   75,
                                    height: 75
                                  }, function(err/* , stdout, stderr */){
                                      if (err) throw err;
                                      var image= new Image({image:imageName,alt:req.body.alt,caption:req.body.caption})
                                      image.save(function(err,data){
                                          res.jsonp(data);
                                      });
                                    });
                                    
                                });
                            });
                        });
										});
							});
        }
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
    article.user = req.user;

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
 * Update a article
 */
exports.update = function(req, res) {
    var article = req.article;

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
    Article.find().sort('-created').populate('user', 'name username').exec(function(err, articles) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(articles);
        }
    });
};