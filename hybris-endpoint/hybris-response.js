//HybrisECommerce
//var endPointURL = "http://192.168.210.204/wcs/resources/store/10151/";
var endPointURL1 = "http://127.0.0.1/service/";

var HybrisECommerce = {
    login: function(userName, passWord,request,querystring,callback) {
	    var form = {
		    "logonId": userName,
		    "logonPassword": passWord,
		};
		var formData = querystring.stringify(form);
		var contentLength = formData.length;
			this.doLogin(formData, contentLength,request,function(param){
				callback(param);
			});
    },
    getProductDetails: function(productID,request,querystring,callback) {
		dogetProductDetails(productID, request,function(param){
			callback(param);
		});
    },
    addToCart: function(productID, quantity, request,querystring,callback){
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
		var formData = querystring.stringify(form);
		var contentLength = formData.length;
		this.doAddToCart(formData, contentLength,request,function(param){
			callback(param);
		});
    },
    viewCart: function(request,querystring,callback) {
		this.doViewCart(request,function(param){
			callback(param);
		});
    },
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
		var formData = querystring.stringify(form);
		var contentLength = formData.length;
		this.doRemoveFromCart(formData, contentLength,request,function(param){
			callback(param);
		});
    },
    checkOut: function(orderId,request,querystring,callback){
    	 var form = {
		    "orderId": orderId
		 };
		 var formData = querystring.stringify(form);
		 var contentLength = formData.length;
		 this.doCheckOut(formData, contentLength,request,function(param){
			callback(param);
		 });
    },	    
	doLogin: function(formData,contentLength,request,callback){
		//Hybris specific login method
	},
	dogetProductDetails: function(productID, request, callback){
		//Hybris specific get product details method
	},
	doAddToCart: function(formData,contentLength,request,callback){
		//Hybris specific add to cart method
	},
	doViewCart:function(request, callback){
		//Hybris specific view cart method
	},
	doCheckOut: function(formData,contentLength,request,callback){
		//Hybris specific checkout method
	},
	doRemoveFromCart: function(formData,contentLength,request,callback){
		//Hybris specific remove from cart method
	}
};