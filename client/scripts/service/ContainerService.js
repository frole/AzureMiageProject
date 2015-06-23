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
     
     this.executeJob = function (containerName, blobName) {
         var postData = {
             containerName : containerName,
             blobName: blobName
         };
         console.log('OK Service');
         return $http.post('/containers/' + containerName + '/blobs/' + blobName + '/executeJob', postData);
     };
     
     this.getJob = function (jobId) {
         return $http.get('/jobs/' + jobId);
     };
     
 }]
);