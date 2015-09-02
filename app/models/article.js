'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');


/**
 * Article Schema
 */
var ArticleSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    url: {
        type: String,
        default: '',
        trim: true
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    sub: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    limit: {
        type: String,
        default: '',
        trim: true
    },
    image: {
        type: Schema.ObjectId,
        ref: 'Image'
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    tags:[{
        type: Schema.ObjectId,
        ref: 'Tag'
        }],
    comments:[{
        type: Schema.ObjectId,
        ref: 'Comment'
        }],
    slide:{
        type: Number,
        default:0
    },
    view:{
        type: Number,
        default:0
    },
    comment:{
        type: Number,
        default:0
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
    publish:{
        type: Number,
        default:0
    },
    customwidth:{
        type: Number,
        default:100
    },
});

/**
 * Validations
 */
ArticleSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
ArticleSchema.statics = {
    load: function (id, cb) {
        this.findOne({
            _id: id
        }).exec(cb)
    },
    load2: function (req,res,id, cb) {
        var User = mongoose.model('User'),
        Comment = mongoose.model('Comment'),
        Article = mongoose.model('Article');
        var view=[];
        if(req.signedCookies.view){
            view=req.signedCookies.view;
        }
        console.log('1'+view);
        if (_.contains(view, id)) {
            process();
        }else{
            Article.update({url:id},{$inc:{view:1}}).exec(function(err,data){
                if(view){
                    view.push(id);
                    res.cookie('view', view, { signed: true });
                }else{
                    res.cookie('view', [id], { signed: true });
                }
                process();
            })
        }
        function process(){
            Article.findOne({
                url: id,publish:1
            },{limit:0}).populate('comments author image category sub tags','created user name username alt caption image urlcategory namecategory value message comment._id comments').exec(function(err,article){
                Comment.populate(article, {
                    path: 'comments.comments',
                    select: 'message comments user',
                }, function(err,com){
                    User.populate(com, {
                        path: 'comments.user comments.comments.user',
                        select: 'name picture',
                    },cb);
                });
            })
        }
    },
    load3: function (id, cb) {
        var Category = mongoose.model('Category');
        var content=new Object();
        Category.findOne({urlcategory:id}).populate('parent').exec(function(err,cat){   
            content.category=cat;
            var conditional={publish:1};
            if(cat.parent){
                conditional.sub=cat._id;
            }else{
                conditional.category=cat._id;
            }
            mongoose.model('Article').find(conditional,{content:0}).sort('-created').populate('image').exec(function(err,dat){
                content.content=dat;
                cb(content);
            });
        });
    },
    load4: function (id, cb) {
        var Tag = mongoose.model('Tag');
        var content=new Object();
        Tag.findOne({value:id}).exec(function(err,tag){   
            content.tag=tag;
            mongoose.model('Article').find({tags: { $in: [tag._id] },publish:1},{content:0}).sort('-created').populate('image').exec(function(err,dat){
                content.content=dat;
                cb(content);
            });
        });
    }
}

mongoose.model('Article', ArticleSchema);
