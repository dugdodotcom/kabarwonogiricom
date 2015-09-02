'use strict';

var mongoose = require('mongoose'),
    Category = mongoose.model('Category');
    
module.exports ={heads:function(){
    var head=new Object();
    Category.find().lean().exec(function(err,dat){
        if(err){console.log(err);}
        head.categories='tes';
        return head;
    });
    }}

/* module.exports = exports = function(req, res) {
  var head=new Object();
    Category.find().exec(function(err,dat){
        if(err){console.log(err);}
        head.categories=dat?dat:'';
        res(head);
    });
}; */