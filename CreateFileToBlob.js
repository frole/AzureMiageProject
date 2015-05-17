var request = require('request')
var express = require('express')
var azure = require('azure-storage');

//Create Environnement Variables : AZURE_STORAGE_ACCOUNT / AZURE_STORAGE_ACCOUNT_KEY

var mycontainer = 'ppdazureml'
var myblob = 'projetazureml'
var myfile = 'InputForAdultCensusWS-without-target.csv'
var blobService = azure.createBlobService();

blobService.createBlockBlobFromLocalFile(mycontainer, myblob , myfile , function(error, result, response){
  if(!error){
 		console.log(JSON.stringify(result));
 		console.log(JSON.stringify(response));
  }
      console.log(JSON.stringify(error));
});
