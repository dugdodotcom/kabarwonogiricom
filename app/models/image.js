'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ImageSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: '',
        trim: true
    },
    alt: {
        type: String,
        default: '',
        trim: true
    },
    caption: {
        type: String,
        default: '',
        trim: true
    }
});
/**
 * Statics
 */
ImageSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('sub').exec(cb);
};

mongoose.model('Image', ImageSchema);
