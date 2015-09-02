'use strict';

angular.module('mean.articlesadmin').controller('ArticlesAdminController', ['$scope', '$stateParams', '$location', 'Global', 'ArticlesAdmin','$state','$http','$upload', function ($scope, $stateParams, $location, Global, ArticlesAdmin,$state,$http,$upload) {
    $scope.global = Global;
    $scope.mode=$stateParams.mode;
    $scope.form=$stateParams.form;
    $scope.progress=0;
		$scope.onFileSelect = function($files) {
				//$files: an array of files selected, each file has name, size, and type.
				for (var i = 0; i < $files.length; i++) {
						var $file = $files[i];
						$upload.upload({
								url: '/galleriesadmin/upload',
								file: $file,
                data:{alt:$scope.alt,caption:$scope.caption},
								progress: function(e){}
						}).progress(function(evt) {
						$scope.progress=(parseInt(100.0 * evt.loaded / evt.total));
						}).success(function(data, status, headers, config) {
                if(data._id){
										$scope.progress=0;
                    $scope.articlesadmin.image=data._id;
										$scope.image=data.image;
								}
						});
				}
		}
    $scope.create = function() {
        var articlesadmin = new ArticlesAdmin({
            title: this.title,
            content: this.content
        });
        articlesadmin.$save(function(response) {
            $location.path('articlesadmin/' + response._id);
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(article,item) {
				var articlesadmin=new ArticlesAdmin({Id:article});
        articlesadmin.$remove(function(){
            $scope.articlesadmins.splice(item,1); 
				});
    };

    $scope.update = function() {
        if($stateParams.form==='create'){
            var articlesadmin = new ArticlesAdmin($scope.articlesadmin);
            articlesadmin.$save(function(response) {
                if($stateParams.page){
                    $state.go('admin.page', {'mode': $stateParams.mode,'page':$stateParams.page});
                }else{
                    $state.go('admin.home', {'mode': $stateParams.mode});
                }
                $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
                $('#myModal').modal('hide');
            });
        }else{
            var articlesadmin = $scope.articlesadmin;
            articlesadmin.tag=$scope.tag;
            if (!articlesadmin.updated) {
                articlesadmin.updated = [];
            }
            articlesadmin.updated.push(new Date().getTime());
            articlesadmin.$update({
                Id: $stateParams.id
            },function() {
                if($stateParams.page){
                    $state.go('admin.page', {'mode': $stateParams.mode,'page':$stateParams.page});
                }else{
                    $state.go('admin.home', {'mode': $stateParams.mode});
                }
                $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
                $('#myModal').modal('hide');
            });
        }
    };

    $scope.find = function() {
        ArticlesAdmin.query(function(articlesadmin) {
            $scope.articlesadmins = articlesadmin;
        });
    };

    $scope.findOne = function() {
        $http.get('categoryonly').success(function(dat){
            $scope.categories=dat;
            $http.get('categoriesadmin').success(function(data){
                $scope.subcategories=data;
                if($stateParams.form==='edit'){
                    ArticlesAdmin.get({
                        Id: $stateParams.id
                    }, function(articlesadmin) {
                        $scope.articlesadmin = articlesadmin;
                    });
                }else{
                    $scope.articlesadmin=[];
                }
                if(!$scope.articlesadmin.tags){
                    $scope.articlesadmin.tags={};
                }
                
            });
        });
    };
    $scope.subcat = function() {
        var data={_id:$scope.articlesadmin.category};
        $http.post('subcategoriesadmin',data).success(function(dat){
            $scope.subcategories=dat;
        });
    }
    $scope.addTag = function() {
        $http.post('tagsadmin',{name:$scope.taginput}).success(function(data){
            $scope.tags.push(data);
        });
    }
    $scope.tag = function(){
        $http.get('tagsadmin').success(function(data){
            $scope.tags=data;
        });
    }
    $scope.slide = function(id,slide,$index) {
        var data={_id:id,slide:slide};
        $http.post('/articlesslide',data).success(function(dat){
            // var index=$scope.testimonies.indexOf({_id});
            $scope.articlesadmins[$index].slide=dat.slide;
        });
    }
    $scope.publish = function(id,publish,$index) {
        var data={_id:id,publish:publish};
        $http.post('/articlespublish',data).success(function(dat){
            // var index=$scope.testimonies.indexOf({_id});
            $scope.articlesadmins[$index].publish=dat.publish;
        });
    }
    $scope.urlchange = function(){
        $scope.articlesadmin.url=convertToSlug($scope.articlesadmin.title);
    }
    function convertToSlug(Text)
    {
        console.log(Text);
        return Text
            .toLowerCase()
            .replace(/[^\w ]+/g,'')
            .replace(/ +/g,'-')
            ;
    }
}]);