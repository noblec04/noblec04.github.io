// Global variables
var mouse = {};
mouse.x = 0; // Horizontal position of the mouse on the screen
mouse.y = 0; // Vertical position of the mouse on the screen
mouse.xmax = 0, // Width of the page
mouse.ymax = 0; // Height of the page
mouse.onup = new aghs.Event();
mouse.onleft = new aghs.Event();
mouse.onright = new aghs.Event();
mouse.onmove = new aghs.Event();
mouse.ondrag = new aghs.Event();
mouse.ondrop = new aghs.Event();
mouse.onscroll = new aghs.Event();

if (window.addEventListener){window.addEventListener('DOMMouseScroll', wheel, false);window.addEventListener('mousewheel', wheel, false);}

window.onmousewheel = wheel;
document.onmousewheel = wheel;


function wheel(e){
        var delta = 0;
        if (!e) /* For IE. */
		e = window.event;
        
		if (e.wheelDelta) { /* IE/Opera. */
		delta = e.wheelDelta/120;
                /** In Opera 9, delta differs in sign as compared to IE.*/
                if (window.opera)
                        delta = -delta;
				} else if (e.detail) { /** Mozilla case. */
                /** In Mozilla, sign of delta is different than in IE.
                 * Also, delta is multiple of 3.
                 */
				 delta = -e.detail/3;
		}
        /** If delta is nonzero, handle it.
         * Basically, delta is now positive if wheel was scrolled up,
         * and negative, if wheel was scrolled down.
         */
        if (delta)
               mouse.scroll(delta);
        /** Prevent default actions caused by mouse wheel.
         * That might be ugly, but we handle scrolls somehow
         * anyway, so don't bother here..
         */
       /* if (e.preventDefault)
                e.preventDefault();
	e.returnValue = false;
	return cancelEvent(e);*/
}

mouse.scroll = function(delta){
	mouse.onscroll.fire(delta)
	return false;
	
}


mouse.over = function(obj){
	var xp = obj.style.left;
	var yp = obj.style.top;
	var w = obj.style.width;
	var h = obj.style.height;
	
	if(mouse.x>=xp && mouse.x<=(xp+w))
	{
		if(mouse.y>=yp && mouse.y<=(yp+h))
		{
			return true
		}else{return false}
	}else{return false}
	
	
	}

mouse.capturePosition = function(e){
    if (document.layers) {
        // When the page scrolls in Netscape, the event's mouse position
        // reflects the absolute position on the screen. innerHight/Width
        // is the position from the top/left of the screen that the user is
        // looking at. pageX/YOffset is the amount that the user has 
        // scrolled into the page. So the values will be in relation to
        // each other as the total offsets into the page, no matter if
        // the user has scrolled or not.
        mouse.x  = e.pageX;
        mouse.y = e.pageY;
        mouse.xmax = window.innerWidth+window.pageXOffset;
        mouse.ymax = window.innerHeight+window.pageYOffset;
    } else if (document.all) {
        // When the page scrolls in IE, the event's mouse position 
        // reflects the position from the top/left of the screen the 
        // user is looking at. scrollLeft/Top is the amount the user
        // has scrolled into the page. clientWidth/Height is the height/
        // width of the current page the user is looking at. So, to be
        // consistent with Netscape (above), add the scroll offsets to
        // both so we end up with an absolute value on the page, no 
        // matter if the user has scrolled or not.
        mouse.x  = window.event.x+document.body.scrollLeft;
        mouse.y  = window.event.y+document.body.scrollTop;
        mouse.xmax = document.body.clientWidth+document.body.scrollLeft;
        mouse.ymax = document.body.clientHeight+document.body.scrollTop;
    } else if (document.getElementById) {
        // Netscape 6 behaves the same as Netscape 4 in this regard 
        mouse.x  = e.pageX;
        mouse.y  = e.pageY;
        mouse.xmax = window.innerWidth+window.pageXOffset;
        mouse.ymax = window.innerHeight+window.pageYOffset;
    }
	mouse.pos = new aghs.geom.vector3(mouse.x,mouse.y,0);
	mouse.move(e);
};

