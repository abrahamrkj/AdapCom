/* 
File name: app.js
Server: Node JS
*/

var fs = require('fs');
var express = require('express');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var request = require('request');
var nconf = require('nconf');

nconf.argv()
       .env()
       .file({ file: './static/config.json' });

function include(f) {
  eval.apply(global, [fs.readFileSync(f).toString()]);
}
var log4js = require('log4js'); 
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/adapCom.log'), 'adapCom');

var logger = log4js.getLogger('adapCom');

/* Include various web commerce endpoints which supports REST services */

include('ibm-endpoint/ibm-endpoint.js');
include('ibm-endpoint/ibm-response.js');
include('hybris-endpoint/hybris-endpoint.js');
include('hybris-endpoint/hybris-response.js');

/* MongoDB Connection */

var databaseUrl = "ikartdbuser:ikartdbuser@localhost/ikart"; 
var collections = ["users", "productmapping"]
var db = require("mongojs").connect(databaseUrl, collections);

/* HTTP Server (Port: 3000) */

var app = express();
var server = http.createServer(app);


app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use("/css", express.static(__dirname + '/static/css'));
app.use("/js", express.static(__dirname + '/static/js'));
app.use("/images", express.static(__dirname + '/static/images'));
app.use("/logs", express.static(__dirname + '/logs'));
/* HTTPS SSL Support (Port:443) */

var secureOptions = {
  key: fs.readFileSync('ssl/key.pem'),
  cert: fs.readFileSync('ssl/cert.pem')
};
var httpsServer = https.createServer(secureOptions, app);

/* Special character escaping for json */

function jsonEscape(str)  {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
}

/* Adapter factory declarations */

var adapterFactory = {
    doIBMWebCommerce: function() {
        return IBMWebCommerce;
    },
    doHybris: function(){
    	return HybrisECommerce;
    }
};

/* Creation of adapterObject */

var adapterObject = adapterFactory.doIBMWebCommerce();
var ResponseFormat = IBMResponseFormat;

/* Mapping for Login request */

var WCTrustedTocken = "";
var WCToken = "";
var cookieSession = require('cookie-session');
var userIp = "x.x.x.x";

app.get('/login', function(req, res) {
  logger.debug('Login method initiated '+'['+userIp+']');
  var kartid= req.query.kartId;
	adapterObject.login(req.query.username,req.query.password,request,querystring,function(params){
          if(JSON.parse(params).errors){
           
           }
           else{
            WCTrustedTocken = JSON.parse(params).WCTrustedToken;   
            var arr = WCTrustedTocken.split("%");     
            WCToken = JSON.parse(params).WCToken;
            add(req.query.username,WCTrustedTocken,WCToken,kartid);
           }
          
    	  res.send(params);
        res.end();
	});   
});

/* Mapping for get product details request */

app.get('/getProductDetails', function(req, res) {
  logger.debug('getProductDetails method initiated '+'['+userIp+']');
  	adapterObject.getProductDetails(req.query.pid,request,querystring,function(params){
    	  res.send(params);
        res.end();
    });
});

/* Mapping for add to cart request */

app.get('/addToCart', function(req, res) {
  logger.debug('addToCart method initiated '+'['+userIp+']');
console.log("called");
console.log("called #2");
    
  db.users.find({cartId: req.query.kartid, flag: "1" }, function(err, users) {
    if( err || !users) console.log("No users found");
    else users.forEach( function(user) {
      console.log("key: "+user.key1);

      db.productmapping.find({rfid: req.query.pid }, function(err, users) {
    if( err || !users) console.log("No products found");
    else users.forEach( function(pdt) {

console.log("key: "+user.key1);
console.log("pdtid:"+pdt.pid);
      adapterObject.addToCart(pdt.pid,req.query.quantity,request,querystring,user.key1,user.key2,function(params){
     //   res.send(params);
        
    });

    });


    });

    });
  });
  res.end();
	
});

/* Mapping for remove from cart request */

app.get('/removeFromCart', function(req, res) {
  logger.debug('removeFromCart method initiated '+'['+userIp+']');
    adapterObject.removeFromCart(req.query.pid,req.query.quantity,request,querystring,WCTrustedTocken,WCToken,function(params){
    	  res.send(params);
        res.end();
    });
});

/* Mapping for view cart request */

app.get('/viewCart', function(req, res) {
  logger.debug('viewCart method initiated '+'['+userIp+']');
    adapterObject.viewCart(request,querystring,WCTrustedTocken,WCToken,function(params){
    	  res.send(params);
        res.end();
    });
});

app.get('/getPersonDetails', function(req, res) {
  logger.debug('get Person Details method initiated '+'['+userIp+']');
   adapterObject.getPersonDetails(request,querystring,WCTrustedTocken,WCToken,function(params){
        res.send(params);
        res.end();
    });
});

/* Mapping for checkout request */

app.get('/checkOut', function(req, res) {
  logger.debug('checkOut method initiated '+'['+userIp+']');
    adapterObject.checkOut(req.query.orderId,request,querystring,WCTrustedTocken,WCToken,req.query.amount,function(params){
    	  res.send(params);
        update(req.query.userId);
        res.end();
    });
});

/* Mapping for default request */

app.get('/admin', function(req, res) {
  logger.debug('admin method initiated '+'['+userIp+']');
    res.render('index',
  		{ title : 'Home' }
    );
});

app.get('/addProductWithRFID', function(req, res) {
  logger.debug('Add product RFID method initiated '+'['+userIp+']');
  var doc={pid:req.query.pid,rfid:req.query.rfid};

   db.productmapping.save(doc,function(err,result){
    if(err){
    console.log("error in adding to db");
    }
    });
    res.send("Success");
    res.end();
});

/* Mapping for default request */

app.get('/', function(req, res) {
    res.send("iKart service running "+'['+userIp+']');
    res.end();
});

server.listen(nconf.get('httpPort'));
httpsServer.listen(443);
logger.debug('Server Initiated ');
logger.debug('HTTP Server Initiated on port: '+nconf.get('httpPort')+''+'['+userIp+']');

function sendResponse(json,handler,object){
    var arr = object[handler]().split(",");
    var arr_length = arr.length;
    var returnJson = {};
    for (var i = 0; i < arr_length; i++) {
       var new_arr = arr[i].split('|');
       returnJson[new_arr[0]] = json[new_arr[1]];
    }
    return JSON.stringify(returnJson);
}

function add(userId,key1,key2,cartId){
    var doc={userId:userId,key1:key1,key2:key2,cartId:cartId,flag:"1"};
    db.users.save(doc,function(err,result){
    if(err){
    console.log("error in adding to db");
    }
    });
}

function update(uId){
  console.log("Userid for update:" + uId);
   db.users.update(
    { userId:uId },{ $set: { flag: "0" } }
    );

}

function deleteUser(){
    db.users.remove({'flag':'0'},function(err,result){if(err){
    console.log("error in deleting from db");
    }});
}