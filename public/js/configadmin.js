'use strict';

//Setting up route
angular.module('mean').config(['$urlRouterProvider','$stateProvider',
    function($urlRouterProvider,$stateProvider){
        $urlRouterProvider.otherwise('/admin/articles');
        $stateProvider.state('admin', {
            url: '/admin',
            templateUrl: '/views/admins/index.html'
        })
        .state('admin.home', {
            url: '/:mode',
            templateUrl:function (stateParams){
                return '/views/admins/'+stateParams.mode+'/page.html';
            }
        })
        .state('admin.page', {
            url: '/:mode/page/{page:[0-9]{1,8}}',
            templateUrl:function (stateParams){
                return '/views/admins/'+stateParams.mode+'/page.html';
            }
        })
        .state('admin.page.edit', {
            url: '/:form',
            views: {
                'modal@': {
                    templateUrl:
                        function (stateParams) {
                          $('#myModal').modal('toggle');
                          return '/views/admins/'+stateParams.mode+'/edit.html';
                        }
                }
            }
        })
        .state('admin.page.edit.id',{
            url: '/:id'
        }).state('admin.home.edit', {
            url: '/:form',
            views: {
                'modal@': {
                    templateUrl:
                        function (stateParams) {
                          $('#myModal').modal('toggle');
                          return '/views/admins/'+stateParams.mode+'/edit.html';
                        }
                }
            }
        })
        .state('admin.home.edit.id',{
            url: '/:id'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);