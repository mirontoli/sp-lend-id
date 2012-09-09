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

function submitToken(params, callback) {
	//todo more generic url parsing!
	var token = params.token,
		url = params.url.replace("teamsite", "") + '/_forms/default.aspx?wa=wsignin1.0'; 
	var xhr = new XMLHttpRequest();
	function onStateChange() {
	  if (xhr.readyState == 4) {
	    if (xhr.status == 200) {
            var c = xhr.getResponseHeader('set-cookie');
            console.log("response header. set-cookie: " + c);
            callback();
	    }
	  }
	}

	xhr.open("POST", url, true);
	xhr.onreadystatechange = onStateChange;
	xhr.setRequestHeader("Accept", "application/x-www-form-urlencoded");
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
        endpoint: self.url
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
