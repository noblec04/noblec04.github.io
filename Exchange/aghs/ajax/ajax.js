/*
aghs.ajax:

provides methods to collect files from the server via the 2 ajax methods post and get, as well as providing an updater function and a specialised JSON receiver
*/

var Ajax = (function() {
	
	aghs.event.add('ajax.load')
					 
  function requestTransport(){
	  return (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
  }
  
  function post(url,f,data){
	  var ob = {};
		if (document.getElementById) {
			var xhttp = requestTransport();
		}
		ob.onload = new aghs.Event();
		ob.onchange = new aghs.Event();
			if (xhttp) {
				xhttp.onreadystatechange = function() {
					ob.onchange.fire(xhttp.readyState)
					if (xhttp.readyState == 4 && xhttp.status == 200) 
					{
						f(xhttp.responseText);
						ob.onload.fire(xhttp.responseText);
						ob.response = xhttp.responseText;
						aghs.event.firevent('ajax.load',xhttp.responseText);
					};
					}
				xhttp.open("POST", url, true);
				xhttp.setRequestHeader("Content-type", data.type);
				var array = [];
				var i = 0;
				for( var bits in data){
					array[i++] = bits + '=' + data[bits];
				}
				
				data = array.join('&');
				xhttp.send(data?data:null);
				
			}
			return ob;
	}

	
	function get(url,f,data){
		if (document.getElementById) {
			var xhttp = requestTransport();
			}
			if (xhttp) {
				xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) 
					{
						f(xhttp.responseText);
						aghs.event.firevent('ajax.load',xhttp.responseText);
					};
					}
				if(data){
				var array = [];
				for( var bits in data){
					array[i++] = bits + '=' + data[bits];
				}
				
				url = url + '?' + array.join('&');	
				}
				xhttp.open("GET", url, true);
				xhttp.send(null);
			}
	}
	
	function json(url,f,data){
		if (document.getElementById) {
			var xhttp = requestTransport();
			}
			if (xhttp) {
				xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) 
					{
						f(eval('('+xhttp.responseText+')'));
					};
					}
				if(data){
				var array = [];
				var i = 0;
				for( var bits in data){
					array[i++] = bits + '=' + data[bits];
				}
				
				url = url + '?' + array.join('&');	
				}
				xhttp.open("GET", url, true);
				xhttp.send(null);
			}
	}
	
	function updater(url,f,int){
		if (document.getElementById) {
			var xhttp = requestTransport();
			}
			if (xhttp) {
				xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) 
					{
						f(xhttp.responseText || xhttp.responseXML);
					};
					}
				xhttp.open("GET", url, true);
				xhttp.send(null);
				var ajaxTimeout = setTimeout(function(){return aghs.ajax.updater(url,f,int)},int)
			}
	}

  
  return {
	get:get,
	post:post,
	json:json,
	updater:updater	
  };
})();

aghs.ajax = Ajax;