var cluster = require('cluster');
var opts = {
    logDirectory:'./logs',
    fileNamePattern:'<DATE>.log',
    dateFormat:'YYYY.MM.DD'
};
var backblaze = require('./routes/storage_router.js');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

// if (cluster.isMaster) {
//   var numWorkers = require('os').cpus().length;
//   console.log('Master cluster setting up ' + numWorkers + ' workers...');
//   for (var i = 0; i < numWorkers; i++) {
//     cluster.fork();
//   }
//   cluster.on('online', function(worker) {
//     console.log('Worker ' + worker.process.pid + ' is online');
//   });
//   cluster.on('exit', function(worker, code, signal) {
//     console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
//     console.log('Starting a new worker');
//     cluster.fork();
//   });
// } else {
  var app = require('express')();
  var express = require('express');
  app.use(express.static(__dirname + "/client"));
  app.use(bodyParser.json());
  app.use('/storage', require('./routes').storage);
  app.use('/user', require('./routes').users);

  var server = app.listen(port, function() {
    console.log('Process ' + process.pid + ' is listening to all incoming requests');
  });
// }
