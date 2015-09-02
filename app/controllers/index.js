'use strict';
// tes
var mongoose = require('mongoose'),
	Info = mongoose.model('Info'),
  Category = mongoose.model('Category'),
  Article = mongoose.model('Article'),
  moment = require('moment'),
  api=require('../../config/facebook'),
  Comment = mongoose.model('Comment'),
  User = mongoose.model('User'),
  Tag = mongoose.model('Tag'),
  Image = mongoose.model('Image'),
  users=require('./users');
  moment.lang('id');
exports.index = function(req, res, next){
  var head=new Object();
  Category.find({ parent : { $exists : false } }).populate('subs').exec(function(err,cat){
      head.categories=cat;
      Article.find({publish:1},{content:0}).sort('-created').limit(4).exec(function(err,rec){
          head.recents=rec;
          Tag.find().exec(function(err,tag){
              head.tags=tag;
              Image.find().sort('-created').limit(8).exec(function(err,img){
                  head.images=img;
                  Info.find().exec(function(err,inf){
                      head.infos=inf;
                      req.heads=head;
                      next();
                  })
              })
          })
      });
  })
}
exports.index2 = function(req, res, next){
    Article.find({publish:1},{content:0}).populate('image').sort('-view').limit(10).exec(function(err,pop){
        req.heads.populars=pop;
        next();
    });
}
exports.home = function(req, res) {
    Info.findOne({url:'home'}).exec(function(err,inf){
        if(err)console.log(err);
        var content=new Object();
        Article.find({slide:1,publish:1},{content:0}).sort('-created').populate('user image').limit(5).exec(function(err,sld){
            content.slides=sld;
            Category.findOne({urlcategory:'info-warga'},{_id:1}).exec(function(err,cat1){
                Article.find({category:cat1._id,publish:1},{content:0}).populate('image','image').sort('-created').limit(2).exec(function(err,kabare){
                    content.kabare=kabare;
                    Category.findOne({urlcategory:'sosok'},{_id:1}).exec(function(err,cat2){
                        Article.findOne({category:cat2._id,publish:1},{content:0}).populate('image','image').exec(function(err,sosok){
                            content.sosok=sosok;
                            Category.findOne({urlcategory:'gaul'},{_id:1}).exec(function(err,cat3){
                                Article.find({category:cat3._id,publish:1},{content:0}).populate('image','image').sort('-created').exec(function(err,gaul){
                                    content.gaul=gaul;
                                    Category.findOne({urlcategory:'asal-usul'},{_id:1}).exec(function(err,cat4){
                                        Article.find({category:cat4._id,publish:1},{content:0}).sort('-created').populate('image','image').exec(function(err,asalusul){
                                            content.asalusul=asalusul;
                                            Category.findOne({urlcategory:'foto'},{_id:1}).exec(function(err,cat5){
                                                Article.findOne({category:cat5._id,publish:1},{content:0}).populate('image','image').exec(function(err,foto){
                                                    content.foto=foto;
                                                    Category.findOne({urlcategory:'wisata'},{_id:1}).exec(function(err,cat6){
                                                        Article.findOne({category:cat6._id,publish:1},{content:0}).populate('image','image').exec(function(err,wisata){
                                                            content.wisata=wisata;
                                                            Category.findOne({urlcategory:'boro'},{_id:1}).exec(function(err,cat7){
                                                                Article.findOne({category:cat7._id,publish:1},{content:0}).populate('image','image').exec(function(err,boro){
                                                                    content.boro=boro;
                                                                    Category.findOne({urlcategory:'kabar'},{_id:1}).exec(function(err,cat8){
                                                                        Article.findOne({category:cat8._id,publish:1},{content:0}).sort('-created').populate('image','image').exec(function(err,art1){
                                                                            content.news1=art1;
                                                                            Article.find({category:cat8._id,_id:{$ne:art1._id},publish:1},{content:0,limit:0}).populate('image','image').sort('-created').limit(4).exec(function(err,art){
                                                                                content.news=art;
                                                                                Article.find({category:cat8._id,_id:{$lt:art[3]._id},publish:1},{content:0}).populate('image','image').sort('-created').limit(10).exec(function(err,art2){
                                                                                    content.news2=art2;
                                                                                    res.render('home/home', {
                                                                                        title: inf?inf.title:'',
                                                                                        keyword: inf?inf.keyword:'',
                                                                                        description: inf?inf.description:'',
                                                                                        id:'home',
                                                                                        content:content,
                                                                                        moment: moment,
                                                                                        heads:req.heads
                                                                                    });
                                                                                });
                                                                            });
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        });
    });
};
exports.article = function(req, res, next, id) {
    Article.load2(req,res,id, function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};
exports.detail = function(req, res) {
    res.render('home/detail', {
        title: req.article.title,
        keyword: req.article.keyword,
        description: req.article.description,
        id:req.article.category.urlcategory,
        heads:req.heads,
        moment: moment,
        detail:req.article
    });
};
exports.category = function(req, res, next, id) {
    Article.load3(id, function(article) {
        req.article = article;
        next();
    });
};
exports.categorylist = function(req, res) {
    res.render('home/category', {
        title: req.article.category.title,
        keyword: req.article.category.keyword,
        description: req.article.category.description,
        id:req.article.category.parent?req.article.category.parent.urlcategory:req.article.category.urlcategory,
        heads:req.heads,
        moment: moment,
        content:req.article
    });
};
exports.tag = function(req, res, next, id) {
    Article.load4(id, function(article) {
        req.article = article;
        next();
    });
};
exports.taglist = function(req, res) {
    res.render('home/tag', {
        title: req.article.tag.name,
        keyword: req.article.tag.keyword,
        description: req.article.tag.description,
        id:req.article.tag.value,
        heads:req.heads,
        moment: moment,
        content:req.article
    });
};
exports.info = function(req, res, next, id) {
    Info.load2(id, function(err,info) {
        console.log(info);
        req.info = info;
        next();
    });
};
exports.infodetail = function(req, res) {
    res.render('home/info', {
        title: req.info.title,
        keyword: req.info.keyword,
        description: req.info.description,
        id:req.info.url,
        heads:req.heads,
        moment: moment,
        content:req.info
    });
};
exports.postcomment=function(req,res){
    var message=req.body.message;
    api.postMessage(req.user.facebook.token,message,req.body.url, res);
}
exports.check=function(req,res){
    var theInput={url:req.body.url,message:req.body.message,article:req.body.article};
    if(req.body.comment!=''){
        theInput.comment=req.body.comment;
    }
    if(!req.user){
        res.cookie('message', theInput, { signed: true });
        res.jsonp({status:1,title:'Untuk komentar Anda harus terhubung dengan facebook',content:users.formlogin(req.body.url)});
    }else{
        if(!req.user.facebook){
            res.cookie('message',theInput, { signed: true });
            res.jsonp({status:1,title:'Untuk komentar Anda harus terhubung dengan facebook',content:users.formfb(req.body.url)});
        }else{
            var comm=theInput;
            var comment=new Comment(comm);
            comment.user=req.user._id;
            comment.save(function(err,dat){
                if(err)console.log(err);
                if(comm.comment){
                    Comment.update({_id:comm.comment},{$addToSet:{comments:dat._id}}).exec(function(err,sub){
                        Comment.count({article:dat.article},function(err,cnt){
                            Article.update({_id:dat.article},{$set:{comment:cnt}},function(err,upd){
                                process();
                            })
                        });
                    })
                }else{
                    Comment.count({article:dat.article},function(err,cnt){
                        Article.update({_id:dat.article},{$set:{comment:cnt}}).exec(function(err,sub){
                            Article.update({_id:dat.article},{$addToSet:{comments:dat._id}}).exec(function(err,sub){
                                process();
                            });
                        });
                    });
                    
                }
                function process(){
                    res.clearCookie('message');
                        res.jsonp({status:0,content:'<li tabindex="-1"><div id="comment-'+dat._id+'" class="row">\
                        <div class="comment-content col-md-10">\
                          <p class="comment-name">'+req.user.name+'</p>\
                          <p class="date">'+moment(dat.created).format('lll')+', <span><a href="reply/'+dat._id+'/#respond" _id="'+(dat.comment?dat.comment:dat._id)+'" no="'+dat._id+'" class="reply">Balas</a></span></p>\
                          <p class="content">'+dat.message+'</p>\
                        </div>\
                        <div class="profile-picture col-md-2">&nbsp;\
                          <div class="hexagon hexagon2">\
                            <div class="hexagon-in1">\
                              <div style="background:url(/img/profile/'+req.user.picture+'.jpg) no-repeat center center" class="hexagon-in2"></div>\
                            </div>\
                          </div>\
                        </div>\
                      </div></li>',_id:dat._id});
                      api.postMessage(req.user.facebook.token,req.body.message,req.body.url, res);
                    
                }
                });
        }
    }
}
exports.clearer=function(req,res){
    res.clearCookie('view');
    res.jsonp({clear:1});
}