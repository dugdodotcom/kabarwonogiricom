'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global','$state','$stateParams', function ($scope, Global,$state,$stateParams) {
    $scope.global = Global;

    $scope.menu = [{
        'title': 'Categories',
        'link': 'categories'
    }, {
        'title': 'Articles',
        'link': 'articles'
    }, {
        'title': 'Tags',
        'link': 'tags'
    }, {
        'title': 'Infos',
        'link': 'infos'
    }];
    
    $scope.isCollapsed = false;
    $('#myModal').on('hidden.bs.modal', function (e) {
        if($stateParams.page){
            $state.go('admin.page', {'mode': $stateParams.mode,'page':$stateParams.page});
        }else{
            $state.go('admin.home', {'mode': $stateParams.mode});
        }
    })
}]);