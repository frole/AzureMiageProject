angular.module('ppdazureml').service('ContainerService', ['$http', 
 function ($http) {
    
     this.listContainer = function (containerName) {
         return $http.get('/containers/' + containerName);
     };
     
     this.createBlob = function (containerName, blobName, blobContent) {
         var postData = {
             blobName: blobName,
             blobContent: blobContent
         };
         return $http.post('/containers/' + containerName + '/blobs', postData);
     };
     
     this.getBlob = function (containerName, blobName) {
         return $http.get('/containers/' + containerName + '/blobs/' + blobName);
     };
     
 }]
);