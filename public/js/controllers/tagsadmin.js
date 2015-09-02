'use strict';

angular.module('mean.tagsadmin').controller('TagsAdminController', ['$scope', '$stateParams', '$location', 'Global', 'TagsAdmin','$state','$http', function ($scope, $stateParams, $location, Global, TagsAdmin,$state,$http) {
    $scope.global = Global;
    $scope.mode=$stateParams.mode;
    $scope.form=$stateParams.form;
    $scope.create = function() {
        var tagsadmin = new TagsAdmin({
            title: this.title,
            content: this.content
        });
        tagsadmin.$save(function(response) {
            $location.path('tagsadmin/' + response._id);
        });
        this.title = '';
        this.content = '';
    };

    $scope.remove = function(article,item) {
				var tagsadmin=new TagsAdmin({Id:article});
        tagsadmin.$remove(function(){
            $scope.tagsadmins.splice(item,1); 
				});
    };

    $scope.update = function() {
        if($stateParams.form==='create'){
            var tagsadmin = new TagsAdmin($scope.tagsadmin);
            tagsadmin.$save(function(response) {
                if($stateParams.page){
                    $state.go('admin.page', {'mode': $stateParams.mode,'page':$stateParams.page});
                }else{
                    $state.go('admin.home', {'mode': $stateParams.mode});
                }
                $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
                $('#myModal').modal('hide');
            });
        }else{
            var tagsadmin = $scope.tagsadmin;
            if (!tagsadmin.updated) {
                tagsadmin.updated = [];
            }
            tagsadmin.updated.push(new Date().getTime());
            tagsadmin.$update({
                Id: $stateParams.id
            },function(response) {
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
        TagsAdmin.query(function(tagsadmin) {
            $scope.tagsadmins = tagsadmin;
        });
    };

    $scope.findOne = function() {
        if($stateParams.form==='create'){
            $scope.tagsadmin={subs:[]};
        }else{
            TagsAdmin.get({
                Id: $stateParams.id
            }, function(tagsadmin) {
                $scope.tagsadmin = tagsadmin;
            });
        }
    };
    $scope.addSub = function() {
        if($stateParams.form==='edit'){
            var data={_id:$stateParams.id,namecategory:$scope.namecategoryinput,urlcategory:$scope.urlcategoryinput};
            $http.post('subcreate',data).success(function(dat){
                $scope.tagsadmin.subs.push(dat);
            });
        }else{
            $scope.tagsadmin.subs.push({namecategory:'',urlcategory:''});
        }
    }
    $scope.category = function(){
        $http.get('tagstagsadmin').success(function(data){
            $scope.tags=data;
        });
    }
    $scope.slide = function(id,slide,$index) {
        var data={_id:id,slide:slide};
        $http.post('/articlesslide',data).success(function(dat){
            // var index=$scope.testimonies.indexOf({_id});
            $scope.tagsadmins[$index].slide=dat.slide;
        });
    }
    $scope.urlchange = function(){
        $scope.tagsadmin.value=convertToSlug($scope.tagsadmin.name);
    }
    $scope.suburlchange = function(index){
        $scope.tagsadmin.subs[index].urlcategory=convertToSlug($scope.tagsadmin.subs[index].namecategory);
    }
    $scope.suburlinputchange = function(index){
        $scope.urlcategoryinput=convertToSlug($scope.namecategoryinput);
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