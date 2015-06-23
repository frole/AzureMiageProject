var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var streamifier = require('streamifier');

// Get Azure Dependencies
var azure = require('azure-storage')
var blobService = azure.createBlobService();

// Handling of static files
app.use(express.static('../client'));

app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json

// List container
app.get('/containers/:name', function (req, res) {
    var mycontainer = req.param('name');
    console.log('List container ' + mycontainer);
    blobService.listBlobsSegmented(mycontainer, null, function(error, result, response) {
        if(error == null) {
            console.log('OK List container ' + mycontainer);
            res.json(result.entries);
        }
        else {
            console.log('Error on List container ' + mycontainer);
            res.status(400);
            res.send(JSON.stringify(error));
        }
    });
});

// Create blob
app.post('/containers/:name/blobs', function (req, res) {
    var mycontainer = req.param('name');
    var buffer = new Buffer(req.body.blobContent, 'base64');
    var stream = streamifier.createReadStream(buffer);
    blobService.createBlockBlobFromStream(mycontainer, req.body.blobName, stream, buffer.length, function(error, result, response) {
        if(error == null) {
            console.log('OK Import blob into container ' + mycontainer);
            res.status(201);
            res.send();
        }
        else {
            console.log('Error Import blob into container ' + mycontainer);
            res.status(400);
            res.send(JSON.stringify(error));
        }
    });
});

// Get blob
app.get('/containers/:containerName/blobs/:blobName', function (req, res) {
    var containerName = req.param('containerName');
    var blobName = req.param('blobName');
    // Does not work with binary
    blobService.getBlobToText(containerName, blobName, function(error, result, response) {
        if(error == null) {
            console.log('OK get blob ' + blobName);
            res.json(result);
        }
        else {
            console.log('Error on get blob ' + blobName);
            res.status(400);
            res.send(JSON.stringify(error));
        }
    });
});

// Execute Job
app.post('/containers/:containerName/blobs/:blobName/executionJob', function(req, res) {
    var url = 'https://ussouthcentral.services.azureml.net/workspaces/fc2c031447724330b0191d8d28f40b8c/services/4f5ac2ab935c4dd8a72f68f5d0b3ca26/jobs'
    var containerName = req.param('containerName');
    var blobName = req.param('blobName');
    var connection_string = 'DefaultEndpointsProtocol=https;AccountName=biodata2;AccountKey=sQuBfDy7Eff+Jj1j29oWtpzeY08ABSY0V6tnk5sdizEbSFzGAJ00gJgCkdd3FuNPyK4SazoN2XIKEj5uTQDr+A=='
    var input_blob_path = '/' + containerName + '/' + blobName
    var input = {
        "Input": {
            "ConnectionString": connection_string,
            "RelativeLocation": input_blob_path
        },
        "GlobalParameters": {}
    }

    var myheaders = {
        "Authorization": 'Bearer wo0NT7r6O+zbNt+99ft/vviE/14kKvp8qTHG26mnIYVMwFa2IgcwM3E6aifuWk8s0PR93T3/Zf84QRUykKmO5w==',
        "Content-Type": 'application/json;charset=utf-8'
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
        var job_url = url + '/' + job_id;

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
    

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);

});