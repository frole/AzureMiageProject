angular.module('ppdazureml').controller('ImportBlobCtrl', ['$scope', 'ContainerService',
    function ($scope, ContainerService) {    
        
        $scope.error = null;
        $scope.status = 'form';
        $scope.loadedFile = null;
        
        $scope.loadFile = function (file) {
            $scope.loadedFile = file;
        };
        
        $scope.importBlob = function () {
            $scope.error = null;
            ContainerService.createBlob($scope.containerName, $scope.blobName, $scope.loadedFile.content)
                .success(function (data) {
                    $scope.status = 'success';
                })
                .error(function (data) {
                    $scope.error = data.code;
                });
        };
        
    }]
);