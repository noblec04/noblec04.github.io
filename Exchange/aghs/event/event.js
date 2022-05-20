/*
aghs.Event:
This object allows the user to handle user defined events.
this was written from scratch.

eg:
var e = new aghs.Event()
e.addHandler(function(m){alert(m)})

e.fire('message')
*/

aghs.Event = function()
{
	this.eventHandlers = [];
	this.addHandler = function(eventHandler)
	{
		this.eventHandlers.push(eventHandler)
	}
	this.removeHandler = function(eventHandler)
	{
		for(var i = 0; i < this.eventHandlers.length; i++)
		{
			if(this.eventHandlers[i] == eventHandler){this.eventHandlers[i] = new Function('return null')};
		}
	}
	this.fire = function(event_obj)
	{
		for(var i = 0; i < this.eventHandlers.length; i++)
		{
			this.eventHandlers[i](event_obj?event_obj:null);
		}
	}
}

function cancelEvent(e)
{
  e = e ? e : window.event;
  if(e.stopPropagation)
    e.stopPropagation();
  if(e.preventDefault)
    e.preventDefault();
  e.cancelBubble = true;
  e.cancel = true;
  e.returnValue = false;
  return false;
}

aghs.event = {
	eventgallery:[],
	add:function(eventid){
		var ef = eventid.split('.');
		this.eventgallery[ef[0]]?(this.eventgallery[ef[0]]=this.eventgallery[ef[0]]): this.eventgallery[ef[0]] = [];
		this.eventgallery[ef[0]][ef[1]] = [];
	},
	bind:function(eventid,func){
		var ef = eventid.split('.');
		this.eventgallery[ef[0]][ef[1]].push(func);	
	},
	unbind:function(eventid,func){
		var ef = eventid.split('.');
		for(var i = 0; i < this.eventgallery[ef[0]][ef[1]].length; i++)
		{
			if(this.eventgallery[ef[0]][ef[1]][i] == func){this.eventgallery[ef[0]][ef[1]][i] = new Function('return null')};
		}	
	},
	firevent:function(eventid,eventobj){
		var ef = eventid.split('.');
		for(var i = 0; i < this.eventgallery[ef[0]][ef[1]].length; i++)
		{
			this.eventgallery[ef[0]][ef[1]][i](eventobj);
		}	
	}
	
}

function addEvent(el, type, fn){
	if (window.addEventListener){
		el.addEventListener(type, fn, false);
	} else if (window.attachEvent){
		var f = function(){
		  fn.call(el, window.event);
		};			
		el.attachEvent('on' + type, f)
	}
}