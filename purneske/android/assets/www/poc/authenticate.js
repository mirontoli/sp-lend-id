if (typeof XMLHttpRequest == "undefined")
  XMLHttpRequest = function () {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
      catch (e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
      catch (e) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP"); }
      catch (e) {}
    //Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
    throw new Error("This browser does not support XMLHttpRequest.");
};


var buildSamlRequest = function (saml, params) {
    var key

    for (key in params) {
        saml = saml.replace('[' + key + ']', params[key])
    }

    return saml;
};

function submitAnotherForm(responseText, callback) {
	var form = $(responseText).filter("form");
	var action = form.attr("action");
	console.log("action: " + action);
	var t = form.find("input");
	var value = t.val();
	console.log("value: " + value);
	
	
	
	
	    $.ajax({
	        url: action,//"http://abutaleb.se/_layouts/Authenticate.aspx",// action,
	        dataType: 'text',
	        type:'POST',
	        data: {t: value},
	        headers: {
	            'User-Agent':  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)',
	        },
	        success: function(result, textStatus, jqXHR) {
	            console.log('result submitForm '+result);
	            var c = jqXHR.getResponseHeader('set-cookie');
	            console.log("response header. set-cookie: " + c);
	            console.log("responseText: " + jqXHR.responseText);
	            
	            console.log("get all headers");
	            var headers = jqXHR.getAllResponseHeaders();
	            console.log(headers);
	            callback();
	        },
	        error:function (jqXHR, textStatus, errorThrown){
	            console.log(errorThrown+'error submitAnotherForm:' + jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus) {
	            console.log('submitAnotherForm completed ' + textStatus);
	        }
	    });


    console.log('end submitForm' );
}

function submitForm(responseText, callback) {
	//http://stackoverflow.com/a/11651778/632117
	var form = $(responseText).filter("form");
	var action = form.attr("action");
	console.log("action: " + action);
	var t = form.find("#t");
	var value = t.val();
	console.log("value: " + value);
	
	
	
	
	    $.ajax({
	        url: action,//"http://abutaleb.se/_layouts/Authenticate.aspx",// action,
	        dataType: 'text',
	        type:'POST',
	        data: value, //{t: value},
	        headers: {
	            'User-Agent':  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)',
	        },
	        success: function(result, textStatus, jqXHR) {
	            console.log('result submitForm '+result);
	            var c = jqXHR.getResponseHeader('set-cookie');
	            console.log("response header. set-cookie: " + c);
	            console.log("responseText: " + jqXHR.responseText);
	            
	            console.log("get all headers");
	            var headers = jqXHR.getAllResponseHeaders();
	            console.log(headers);
	            submitAnotherForm(jqXHR.responseText, callback);
	        },
	        error:function (jqXHR, textStatus, errorThrown){
	            console.log(errorThrown+'error submitForm:' + jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus) {
	            console.log('submitForm completed ' + textStatus);
	        }
	    });


    console.log('end submitForm' );
}
function submitToken(params, callback) {
	//todo more generic url parsing!
	console.log(params.token);
	var token = params.token,
		url = params.url.replace("/teamsite", "") + "/_layouts/Authenticate.aspx"; // '/_forms/default.aspx?wa=wsignin1.0'; 
		console.log(url);
	var xhr = new XMLHttpRequest();
	function onStateChange() {
		console.log("onStateChange");
	  if (xhr.readyState == 4) {
	  	console.log("readyState = 4");
	    if (xhr.status == 200) {
	    	console.log("status 200");
            var c = xhr.getResponseHeader('set-cookie');
            console.log("response header. set-cookie: " + c);
            console.log("responseText: " + xhr.responseText);
            submitForm(xhr.responseText, callback);
	    }
	  }
	}

	xhr.open("POST", url, true);
	xhr.onreadystatechange = onStateChange;
	xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8")
	//xhr.setRequestHeader("Accept", "application/x-www-form-urlencoded");
	xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)');
	xhr.send(token);

    console.log('end wsignin' );	
}


function requestToken(params, callback) {
	function success() { alert("success"); };
	function fail() { alert("failed"); };
	function takeText(text) {
		var sts = 'https://login.microsoftonline.com/extSTS.srf',
			saml = buildSamlRequest(text, params);
	    $.ajax({
	        url: sts,
	        dataType: 'text',
	        type:'POST',
	        data: saml,
	        headers: {
	            Accept : "application/soap+xml; charset=utf-8",
	        },
	        success: function(result, textStatus, jqXHR) {
	            console.log('result '+result);
	            var token= $(result).find( "wsse\\:BinarySecurityToken" ).text(),
	            	options = { token: token, url: params.endpoint };
	            submitToken(options, callback);
	        },
	        error:function (jqXHR, textStatus, errorThrown){
	            console.log(errorThrown+'error login:' + jqXHR.responseText);
	        },
	        complete:function(jqXHR, textStatus) {
	            console.log('login completed ' + textStatus);
	        }
	    });
	}
	$.ajax({
		url: "./SAML.xml",
		dataType: "text",
		success: takeText,
		error: fail
	});
}


function signin(username, password, callback) {
    var self = this;

    var options = {
        username: username,
        password: password,
        endpoint: self.url// + self.login
    }
	
    requestToken(options, callback);
}

// constructor for REST service
var SP = {};
SP.RestService = function (url) {
	this.url = url;

    // Form to submit SAML token
    this.login = '/_forms/default.aspx?wa=wsignin1.0';
};

SP.RestService.prototype = {
    signin: signin
};
