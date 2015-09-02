'use strict';

//AdminCategories service used for admincategorie REST endpoint
angular.module('mean.admin').factory('Admin', ['$resource','$stateParams','$state', function($resource,$stateParams,$state) {
    return $resource($stateParams.mode+'admin/:Id', {
        Id: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);