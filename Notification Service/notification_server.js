var PROTO_PATH = __dirname + '/protos/notification_service.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
    });
    
var notification = grpc.loadPackageDefinition(packageDefinition).notification;


function getNotification(notificaiton) {
  console.log(notificaiton);
}

function sendNotification(call, callback) {
  callback(null, getNotification(call.request));
}

function getServer() {
  var server = new grpc.Server();
  server.addService(notification.Notification.service, {
    sendNotification: sendNotification,
  });
  return server;
}

var routeServer = getServer();
routeServer.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (err,port) => {
    routeServer.start();
    console.log("Server started, listening on port: " + port);
});

