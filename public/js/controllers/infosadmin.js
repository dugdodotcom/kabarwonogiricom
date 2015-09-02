'use strict';

angular.module('mean.infosadmin').controller('InfosAdminController', ['$scope', '$stateParams', '$location', 'Global', 'InfosAdmin','$state','$http', function ($scope, $stateParams, $location, Global, InfosAdmin,$state,$http) {
    $scope.global = Global;
    $scope.mode=$stateParams.mode;
    $scope.form=$stateParams.form;
    $scope.create = function() {
        var infosadmin = new InfosAdmin({
            title: this.title,
            content: this.content
        });
        infosadmin.$save(function(response) {
            $location.path('infosadmin/' + response._id);
        });
        this.title = '';
        this.content = '';
    };

    $scope.remove = function(article,item) {
				var infosadmin=new InfosAdmin({Id:article});
        infosadmin.$remove(function(){
            $scope.infosadmins.splice(item,1); 
				});
    };

    $scope.update = function() {
        if($stateParams.form==='create'){
            var infosadmin = new InfosAdmin($scope.infosadmin);
            infosadmin.$save(function(response) {
                if($stateParams.page){
                    $state.go('admin.page', {'mode': $stateParams.mode,'page':$stateParams.page});
                }else{
                    $state.go('admin.home', {'mode': $stateParams.mode});
                }
                $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
                $('#myModal').modal('hide');
            });
        }else{
            var infosadmin = $scope.infosadmin;
            if (!infosadmin.updated) {
                infosadmin.updated = [];
            }
            infosadmin.updated.push(new Date().getTime());
            infosadmin.$update({
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
        InfosAdmin.query(function(infosadmin) {
            $scope.infosadmins = infosadmin;
        });
    };

    $scope.findOne = function() {
        if($stateParams.form==='create'){
            $scope.infosadmin={subs:[]};
        }else{
            InfosAdmin.get({
                Id: $stateParams.id
            }, function(infosadmin) {
                $scope.infosadmin = infosadmin;
            });
        }
    };
    $scope.addSub = function() {
        if($stateParams.form==='edit'){
            var data={_id:$stateParams.id,namecategory:$scope.namecategoryinput,urlcategory:$scope.urlcategoryinput};
            $http.post('subcreate',data).success(function(dat){
                $scope.infosadmin.subs.push(dat);
            });
        }else{
            $scope.infosadmin.subs.push({namecategory:'',urlcategory:''});
        }
    }
    $scope.category = function(){
        $http.get('infosinfosadmin').success(function(data){
            $scope.infos=data;
        });
    }
    $scope.slide = function(id,slide,$index) {
        var data={_id:id,slide:slide};
        $http.post('/articlesslide',data).success(function(dat){
            // var index=$scope.testimonies.indexOf({_id});
            $scope.infosadmins[$index].slide=dat.slide;
        });
    }
    $scope.urlchange = function(){
        $scope.infosadmin.url=convertToSlug($scope.infosadmin.title);
    }
    $scope.suburlchange = function(index){
        $scope.infosadmin.subs[index].urlcategory=convertToSlug($scope.infosadmin.subs[index].namecategory);
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