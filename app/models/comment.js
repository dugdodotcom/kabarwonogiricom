'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var CommentSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String,
        default: '',
        trim: true
    },
    article: {
        type: Schema.ObjectId,
        ref: 'Article'
    },
    comment: {
        type: Schema.ObjectId,
        ref: 'Comment'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    comments:[{
        type: Schema.ObjectId,
        ref: 'Comment'
        }]
});
CommentSchema.statics = {
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
mongoose.model('Comment', CommentSchema);
