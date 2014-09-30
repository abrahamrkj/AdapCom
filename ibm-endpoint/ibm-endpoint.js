//IBM Web Commerce
var endPointURL = "https://192.168.2.156/wcs/resources/store/10101/";
var IMGURL = "192.168.2.156";
//var endPointURL = "http://127.0.0.1/service/";

/* IBM WebCommerce REST methods */

var IBMWebCommerce = {
	/* IBM WebCommerce login method */

    login: function(userName, passWord,request,querystring,callback) {
	    var form = {
		    "logonId": userName,
		    "logonPassword": passWord,
		};
		var formData = JSON.stringify(form);
		var contentLength = formData.length;
			this.doLogin(formData, contentLength,request,function(param){
				callback(param);
			});
    },
    /* IBM WebCommerce get product details methods */

    getProductDetails: function(productID,request,querystring,callback) {
		this.dogetProductDetails(productID, request,function(param){
			callback(param);
		});
    },
    /* IBM WebCommerce add to cart methods */

    addToCart: function(productID, quantity, request,querystring,WCTrustedTocken,WCToken,callback){
    	var orderItem = [];
    	var form = {};
    	form.orderItem = orderItem;
    	var productId = productID;
		var quantity = quantity;
		var orderItems = {
		    "productId": productId,
		    "quantity": quantity 
		}
    	form.orderItem.push(orderItems);
		var formData = JSON.stringify(form);
		var contentLength = formData.length;
		this.doAddToCart(formData, contentLength,request,WCTrustedTocken,WCToken,function(param){
			callback(param);
		});
    },
    /* IBM WebCommerce view cart methods */

    viewCart: function(request,querystring,WCTrustedToken,WCToken,callback) {
		this.doViewCart(request,WCTrustedToken,WCToken,function(param){
			callback(param);
		});
    },

    getPersonDetails: function(request,querystring,WCTrustedToken,WCToken,callback) {
		this.doGetPersonDetails(request,WCTrustedToken,WCToken,function(param){
			callback(param);
		});
    },
    /* IBM WebCommerce remove from cart methods */

    removeFromCart: function(productID, quantity, request,querystring,callback){
    	var orderItem = [];
    	var form = {};
    	form.orderItem = orderItem;
    	var productId = productID;
		var quantity = quantity;
		var orderItems = {
		    "orderItemId": productId,
		    "quantity": quantity 
		}
    	form.orderItem.push(orderItems);
		var formData = JSON.stringify(form);
		var contentLength = formData.length;
		this.doRemoveFromCart(formData, contentLength,request,function(param){
			callback(param);
		});
    },
    /* IBM WebCommerce checkout methods */

    checkOut: function(orderId,request,querystring,WCTrustedTocken,WCToken,amountToPay,callback){
    	 var form = {
		    "orderId": orderId
		 };
		 var formData = JSON.stringify(form);
		 var contentLength = formData.length;
		 this.doCheckOut(formData, contentLength,request,WCTrustedTocken,WCToken,orderId,amountToPay,function(param){
			callback(param);
		 });
    },	
 
    /* Login Delegate */
   
	doLogin: function(formData,contentLength,request,callback){
		request({
				strictSSL: false,
			    headers: {
			      'Content-Length': contentLength,
			      'Content-Type': "application/json"
			    },
			    uri: endPointURL+'loginidentity',
			    body: formData,
			    method: 'POST'
		}, function(err, res, body) {
			
			    callback(body);
			    
		});
	},
    /* Get product details Delegate */

	dogetProductDetails: function(productID, request, callback){
		request({
				strictSSL: false,
			    headers: {
			      'Content-Type': "application/json"
			    },
			    uri: endPointURL+'productview/byId/'+productID,
			    method: 'GET'
		}, function(err, res, body) {
				if (!err && res.statusCode == 200) {
			       callback(body);
			    }
			    else {
			       callback("Unexpected error occurred while getting product details"+err);
			    }  
		});
	},
    /* Add to cart Delegate */

	doAddToCart: function(formData,contentLength,request,WCTrustedToken,WCToken,callback){
		var arr = WCTrustedToken.split("%");
		request({
				strictSSL: false,
			    headers: {
			      'Content-Type': "application/json",
				  'WCTrustedToken': WCTrustedToken,
			      'WCToken': WCToken,
			      'Cookie': 'WC_AUTHENTICATION_'+arr[0]+'='+WCTrustedToken
			    },
			    uri: endPointURL+'cart/',
			    body: formData,
			    method: 'POST'
		}, function(err, res, body) {
			callback(body);
			     
		});
	},
    /* View Cart Delegate */

	doViewCart:function(request,WCTrustedToken,WCToken,callback){
		var arr = WCTrustedToken.split("%");
		request({
				strictSSL: false,
			    headers: {
			      'Content-Type': "application/json",
			      'WCTrustedToken': WCTrustedToken,
			      'WCToken': WCToken,
			      'Host': IMGURL,
			      'Cookie': 'WC_AUTHENTICATION_'+arr[0]+'='+WCTrustedToken
			    },
			    uri: endPointURL+'cart/@self',
			    method: 'GET'
		}, function(err, res, body) {
			  callback(body);
			   
		});
	},

	doGetPersonDetails:function(request,WCTrustedToken,WCToken,callback){
		var arr = WCTrustedToken.split("%");
		request({
				strictSSL: false,
			    headers: {
			      'Content-Type': "application/json",
			      'WCTrustedToken': WCTrustedToken,
			      'WCToken': WCToken,
			      'Host': IMGURL,
			      'Cookie': 'WC_AUTHENTICATION_'+arr[0]+'='+WCTrustedToken
			    },
			    uri: endPointURL+'person/@self',
			    method: 'GET'
		}, function(err, res, body) {
			  callback(body);
			   
		});
	},
    /* Checkout Delegate */

	doCheckOut: function(formData,contentLength,request,WCTrustedToken,WCToken,orderId,amountToPay,callback){
		var arr = WCTrustedToken.split("%");
		
		request({
				strictSSL: false,
			    headers: {
					'Content-Type': "application/json",
					'WCTrustedToken': WCTrustedToken,
				    'WCToken': WCToken,
				    'Cookie': 'WC_AUTHENTICATION_'+arr[0]+'='+WCTrustedToken
			    },
			    uri: endPointURL+'cart/@self/payment_instruction',
			    body: "",
			    method: 'GET'
		}, function(err, res, body) {
			console.log("inside #1"+amountToPay);
				var formDataSetPayment = {
					"billing_address_id" : "16251",
					"expire_month" : "12",
				   "piAmount" : amountToPay,
				   "payMethodId" : "VISA",
				   "cc_brand" : "VISA",
				   "expire_year" : "2021",
				   "account" : "4111111111111111"
				};
				request({
						strictSSL: false,
					    headers: {
							'Content-Type': "application/json",
							'WCTrustedToken': WCTrustedToken,
						    'WCToken': WCToken,
						    'Cookie': 'WC_AUTHENTICATION_'+arr[0]+'='+WCTrustedToken
					    },
					    uri: endPointURL+'cart/@self/payment_instruction',
					    body: JSON.stringify(formDataSetPayment),
					    method: 'POST'
				}, function(err, res, body) {
					console.log("resp for payment instruction: "+body);
					request({
								strictSSL: false,
							    headers: {
									'Content-Type': "application/json",
									'WCTrustedToken': WCTrustedToken,
								    'WCToken': WCToken,
								    'Cookie': 'WC_AUTHENTICATION_'+arr[0]+'='+WCTrustedToken
							    },
							    uri: endPointURL+'cart/@self/precheckout',
							    body: formData,
							    method: 'PUT'
						}, function(err, res, body) {
							console.log("pre checkout called for:"+body);
									var arr = WCTrustedToken.split("%");
									request({
											strictSSL: false,
										    headers: {
												'Content-Type': "application/json",
												'WCTrustedToken': WCTrustedToken,
											    'WCToken': WCToken,
											    'Cookie': 'WC_AUTHENTICATION_'+arr[0]+'='+WCTrustedToken
										    },
										    uri: endPointURL+'cart/@self/checkout',
										    body: formData,
										    method: 'POST'
									}, function(err, res, body) {
											  callback(body);
									});
						});
			});
});

	},
    /* Remove from Delegate */

	doRemoveFromCart: function(formData,contentLength,request,callback){
		request({
			    headers: {
			      'Content-Length': contentLength,
			      'Content-Type': "application/json"
			    },
			    uri: endPointURL+'cart/@self/',
			    body: formData,
			    method: 'PUT'
		}, function(err, res, body) {
				if (!err && res.statusCode == 201) {
			       callback(body);
			    }
			    else {
			       callback("Unexpected error occurred while removing product from cart");
			    }  
		});
	}
};

