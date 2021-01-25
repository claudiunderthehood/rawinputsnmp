var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var users = require('./routes/users');
var snmp = require('net-snmp');

var options = {
  port: 206,
  retries: 1,
  timeout: 20000,
  backoff: 1.0, 
  transport: "udp4",
  trapPort: 162, 
  version: snmp.Version2c,
  backwardsGetNexts: true,
  idBitsSize: 32
};

var varbinds = [ {
  oid: "1.3.6.1.2.1.1.1.0",
  type: snmp.ObjectType.Integer,
  value: 1
}]; 

var varbinds1 = [ {
  oid: "1.3.6.1.2.1.1.1.0",
  type: snmp.ObjectType.Integer,
  value: 0
}]; 



let reporter = function(type, ...rest){

};

process.on('uncaughtException', function(err){
    console.error((new Date).toUTCString() + ' uncaughtException: ', err.message);
    console.error(err.stack);

    reporter("uncaughtException", (new Date).toUTCString(), err.message, err.stack);

    process.exit(1);
});

process.on('unhandledRejection', function(reason, promise){
    console.error('unhandledRejection', reason.message || reason);

    reporter("unhandledRejection", (new Date).toUTCString, reason.message || reason);
});




var app = express();
app.use(cors());
app.use(bodyParser.text());
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());


app.post("/api/raw_input", (req, res, next) => {
    console.log(req.body);
    if(req.body == "1"){
      res.send(JSON.stringify("Interruttore aperto"));
      var session = snmp.createSession ("192.168.43.164", "private", options);
        session.set (varbinds, function (error, varbinds) {
            if (error) {
                console.error (error.toString ());
            } else {
                for (var i = 0; i < varbinds.length; i++) {
                
                    console.log (varbinds[i].oid + "|" + varbinds[i].value);
                
                    
                    if (snmp.isVarbindError (varbinds[i]))
                        console.error (snmp.varbindError (varbinds[i]));
                    else
                        console.log (varbinds[i].oid + "|" + varbinds[i].value);
                }
        
                
            }
         });
         
    }else if(req.body == "0"){
      res.send(JSON.stringify("Interruttore chiuso"));
      var session = snmp.createSession ("", "private", options);
      session.set (varbinds1, function (error, varbinds1) {
        if (error) {
            console.error (error.toString ());
        } else {
            for (var i = 0; i < varbinds1.length; i++) {
            
                console.log (varbinds1[i].oid + "|" + varbinds1[i].value);
            
                
                if (snmp.isVarbindError (varbinds1[i]))
                    console.error (snmp.varbindError (varbinds1[i]));
                else
                    console.log (varbinds1[i].oid + "|" + varbinds1[i].value);
            }
    
            
        }
     }); 

    }else{
      res.send(JSON.stringify("Valore non valido, inserire o 0 o 1"));
    }
});


var oids = ["1.3.6.1.2.1.1.2.0"];

var session = snmp.createSession ("192.168.43.164", "private", options);
 session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
    }
    session.close ();
});

app.use('/api/v1/users', users);    

app.use(function(res, req, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});
  
session.trap(snmp.TrapType.LinkDown, function(error) {
    if(error)
        console.error(error);
});


module.exports = app;
