'use strict';

angular.module('mean.admin').controller('AdminController', ['$scope', '$stateParams', '$location', 'Global', 'Admin','$state','$http','$upload', function ($scope, $stateParams, $location, Global, Admin,$state,$http,$upload) {
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
                data:{alt:$scope.alt},
								progress: function(e){}
						}).progress(function(evt) {
						$scope.progress=(parseInt(100.0 * evt.loaded / evt.total));
						}).success(function(data, status, headers, config) {
                if(data.success===1){
										$scope.progress=0;
                    $scope.admin.image=data._id;
										$scope.image=data.img;
								}
						});
				}
		}
    $scope.create = function() {
        var admin = new Admin({
            title: this.title,
            content: this.content
        });
        admin.$save(function(response) {
            $location.path('admin/' + response._id);
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(admin) {
        if (admin) {
            admin.$remove();

            for (var i in $scope.admin) {
                if ($scope.admin[i] === admin) {
                    $scope.admin.splice(i, 1);
                }
            }
        }
        else {
            $scope.admin.$remove();
            $location.path('admin');
        }
    };

    $scope.update = function() {
        if($stateParams.form==='create'){
            var admin = new Admin($scope.admin);
            admin.$save(function(response) {
                $('#myModal').modal('hide')
                if($stateParams.page){
                    $state.go('admin.page', {'mode': $stateParams.mode,'page':$stateParams.page});
                }else{
                    $state.go('admin.home', {'mode': $stateParams.mode});
                }
            });
        }else{
            var admin = $scope.admin;
            if (!admin.updated) {
                admin.updated = [];
            }
            admin.updated.push(new Date().getTime());

            admin.$update(function() {
                $('#myModal').modal('hide')
                if($stateParams.page){
                    $state.go('admin.page', {'mode': $stateParams.mode,'page':$stateParams.page});
                }else{
                    $state.go('admin.home', {'mode': $stateParams.mode});
                }
            });
        }
    };

    $scope.find = function() {
        Admin.query(function(admin) {
            $scope.admins = admin;
        });
    };

    $scope.findOne = function() {
        if($stateParams.form==='create'){
            $scope.admin={subs:[]};
        }else{
            Admin.get({
                Id: $stateParams.Id
            }, function(admin) {
                $scope.admin = admin;
            });
        }
    };
    $scope.addSub = function() {
        $scope.admin.subs.push({namecategory:'',urlcategory:''});
    }
    $scope.category = function(){
        $http.get('categoriesadmin').success(function(data){
            $scope.categories=data;
        });
    }
    $scope.slide = function(id,slide,$index) {
        var data={_id:id,slide:slide};
        $http.post('/articlesslide',data).success(function(dat){
            // var index=$scope.testimonies.indexOf({_id});
            $scope.admins[$index].slide=dat.slide;
        });
    }
}]);