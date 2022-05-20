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
	fdobj.style.opacity=(fdobj.from/10);
	fdobj.fade=true;
	}
	
	function fadein(id,from,steps){
		this.elem = get(id);
		this.pos = new aghs.geom.vector2(this.elem.style.left,this.elem.style.top)
		this.startAlpha = this.elem.style.opacity || parseInt(this.elem.style.filters);
		this.ratio = this.startAlpha - from/steps;
		this.next = function(ind){
			this.elem.style.opacity = this.startAlpha + this.ratio * ind;
			this.elem.filter = 'alpha(opacity = '+(this.startAlpha + (this.ratio * ind)/100 ) + ' ) ';
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
		


aghs.animate = function(id,path,dur){
	return {
		elem:get(id),
		active:0,
		timer:null,
		path:path,
		i:0,
		duration:dur,
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
				this.timer = setInterval(function(){saveThis.step()}, duration/tickInt);
				this.started.fire();
				return this
			}else{
				path.animate(this.elem.id,this.duration);
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
			if ((this.duration > 0) && (this.i >= this.duration)){
			this.stop();
			}
			else{
			this.i++;
			}
			this.animating.fire();
		}
	}
}

xd.FX.FadeIn = function(e){
	var fdobj = xd.isNN6 ? e.target : event.srcElement;
	fdobj.style.filter='alpha(opacity=' + fdobj.to + ')' ;
	fdobj.style.opacity=(fdobj.to/10);
	fdobj.fade=false;
	fdobj.onmouseout=xd.FX.FadeOut;
};
xd.FX.FadeOut = function(e){
	var fdobj = xd.isNN6 ? e.target : event.srcElement;
	fdobj.style.filter='alpha(opacity=' + fdobj.from + ')' ;
	fdobj.style.opacity=(fdobj.from/10);
	fdobj.fade=true;
};
