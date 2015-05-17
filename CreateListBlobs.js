var request = require('request')
var express = require('express')
var azure = require('azure-storage');

var mycontainer = 'ppdazureml'

var blobService = azure.createBlobService();

blobService.listBlobsSegmented(mycontainer, null, function(error, result, response){
  if(!error){
        console.log(JSON.stringify(result));
        console.log(JSON.stringify(response));
  }
      console.log(JSON.stringify(error));
});