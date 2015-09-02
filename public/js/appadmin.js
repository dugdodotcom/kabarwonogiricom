'use strict';

angular.module('mean', ['ngCookies', 'ngResource','ui.router', 'ui.bootstrap', 'mean.system', 'mean.categoriesadmin', 'mean.articlesadmin', 'mean.tagsadmin', 'mean.infosadmin','angularFileUpload','checklist-model','textAngular']);

angular.module('mean.system', []);
angular.module('mean.categoriesadmin', []);
angular.module('mean.articlesadmin', []);
angular.module('mean.tagsadmin', []);
angular.module('mean.infosadmin', []);