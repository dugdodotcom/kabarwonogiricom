'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Tag = mongoose.model('Tag'),
    _ = require('lodash');
function convertToSlug(Text)
    {
        console.log(Text);
        return Text
            .toLowerCase()
            .replace(/[^\w ]+/g,'')
            .replace(/ +/g,'-')
            ;
    }
exports.tag = function(req, res, next, id) {
    Tag.load(id, function(err,tag) {
        if (err) return next(err);
        if (!tag) return next(new Error('Failed to load tag ' + id));
        req.tag = tag;
        next();
    });
};
exports.all = function(req, res) {
    Tag.find().exec(function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(articles);
        }
    });
};
exports.create = function(req, res) {
    var tag = new Tag(req.body);
    tag.value=convertToSlug(req.body.name);
    tag.save(function(err,dat) {
        if(err){console.log(err);}else{
            res.jsonp(dat);
        }
    });
};
exports.update = function(req, res) {
    var tag = req.tag;
    req.body.value=convertToSlug(req.body.name);
    tag = _.extend(tag, req.body);

    tag.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                tag: tag
            });
        } else {
            res.jsonp(tag
            );
        }
    });
};
exports.destroy = function(req, res) {
    var tag = req.tag;

    tag.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                tag: tag
            });
        } else {
            res.jsonp(tag);
        }
    });
};
exports.show = function(req, res) {
    res.jsonp(req.tag);
};