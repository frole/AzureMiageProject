var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var streamifier = require('streamifier');
var request = require('request');
var process = require('process');

// Get Azure Dependencies
var azure = require('azure-storage')
var blobService = azure.createBlobService();

// Handling of static files
app.use(express.static('../client'));

app.use(bodyParser.json({
    limit: '50mb'
})); // for parsing application/json

// List container
app.get('/containers/:name', function(req, res) {
    var mycontainer = req.param('name');
    console.log('List container ' + mycontainer);
    blobService.listBlobsSegmented(mycontainer, null, function(error, result, response) {
        if (error == null) {
            console.log('OK List container ' + mycontainer);
            res.json(result.entries);
        } else {
            console.log('Error on List container ' + mycontainer);
            res.status(400);
            res.send(JSON.stringify(error));
        }
    });
});

// Create blob
app.post('/containers/:name/blobs', function(req, res) {
    var mycontainer = req.param('name');
    var buffer = new Buffer(req.body.blobContent, 'base64');
    console.log(buffer.length);
    var stream = streamifier.createReadStream(buffer);
    blobService.createBlockBlobFromStream(mycontainer, req.body.blobName, stream, buffer.length, function(error, result, response) {
        if (error == null) {
            console.log('OK Import blob into container ' + mycontainer);
            res.status(201);
            res.send();
        } else {
            console.log('Error Import blob into container ' + mycontainer);
            res.status(400);
            res.send(JSON.stringify(error));
        }
    });
});

// Get blob
app.get('/containers/:containerName/blobs/:blobName', function(req, res) {
    var containerName = req.param('containerName');
    var blobName = req.param('blobName');

    blobService.getBlobToStream(containerName, blobName, res, function() {
        console.log('getBlobToStream callback!');
    });

});

// Execute Job
app.post('/containers/:containerName/blobs/:blobName/executeJob', function(req, res) {

    var url = "https://ussouthcentral.services.azureml.net/workspaces/fc2c031447724330b0191d8d28f40b8c/services/4f5ac2ab935c4dd8a72f68f5d0b3ca26/jobs";

    var storage_account_name = process.env.AZURE_STORAGE_ACCOUNT;
    var storage_account_key = process.env.AZURE_STORAGE_ACCESS_KEY;
    var storage_container_name = req.param('containerName');
    var input_blob_name = req.param('blobName');

    var connection_string = "DefaultEndpointsProtocol=https;AccountName=" + storage_account_name + ";AccountKey=" + storage_account_key
    var input_blob_path = "/" + storage_container_name + "/" + input_blob_name

    var input = {
        "Input": {
            "ConnectionString": connection_string,
            "RelativeLocation": input_blob_path
        },
        "Outputs": {
            "output1": {
                "ConnectionString": connection_string,
                "RelativeLocation": "/" + storage_container_name + "/output1results.csv"
            },
        },
        "GlobalParameters": {}
    }

    var myheaders = {
        "Authorization": "Bearer <key>",
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

        res.send(JSON.stringify({
            job: {
                id: job_id,
                url: job_url
            }
        }));
    });

});

app.get('/jobs/:jobId', function(req, res) {
    var jobId = req.param('jobId');
    var myheaders = {
        "Authorization": "Bearer <key>",
        "Content-Type": "application/json;charset=utf-8"
    };
    var options2 = {
        uri: 'https://ussouthcentral.services.azureml.net/workspaces/fc2c031447724330b0191d8d28f40b8c/services/4f5ac2ab935c4dd8a72f68f5d0b3ca26/jobs/' + jobId,
        method: 'GET',
        headers: myheaders,
        json: true,
    };

    console.log('Request to: https://ussouthcentral.services.azureml.net/workspaces/fc2c031447724330b0191d8d28f40b8c/services/4f5ac2ab935c4dd8a72f68f5d0b3ca26/jobs/' + jobId);
    request(options2, function(error, response, body) {
        console.log(JSON.stringify(body));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
    });
});


var server = app.listen(3000, function() {

    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);

});