mouse.down=function(e){
	if (aghs.Browser.IE) { 
		if (event.button == 2) { 
			mouse.onright.fire(e)
			return false; 
		} 
		if (event.button == 1) { 
			mouse.onleft.fire(e)
			return false; 
		} 
	}
	if (!aghs.Browser.IE) { 
		if (e.which == 3) { 
			mouse.onright.fire(e) 
			return false; 
		};
		if (e.which == 1) { 
			mouse.onleft.fire(e)
			return false
		};
	}
}

mouse.up=function(e){
	mouse.onup.fire(e);
};
mouse.move = function(e){
	mouse.onmove.fire(e)
}

mouse.addListener = function(e,fn){
	switch(e){
		case 'down':mouse.onleft.addHandler(fn);break
		case 'right':mouse.onright.addHandler(fn);break
		case 'left':mouse.onleft.addHandler(fn);break
		case 'up':mouse.onup.addHandler(fn);break
		case 'move':mouse.onmove.addHandler(fn);break
		case 'drag':mouse.ondrag.addHandler(fn);break
		case 'drop':mouse.ondrop.addHandler(fn);break
		case 'scroll':mouse.onscroll.addHandler(fn);break
	}
	
}

window.onload = function(e){
	
	aghs.Browser.IE?window.onmousedown = mouse.down:window.addEventListener('mousedown', mouse.down,false)
	window.onmousedown = selectmouse; window.addEventListener('mousedown', selectmouse,false);
	aghs.Browser.IE?window.onmousemove = mouse.capturePosition:window.addEventListener('mousemove', mouse.capturePosition,false)
	aghs.Browser.IE?window.onmousedown = mouse.up:window.addEventListener('mouseup', mouse.up,false)
	aghs.Browser.IE?window.onmouseup = function(e){isdrag = false; mouse.ondrop.fire(e)}:window.addEventListener('mouseup', function(e){isdrag = false; mouse.ondrop.fire(e)},false)
}

var ie=document.all;
var nn6=document.getElementById&&!document.all;

var isdrag=false;
var x,y;
var dobj;
var xy,yx;
var hvl;
var lvl;
var hhl;
var lhl;


function movemouse(e)
{
 var fobj       = nn6 ? e.target : event.srcElement;
  if (isdrag)
  {
   xy = nn6 ? tx + e.clientX - x : tx + event.clientX - x;
   yx = nn6 ? ty + e.clientY - y : ty + event.clientY - y;
   if(yx < hvl){yx=hvl};//this defines the highest vertical limits
   if(yx>lvl){yx=lvl};//this defines the lowest vertical limit
   if(xy < lhl){xy=lhl};//this defines the lowest horizontal limit
   if(xy > hhl){xy=hhl};//this defines the highest horizontal limit
    dobj.style.left = xy +'px'
    dobj.style.top  = yx + 'px'
	
	mouse.ondrag.fire(e);
			
    return false;
  };
};

function selectmouse(e) 
{
  var fobj       = nn6 ? e.target : event.srcElement;
  var topelement = nn6 ? "HTML" : "BODY";
	
  if(fobj){

  while (fobj.tagName != topelement && fobj.className != "dragme")
  {
    fobj = nn6 ? fobj.parentNode : fobj.parentElement;
  }

  if (fobj.className=="dragme")
  {
    hvl=fobj.hvl;
    lvl=fobj.lvl;
    hhl=fobj.hhl;
    lhl=fobj.lhl;
    isdrag = true;
    dobj = fobj;
    tx = parseInt(dobj.style.left+0);
    ty = parseInt(dobj.style.top+0);
    x = nn6 ? e.clientX : event.clientX;
    y = nn6 ? e.clientY : event.clientY;
   window.onmousemove = movemouse;
    return false;
  };
}
};

mouse.addListener('down',selectmouse);
mouse.addListener('up',new Function("isdrag=false"));

var keyboard = {};
keyboard.on = new Array();

for (var i=0;i<300;i++) 
{
			keyboard.on[i] = new aghs.Event();
}
window.onkeydown = function(e){
	keyboard.on[e.keyCode].fire(e);
}
