'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var TagSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    value: {
        type: String,
        default: '',
        trim: true
    },
    keyword: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
TagSchema.statics = {

    load: function (id, cb) {
        this.findOne({
            _id: id
        }).exec(cb)
    }/* ,
    menu: function (cb) {
        var Article = mongoose.model('Article'),
            head=new Object();
        this.find().exec(function(err,cat){
            head.categories=cat;
            Article.find().populate('image').sort('popular').limit(4).exec(function(err,pop){
                head.populars=pop;
                cb(null, head); 
            })
        })
    } */
}
mongoose.model('Tag', TagSchema);
