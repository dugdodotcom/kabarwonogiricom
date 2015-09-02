'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
    _ = require('lodash');


/**
 * Find category by id
 */
exports.category = function(req, res, next, id) {
    Category.load(id, function(err, category) {
        if (err) return next(err);
        if (!category) return next(new Error('Failed to load category ' + id));
        req.category = category;
        next();
    });
};

/**
 * Create a category
 */
exports.create = function(req, res) {
    var category = new Category({namecategory:req.body.namecategory,urlcategory:req.body.urlcategory});
    category.save(function(err,dat) {
        if (err) {
            console.log(err);
        } else {
            if(req.body.subs.length>0){
                for(var i=0;i<req.body.subs.length;i++){
                    var category = new Category({namecategory:req.body.subs[i].namecategory,urlcategory:req.body.subs[i].urlcategory,parent:dat._id});
                    category.save(function(err,dat2) {
                        if(err)console.log(err);
                        dat.subs.push(dat2._id);
                        dat.save(function(err,dat3){
                            if(err)console.log(err);
                            if(dat2.namecategory==req.body.subs[i-1].namecategory){
                                res.jsonp({success:1});
                            }
                        });
                    })
                }
            }else{
                res.jsonp({success:1});
            }
        }
    });
};
exports.subcreate = function(req,res){
    var category = new Category({namecategory:req.body.namecategory,urlcategory:req.body.urlcategory});
    category.save(function(err,dat) {
        Category.update({_id:req.body._id},{$addToSet:{subs:dat._id}}).exec(function(err,sub){
            res.jsonp(dat);
        });
    })
}
/**
 * Update a category
 */
exports.update = function(req, res) {
    var category = req.category;

    category = _.extend(category, req.body);

    category.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                category: category
            });
        } else {
            res.jsonp(category);
        }
    });
};

/**
 * Delete an category
 */
exports.destroy = function(req, res) {
    var category = req.category;

    category.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                category: category
            });
        } else {
            res.jsonp(category);
        }
    });
};

/**
 * Show an category
 */
exports.show = function(req, res) {
    res.jsonp(req.category);
};

/**
 * List of Categorys
 */
exports.categoryonly=function(req,res){
    Category.find({ parent : { $exists : false } } ).exec(function(err,cat){
        res.jsonp(cat);
    });
};
exports.all = function(req, res) {
    Category.find().sort('-created').populate('subs').exec(function(err, categories) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(categories);
        }
    });
};
exports.subcat =function(req,res) {
    Category.find({parent:req.body._id}).exec(function(err,dat){
        res.jsonp(dat);
    });
}