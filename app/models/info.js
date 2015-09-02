'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Info Schema
 */
var InfoSchema = new Schema({
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
    content: {
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
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
	comments:[{ type: Schema.ObjectId, ref: 'Comment' }]
});

/**
 * Validations
 */
InfoSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
 InfoSchema.statics = {
    load : function(id, cb) {
      this.findOne({
          _id: id
      }).populate('user', 'name username').exec(cb);
    },
    load2:function(id, cb) {
      console.log(id);
      this.findOne({
          url: id
      }).exec(cb);
    }
 }

mongoose.model('Info', InfoSchema);
