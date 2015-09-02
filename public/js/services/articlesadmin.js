'use strict';

//Articles service used for articlesadmin REST endpoint
angular.module('mean.articlesadmin').factory('ArticlesAdmin', ['$resource', function($resource) {
    return $resource('articlesadmin/:Id', {
        Id: '@Id'
    }, {
        update: {
            method: 'PUT'
        },
        remove:{
            method:'DELETE'
        }
    });
}]);