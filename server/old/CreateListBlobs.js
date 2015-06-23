var request = require('request')
var express = require('express')
var azure = require('azure-storage')
var http = require("http");

var mycontainer = 'ppdazureml'

var blobService = azure.createBlobService();

blobService.listBlobsSegmented(mycontainer, null, function(error, result, response) {
    if (!error) {
        function onRequest(request, response) {
            console.log("Requête reçue.");
            response.writeHead(200, {
                "Content-Type": "text/plain"
            });
            response.write(JSON.stringify(result));
            response.end();
        }
        http.createServer(onRequest).listen(8888);
        console.log("Démarrage du serveur.");
    }
    console.log(JSON.stringify(error));
});


//jQuery('CreateTable').ready(function() {
//    var json = result
//    var tr;
//    for (var i = 0; i < json[0].entries.length; i++) {
//        tr = $('<tr/>');
//        tr.append("<td>" + json[0].entries[i].name + "</td>");
//        tr.append("<td>" + json[0].entries[i].properties['last-modified'] + "</td>");
//        tr.append("<td>" + json[0].entries[i].properties['content-length'] + "</td>");
//        $('table').append(tr);
//    }
//});