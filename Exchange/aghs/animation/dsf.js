/*==================================================*
  Filename: animationBasic-01.js
  JavaScript object oriented animation routines

  Date     Description                          By
  --------|------------------------------------|----
  16Jul07  Split from real useage for tutorial  arc
 *==================================================*/
tickInt = 1;
 
aghs.anim = {};
aghs.fx = {};

aghs.extend(aghs.fx,(function() {
							  
	function FadeIn(e){
	var fdobj = nn6 ? e.target : event.srcElement;
	fdobj.style.filter='alpha(opacity=' + fdobj.to + ')' ;
	fdobj.style.opacity=(fdobj.to/10);
	fdobj.fade=false;
	fdobj.onmouseout=aghs.fx.FadeOut;
	}
	
	function FadeOut(e){
	var fdobj = nn6 ? e.target : event.srcElement;
	fdobj.style.filter='alpha(opacity=' + fdobj.from + ')' ;
	fdobj.style.opacity=(fdobj.from/100);
	fdobj.fade=true;
	}
	
	function fadein(id,from,steps){
		this.elem = get(id);
		this.pos = new aghs.geom.vector2(this.elem.style.left,this.elem.style.top)
		this.startAlpha = this.elem.style.opacity || parseInt(this.elem.style.filters);
		this.ratio = this.startAlpha - from/steps;
		this.next = function(ind){
			this.elem.style.opacity = (this.startAlpha + this.ratio * ind)/100;
			this.elem.filter = 'alpha(opacity = '+(this.startAlpha + (this.ratio * ind) ) + ' ) ';
			return this.pos
		}
	}
	
	function fadeout(id,to,steps){
		this.elem = get(id);
		this.pos = new aghs.geom.vector2(this.elem.style.left,this.elem.style.top)
		this.startAlpha = this.elem.style.opacity || 100;
		this.ratio = this.startAlpha - to/steps;
		this.i = 2;
		this.steps = steps;
		this.next = function(ind){
			this.elem.style.opacity = this.startAlpha - this.ratio * ind;
			this.elem.filter = 'alpha(opacity = '+(this.startAlpha + (this.ratio * ind)/100 ) + ' ) ';
			return this.pos
		}
	}
  return {
	  fadein :fadein,
	  fadeout :fadeout,
	  FadeIn:FadeIn,
	  FadeOut:FadeOut
  }
})())

aghs.anim.moveto = function(elem,x,y){
	elem.style.position = 'absolute';
	if(x != Number.NaN){
	elem.style.left = x;
	}
	if(y != Number.NaN){
	elem.style.top = y;
	}
}
		

aghs.anim = function(obj,css,from,to,duration,tween){
	var t = this;
	this.css = css;
	this.obj = obj;
	this.from = from;
	this.to = to;
	this.finished = new aghs.Event();
	this.started = new aghs.Event();
	this.animating = new aghs.Event();
	this.dur= duration;
	this.step = /*Math.mod*/(to - from)/duration;
	this.tween = tween?tween:function(r,b,c,d){return t.step*r};
	this.next = function(ix){
		if(Math.mod(t.step*ix)>t.to){t.stop()}else{
			
		if(t.css == 'opacity'){t.obj.style.filter = 'alpha(opacity = '+ (t.from+t.tween(ix,t.from,t.to,t.dur)*100) +')';}
		
		if(t.css == 'left' || t.css == 'right' || t.css == 'height' || t.css == 'width'){t.obj.style[t.css] = t.from+t.tween(ix,t.from,t.to,t.dur) + 'px';}
		else{t.obj.style[t.css] = t.from+t.tween(ix,t.from,t.to,t.dur);}
		}
		t.animating.fire();
		return t;
	}
	this.timer = new aghs.timer(30,t.next);
	this.start=function(){
	 t.timer.start()
	 t.started.fire();
	 return t;
	}
	this.stop = function(){
	t.timer.stop();
	t.finished.fire();
	return t
	}
	
};

aghs.animate = function(obj,css,from,to,duration,tween){
	return new aghs.anim(obj,css,from,to,duration,tween);
}


aghs.animatePath = function(id,path,steps){
	return {
		elem:get(id),
		active:0,
		timer:null,
		path:path,
		i:0,
		steps:steps,
		finished: new aghs.Event(),
		started: new aghs.Event(),
		animating: new aghs.Event(),
		pos:null,
		start:function()
		{
			if(!path.notpath){
				if (this.active){return;}
				
				var saveThis = this;   /* save for use in closure */
				this.step();
				this.active = 1;
				this.timer = setInterval(function(){saveThis.step()}, tickInt);
				this.started.fire();
				return this
			}else{
				path.animate(this.elem.id,this.steps);
			}
		},
		stop:function()
		{
			if (!this.timer){return false;}
			clearInterval(this.timer);
			this.active = 0;
			this.finished.fire(this.pos);
		},
		step:function()
		{
			var nextPos = this.path.next(this.i,this.elem.id);
			this.pos = nextPos;
			aghs.anim.moveto(this.elem, nextPos.x, nextPos.y);
			if ((this.steps > 0) && (this.i >= this.steps)){
			this.stop();
			}
			else{
			this.i++;
			}
			this.animating.fire();
		}
	}
}

var Tween ={}
Tween.bounceEaseOut = function(t,b,c,d){
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) ;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) ;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) ;
	} else {
		return c;
	}
}
Tween.bounceEaseIn = function(t,b,c,d){
	return c - Tween.bounceEaseOut (d-t, 0, c, d) + b;
	}
Tween.bounceEaseInOut = function(t,b,c,d){
	if (t < d/2) return Tween.bounceEaseIn (t*2, 0, c, d) * .5 + b;
	else return Tween.bounceEaseOut (t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
Tween.strongEaseInOut = function(t,b,c,d){
	return c*(t/=d)*t*t*t*t + b;
	}

Tween.regularEaseIn = function(t,b,c,d){
	return c*(t/=d)*t + b;
	}
Tween.regularEaseOut = function(t,b,c,d){
	return -c *(t/=d)*(t-2) + b;
	}

Tween.regularEaseInOut = function(t,b,c,d){
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
	}
Tween.strongEaseIn = function(t,b,c,d){
	return c*(t/=d)*t*t*t*t + b;
	}
Tween.strongEaseOut = function(t,b,c,d){
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
	}

Tween.strongEaseInOut = function(t,b,c,d){
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
	}

aghs.tween = {}
aghs.extend(aghs.tween,Tween);