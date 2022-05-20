/*
aghs.animator:
this is the newest function, and provides a simple method that allows the user to animate multiple properties of an object at once. it returns abn object to them which provides methods to control starting, stopping and pausing of the animations.
*/
tickInt = 5;
 
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
	elem.style.left = x+'px';
	}
	if(y != Number.NaN){
	elem.style.top = y+'px';
	}
}
		

aghs.anima = function(obj,css,from,to,duration,tween){
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
	this.tween = tween?tween:function(r,b,c,d){return ((c-b)/d)*r};
	
	if(this.css == 'color' || t.css == 'background'){
		
		this.b = aghs.colour.rgb(t.from);
        this.e  = aghs.colour.rgb(t.to);
		
	}
	
	this.next = function(ix){
		if((t.to>t.from)?((t.step*ix)>t.to):((t.step*ix)<t.to)){t.stop()}else{
			
			if(t.css == 'opacity'){
				
				t.obj.style.opacity = t.from+t.tween(ix,t.from,t.to,t.dur); t.obj.style.filter = 'alpha(opacity = '+ (t.from+t.tween(ix,t.from,t.to,t.dur))*100 +')';
			}else{
		
				if(t.css == 'left' || t.css == 'right' || t.css == 'height' || t.css == 'width' || t.css == 'font-size' || t.css == 'margin-top' || t.css == 'margin-left' || t.css == 'top'){
					t.obj.style[t.css] = t.from+t.tween(ix,t.from,t.to,t.dur) + 'px';
				}else{
					if(t.css == 'color' || t.css == 'background'){
					 	var red = t.b[0]+t.tween(ix,t.b[0],t.e[0],t.dur);
					 	var blue = t.b[1]+t.tween(ix,t.b[1],t.e[1],t.dur);
					 	var green = t.b[2]+t.tween(ix,t.b[2],t.e[2],t.dur);
					    t.obj.style[t.css] ='rgb('+parseInt(red)+','+parseInt(green)+','+parseInt(blue)+')'
				 	    if(red<=t.e[0] && blue<=t.e[1] && green<=t.e[2]){t.stop()}
					}else{
						t.obj.style[t.css] = t.from+t.tween(ix,t.from,t.to,t.dur);}
					}
				}
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
	return new aghs.anima(obj,css,from,to,duration,tween)
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


aghs.animator = function(object,props){
	var t = {};
	t.object = get(object);
	t.props = props;
	t.animations = {};
	t.animation = {};
	t.finished = {};
	for(var i in props){
		t.animations[i] = props[i];
		t.animation[i] = aghs.animation(t.object,props[i],i);
		t.finished[i] = t.animation[i].finished;
	}
	t.start = function(){
		for(var i in t.animation){
			if(t.started != true){
			t.animation[i].start();
			}
		}
	}
	t.stop = function(){
		for(var i in t.animation){
			t.animation[i].stop();
		}
	}
	t.cont = function(){
		for(var i in t.animation){
			t.animation[i].cont();
		}
	}

	
	
	return t;
}

aghs.animation = function(object,params,prop){
	var t = {};
	t.object = object;
	if(!params.start){params.start=parseInt(t.object.style[prop]||0);}
	if(!params.end && params.end !=0){params.end=parseInt(t.object.style[prop]||0)+params.next;}
	t.begin = params.start;
	t.end = params.end;
	t.duration = params.duration;
	t.difference = t.end-t.begin;
	t.step = t.difference/t.duration;
	t.finished = new aghs.Event();
	
	t.tween = params.tween?params.tween:function(r,b,c,d){return (t.begin+(t.step*r))};
	
	if(prop == 'color' || prop == 'background' ){
		t.begin = aghs.colour.rgb(params.start)[1];
		t.end = aghs.colour.rgb(params.end)[1];
		t.duration = params.duration;
		t.difference = t.end-t.begin;
		t.step = t.difference/t.duration;
	}
	
	t.begin = params.start;
	t.end = params.end;
	
	t.css = prop;
	t.timeouts = {};
	
	
	t.animate = function(frame){
		if(t.css == 'left' || t.css == 'right' || t.css == 'height' || t.css == 'width' || t.css == 'font-size' || t.css == 'margin-top' || t.css == 'margin-left' || t.css == 'top' || t.css=='border-radius'){
			t.object.style[t.css] = t.tween(frame,t.begin,t.end,t.duration)+'px';//ix,t.from,t.to,t.dur
		}
		if(t.css == 'opacity'){
			t.object.style.opacity = t.tween(frame,t.begin,t.end,t.duration); t.object.style.filter = 'alpha(opacity = '+ (t.tween(frame,t.begin,t.end,t.duration))*100 +')';
		}
		if(t.css == 'color' || t.css == 'background' || t.css=='border-color'){
			aghs.colour.setColour(t.object,t.css,t.begin,t.end,frame,t.duration,t.tween);
		}
		
		if(frame<t.duration){
			setTimeout(function(){t.animate(frame+1)},30);
		}else{t.finished.fire();}
	};
	
	t.start = function(){
		
			t.timeout = setTimeout(function(){t.animate(0)},30);
			t.started = true;
				
	};
	t.stop = function(){
		clearTimeout(t.timeout);
		t.started = false;
		
	};
	t.cont = function(){
			t.timeout = setTimeout(function(){t.animate(t.frame)},30);
			t.started = true;
	};

	
	
	return t;
};

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
Tween.Bez = function(p){
	return function(t,b,c,d){
		return (1-(t/d))*b+Math.BezierCurve(t/d,p)+(t/d)*c;
	}
}

aghs.tween = {}
aghs.extend(aghs.tween,Tween);