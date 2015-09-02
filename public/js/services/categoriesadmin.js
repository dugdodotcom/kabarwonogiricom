'use strict';

//Articles service used for categoriesadmin REST endpoint
angular.module('mean.categoriesadmin').factory('CategoriesAdmin', ['$resource', function($resource) {
    return $resource('categoriesadmin/:Id', {
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