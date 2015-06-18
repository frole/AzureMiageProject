angular.module('ppdazureml').controller('ContainerListCtrl', ['$scope', 'ContainerService',
    function ($scope, ContainerService) {    
    
        $scope.error = null;
        $scope.containerName = '';
        $scope.loadedContainerName = null;
        $scope.entries = [];
        
        $scope.listContainer = function () {
            $scope.error = null;
            ContainerService.listContainer($scope.containerName)
                .success(function (data) {
                    $scope.loadedContainerName = $scope.containerName;
                    $scope.entries = data;
                })
                .error(function (data) {
                    $scope.error = data.code;
                });
        };
        
        function base64toBlob(base64Data, contentType) {
            contentType = contentType || '';
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);

            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);

                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, { type: contentType });
        }
        
        $scope.downloadEntry = function (entry) {
            ContainerService.getBlob($scope.loadedContainerName, entry.name)
                .success(function (data) {
                    console.log(data);
                    try {
                        var blob = base64toBlob(data);
                        saveAs(blob, entry.name);
                    }
                    catch(e) {
                        console.log(e);
                        // Try blob text
                        var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
                    }
                })
                .error(function (data) {
                    console.error(data);
                });
        };
        
    }]
);