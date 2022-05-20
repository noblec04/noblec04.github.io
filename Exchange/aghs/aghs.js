/*
aghs library - engineered by Christopher Noble

contains functions in these categories(organised into files of the same names):
function
filesystem
object
array
event
math
logic
physics
element
number
string
draw
3d
animation
ajax
media
mouse

assembled while studying A-level ICT and learning programming, so apologies for any and all bad programming practices.
*/
var aghs = {} //initialise the aghs object

// these functions were to be used for dynamic pages where the user could choose to save certain set ups, and then restore earlier ones. not yet implemented
/*window['cache'] = [];
var saves = 0;*/

// define the extend function, from the ***** library
aghs.extend = function(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
};

var Try = {
  these: function() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }

    return returnValue;
  }
};

//for browser specific operations it seemed appropriate to use a tried and tested set of operations to determine browser type. again used from the ***** library
aghs.Browser=(function(){
    var ua = navigator.userAgent;
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    return {
      IE:             !!window.attachEvent && !isOpera,
      Opera:          isOpera,
      WebKit:         ua.indexOf('AppleWebKit/') > -1,
      Gecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
      MobileSafari:   /Apple.*Mobile.*Safari/.test(ua)
    }
})()

/*aghs.modules = [];

function waitfor(r,f){}
		
aghs.module = function(mod,req,init){
	var ful;
	var requires;
	aghs.modules[mod] = true;
	if(!req)req = [];
	for(var i=0;i<req.length;i++)
	{
		if (!aghs.modules[req[i]])
		{
			ful = false;
			requires = req[i]
		}
	}
	
	if(ful){init()}else{waitfor(requires,init)}
}


aghs.init = function(){}*/
