'use strict';

angular.module('mean.categoriesadmin').controller('CategoriesAdminController', ['$scope', '$stateParams', '$location', 'Global', 'CategoriesAdmin','$state','$http', function ($scope, $stateParams, $location, Global, CategoriesAdmin,$state,$http) {
    $scope.global = Global;
    $scope.mode=$stateParams.mode;
    $scope.form=$stateParams.form;
    $scope.create = function() {
        var categoriesadmin = new CategoriesAdmin({
            title: this.title,
            content: this.content
        });
        categoriesadmin.$save(function(response) {
            $location.path('categoriesadmin/' + response._id);
        });
        this.title = '';
        this.content = '';
    };

    $scope.remove = function(article,item) {
				var categoriesadmin=new CategoriesAdmin({Id:article});
        categoriesadmin.$remove(function(){
            $scope.categoriesadmins.splice(item,1); 
				});
    };

    $scope.update = function() {
        if($stateParams.form==='create'){
            var categoriesadmin = new CategoriesAdmin($scope.categoriesadmin);
            categoriesadmin.$save(function(response) {
                if($stateParams.page){
                    $state.go('admin.page', {'mode': $stateParams.mode,'page':$stateParams.page});
                }else{
                    $state.go('admin.home', {'mode': $stateParams.mode});
                }
                $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
                $('#myModal').modal('hide');
            });
        }else{
            var categoriesadmin = $scope.categoriesadmin;
            if (!categoriesadmin.updated) {
                categoriesadmin.updated = [];
            }
            categoriesadmin.updated.push(new Date().getTime());
            categoriesadmin.$update({
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
        CategoriesAdmin.query(function(categoriesadmin) {
            $scope.categoriesadmins = categoriesadmin;
        });
    };

    $scope.findOne = function() {
        if($stateParams.form==='create'){
            $scope.categoriesadmin={subs:[]};
        }else{
            CategoriesAdmin.get({
                Id: $stateParams.id
            }, function(categoriesadmin) {
                $scope.categoriesadmin = categoriesadmin;
            });
        }
    };
    $scope.addSub = function() {
        if($stateParams.form==='edit'){
            var data={_id:$stateParams.id,namecategory:$scope.namecategoryinput,urlcategory:$scope.urlcategoryinput,keyword:$scope.keywordinput,description:$scope.descriptioninput};
            $http.post('subcreate',data).success(function(dat){
                $scope.categoriesadmin.subs.push(dat);
            });
        }else{
            $scope.categoriesadmin.subs.push({namecategory:'',urlcategory:''});
        }
    }
    $scope.category = function(){
        $http.get('categoriescategoriesadmin').success(function(data){
            $scope.categories=data;
        });
    }
    $scope.slide = function(id,slide,$index) {
        var data={_id:id,slide:slide};
        $http.post('/articlesslide',data).success(function(dat){
            // var index=$scope.testimonies.indexOf({_id});
            $scope.categoriesadmins[$index].slide=dat.slide;
        });
    }
    $scope.urlchange = function(){
        $scope.categoriesadmin.urlcategory=convertToSlug($scope.categoriesadmin.namecategory);
    }
    $scope.suburlchange = function(index){
        $scope.categoriesadmin.subs[index].urlcategory=convertToSlug($scope.categoriesadmin.subs[index].namecategory);
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