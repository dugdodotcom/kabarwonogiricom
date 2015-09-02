'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var CategorySchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    namecategory: {
        type: String,
        default: '',
        trim: true
    },
    urlcategory: {
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
    parent: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    subs: [{
        type: Schema.ObjectId,
        ref: 'Category'
    }]
});
CategorySchema.statics = {

    load: function (id, cb) {
        this.findOne({
            _id: id
        }).populate('subs').exec(cb)
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
mongoose.model('Category', CategorySchema);
