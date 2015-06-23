angular.module('ppdazureml').controller('ContainerListCtrl', ['$scope', 'ContainerService', '$interval',
    function($scope, ContainerService, $interval) {

        $scope.error = null;
        $scope.containerName = '';
        $scope.loadedContainerName = null;
        $scope.entries = [];

        $scope.listContainer = function() {
            $scope.error = null;
            ContainerService.listContainer($scope.containerName)
                .success(function(data) {
                    $scope.loadedContainerName = $scope.containerName;
                    $scope.entries = data;
                })
                .error(function(data) {
                    $scope.error = data.code;
                });
        };

        $scope.executeJob = function(entry) {
            entry.running = true;
            entry.job = null;
            $scope.error = null;
            console.log('OK Ctrl');
            ContainerService.executeJob($scope.containerName, entry.name)
                .success(function(data) {
                    entry.job = data.job;
                    entry.job.status = 0;
                    var interval;
                    // check periodically for job status
                    interval = $interval(function () {
                        ContainerService.getJob(entry.job.id)
                            .success(function (jobData) {
                                console.log(jobData);
                                entry.job.status = jobData.StatusCode;
                                entry.job.result = jobData.Result;
                                if(jobData.StatusCode >= 2) {
                                    $interval.cancel(interval);
                                    entry.running = false;
                                }
                            });
                    }, 2000);
                })
                .error(function(data) {
                    $scope.error = data.code;
                });
        };

    }
]);