'use strict';

//Articles service used for tagsadmin REST endpoint
angular.module('mean.tagsadmin').factory('TagsAdmin', ['$resource', function($resource) {
    return $resource('tagsadmin/:Id', {
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