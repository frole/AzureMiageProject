var request = require('request')
var express = require('express')
var azure = require('azure');

var app = express();

app.get('/', function(req, res) {

  var url = "https://ussouthcentral.services.azureml.net/workspaces/fc2c031447724330b0191d8d28f40b8c/services/4f5ac2ab935c4dd8a72f68f5d0b3ca26/jobs"

  var storage_account_name = <storage_account_name>
  var storage_account_key = <storage_account_key>
  var storage_container_name = <storage_container_name>
  var input_blob_name = <file>

  var connection_string = "DefaultEndpointsProtocol=https;AccountName=" + storage_account_name + ";AccountKey=" + storage_account_key
  var input_blob_path = "/" + storage_container_name + "/" + input_blob_name

  var input = {

    "Input": {
      "ConnectionString": connection_string,
      "RelativeLocation": input_blob_path
    },
    "GlobalParameters": {}
  }

  var myheaders = {
    "Authorization": "Bearer <keyService>",
    "Content-Type": "application/json;charset=utf-8"
  }

  var options = {
    uri: url,
    method: 'POST',
    headers: myheaders,
    json: true,
    body: input
  };

  request(options, function(error, response, body) {
    console.log(JSON.stringify(body));
    var job_id = body;
    var job_url = url + "/" + job_id;

    var options2 = {
      uri: job_url,
      method: 'GET',
      headers: myheaders,
      json: true,
    };

    request(options2, function(error, response, body) {
      console.log(JSON.stringify(job_url));
      console.log(JSON.stringify(body));
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(body));
    });
  });

});

app.listen(8080);