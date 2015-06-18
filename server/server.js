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

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);

});