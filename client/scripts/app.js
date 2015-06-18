angular.module('ppdazureml', [
    'ngRoute',
    'angularFileInput'
])
.config(['$routeProvider',
  function($routeProvider) {
      $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html'
          })
          .when('/importBlob', {
            templateUrl: 'templates/import-blob.html',
            controller: 'ImportBlobCtrl'
          })
          .when('/exportBlob', {
            templateUrl: 'templates/export-blob.html',
            controller: 'ExportBlobCtrl'
          })
          .when('/containerList', {
            templateUrl: 'templates/container-list.html',
            controller: 'ContainerListCtrl'
          })
          .when('/executeJob', {
            templateUrl: 'partials/execute-job.html',
            controller: 'ExecuteJobCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
  }]
);