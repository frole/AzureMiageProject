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
          .when('/containerList', {
            templateUrl: 'templates/container-list.html',
            controller: 'ContainerListCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
  }]
);