/*
aghs.io
this file is integrated with the PHP file in the same folder, which together provide access to files and databases on the server, safety is an issue, so sensitive information should never utilise these functions to be transferres. However these functions were more of a proof of concept to myself.
*/

aghs.io={};
aghs.extend(aghs.io,(function(){
	
	function getFileType(file){
		var z = file.split('.');
		var y = z[z.length-1];
		switch(y){
			case 'js':return 'javascript';break;
			case 'htm','html': return 'html';break;
			case 'as': return 'actionscript';break;
			case 'swf': return 'shockwave file';break;
			case 'txt': return 'text file';break;
			default:return null;break;
			}
	};
	
	function appendTo(file,data){
		data = escape(data);
		var p = []
		for(var i = 1; i<11;i++){
			p[i]=i;
		}
		pass = p.join('');
		var url = 'aghs/filesystem/append.php?file=../../'+file+'&data='+data+'&pass='+pass;
		aghs.ajax.get(url,function(r){return null})
	}
	
	function writeTo(file,data){
		data = escape(data);
		var p = []
		for(var i = 1; i<11;i++){
			p[i]=i;
		}
		pass = p.join('');
		var url = 'aghs/filesystem/write.php?file=../../'+file+'&data='+data+'&pass='+pass;
		aghs.ajax.get(url,function(r){return null})
		
	}
	
	function parsevar(key){
		var loc = document.location;
		var results = loc.href.split('?')[1];
	
		if(results != undefined)
		{
			
			kv = results.split('&');
			for(var i=0;i<kv.length;i++)
			{
				var k = kv[i].split('=')[0];
				if(k == key)
				{
					return kv[i].split('=')[1]
				}
			}
		
		}else {return false}
	}

 function sendvar(href,pair){
	var string = '?';
	for(key in pair){
		string+=key+'='+pair[key]+'&'
	}

	href += string

	window.location = href;
	}
/*
aghs.io.file:
provides a useful object which has methods which allow the direct editing, updating or reading of a specified file on the server.
this object was created from scratch, as were the functions it uses.

eg var f = new aghs.io.file(url of file relative to html page, should the script download the file immediately).

*/
	function file(url,l){
		
		var _file = this;
		this.filetype = aghs.io.getFileType(url);
		this.path = url;
		this.content = false;
		this.loaded = false;
		this.onload = new aghs.Event();
		
		if(l != false){
		aghs.ajax.post(this.path,function(r){_file.loaded = true;_file.content = r?r:'this file is empty or does not exist';_file.onload.fire();},{doosh:(Math.random())});
		}
		if(this.filetype=='text file'){
		this.write = function(data){
			aghs.io.writeTo(this.path,data);
		};
		this.append = function(data){
			aghs.io.appendTo(this.path,data);
		};
		this.clear = function(data){
			aghs.io.writeTo(this.path,'');
		};
		}
		this.download = function(){
			aghs.io.download(this.path);	
		}
		this.read = function(){
			if(this.content){ return this.content}else{return 'loading'}
		}
		this.refresh = function(){
			aghs.ajax.post(this.path,function(r){_file.loaded = true;_file.content = r?r:'this file is empty or does not exist';_file.onload.fire();},{doosh:(Math.random())});
		}
	}
	
	function mailTo(address,subject,message,from){
		aghs.ajax.post('aghs/filesystem/email.php',function(a){get('em').setInnerHTML(a)},{to:address,subject:subject,message:message,type:'text/html',from:from?from:'server@abbeygrangeict.org'})
	}
	
	function download(file){
		window.open('aghs/filesystem/open.php?file=../../'+escape(file),'','width=25,height=25,toolbar=false,location=false,status=false,menubar=false,scrollbars=false,resizable=false')	
	}
	// Example:

// alert( readCookie("myCookie") );

function readCookie(name){
	var cookieValue = "";
	var search = name + "=";
	if(document.cookie.length > 0)
	{
		offset = document.cookie.indexOf(search);
		if (offset != -1)
		{
			offset += search.length;
			end = document.cookie.indexOf(";", offset);
			if (end == -1) end = document.cookie.length;
			cookieValue = unescape(document.cookie.substring(offset, end))
		}
	}
	return cookieValue;
}

// Example:

// writeCookie("myCookie", "my name", 24);

// Stores the string "my name" in the cookie "myCookie" which expires after 24 hours.

function writeCookie(name, value, hours){
	var expire = "";
	if(hours != null)
	{
		expire = new Date((new Date()).getTime() + hours * 3600000);
		expire = "; expires=" + expire.toGMTString();
	}
	document.cookie = name + "=" + escape(value) + expire;
}
/*
aghs.io.database:
this provides direct access to databases on the server, providing reading, querying and insertion, however there is no option to delete data.
this object was created from scratch, as were the functions it uses.

eg:
var d = new aghs.io.database(host,username,password,database name)
*/
function database(h,u,p,d){
	var t = {};
	t.loaded = false;
	t.content = null;
	t.tables=[];
	t.onload = new aghs.Event();
	t.h=h;t.u=u;t.p=p;t.d=d;
	t.query =function(qu,ta){
		var func = 'query';
	aghs.ajax.get('aghs/filesystem/database.php',function(r){t.loaded = true;t.content = r?r:'this file is empty or does not exist';t.onload.fire(r);},{host:t.h,user:t.u,pass:t.p,database:t.d,table:ta,qy:qu,funct:func});
	return t;
	}
	t.insert = function(cols,values,ta){
		cols = cols.join(',');
		vals = values.join(',');
		var func = 'insert';
		aghs.ajax.get('aghs/filesystem/database.php',function(r){t.loaded = true;t.content = r?r:'this file is empty or does not exist';t.onload.fire(r);},{host:t.h,user:t.u,pass:t.p,database:t.d,table:ta,funct:func,columns:cols,values:vals});
		return t;
	}
	t.getValues = function(ta,cols){
		var columns = cols.join(',');
		var func = 'table';
		t.tables[ta] = [];
		aghs.ajax.json('aghs/filesystem/database.php',function(r){
															  t.tables[ta] = r;
															  t.loaded = true;
															  t.onload.fire(r);
															  },{host:t.h,user:t.u,pass:t.p,database:t.d,table:ta,funct:func,fields:columns});
		return t;
	}
	return t;
}

/*
this MD5 algorithm was taken from an unknown web page, more out of interest than useability.
*/

var MD5 = function (string) {
 
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}
 
	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}
 
 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }
 
	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};
 
	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	};
 
	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;
 
	string = Utf8Encode(string);
 
	x = ConvertToWordArray(string);
 
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}
 
	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
	return temp.toLowerCase();
}

aghs.commands=[];

function getCommand(){
	var loc = document.location;
		var command = loc.href.split(':')[2];
	
		if(command != undefined)
		{
			
			aghs.commands[command]();
		
		}else {return false}	
}
function addCommand(str,func){
	if(func){
		
		aghs.commands[str]=func;
		
	}
}

function sendCommand(url,comm){
	var string = '?:'+comm;
	

	href += string

	window.location = href;
}	
	return {
		appendTo:appendTo,
		parsevar:parsevar,
		sendvar:sendvar,
		download:download,
		readCookie:readCookie,
		writeCookie:writeCookie,
		mailTo:mailTo,
		database:database,
		writeTo:writeTo,
		getCommand:getCommand,
		addCommand:addCommand,
		sendCommand:sendCommand,
		getFileType: getFileType,
		file:file,
		md5:MD5
	}
	
}()))