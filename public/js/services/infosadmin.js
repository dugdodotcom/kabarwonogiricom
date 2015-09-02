'use strict';

//Articles service used for infosadmin REST endpoint
angular.module('mean.infosadmin').factory('InfosAdmin', ['$resource', function($resource) {
    return $resource('infosadmin/:Id', {
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