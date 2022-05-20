/*
aghs.path:

this object was borrowed from a website to allow animation and drawing along a path, both of which could be encapsulated in one function.
This object is not now prefferable, but still useable.


aghs,geom:
This object contains vector objects and related methods, building form 2d vectors to nd vectors and tensor multiplication for the cross product of such 3x3 vectors.

aghs.draw():
this function is the drawing function, it can be passed 2 kinds of function, a path function, previously defined, or a notpath function, the difference being that the path functions return a set of points that the draw function then fills with pixels(defined in the geom object), whereas the notpath functions draw their own shape, but send back the pixel positions as an array of vectors to the draw function.

aghs.timer():
this class allows the user to specify a certain time interval after which a defined event should fire, it allows the user to control the starting and stopping of the timer.

aghs.canvas:
this object contains a host of methods which define the drawing of shapes using the canvas API.

aghs.colour:
this object contains methods for handling colour codes, splitting them into the rgb codes and manipulating them. It makes colour animation possible, and random colour generation possible.
*/

aghs.path = {};
aghs.geom = {};
aghs.extend(aghs.path,(function() {
	
	function circle(initPos, radius)
	{
			this.rad = radius;
			var pion = Math.PI/180;
			this.startAngle = 5;
			this.aStep = 1;        // angle per step
			this.cx = initPos.x - this.rad * Math.cos(5 * pion);   // coords of centre
			this.cy = initPos.y - this.rad * Math.sin(5 * pion);
			this.currX = initPos.x;
			this.currY = initPos.y;
			this.length = (Math.PI * 2 * this.rad);
		this.next = function(index)
		{
			var angle = this.startAngle - index * this.aStep;  // +ve angles are cw, we want ccw
			this.currX = this.cx + this.rad * Math.cos(angle * pion);
			this.currY = this.cy + this.rad * Math.sin(angle * pion);
			
			return new aghs.geom.vector2(this.currX, this.currY)
		}
	}
	function line(va,vb){
		this.length=aghs.geom.getLineLength(va,vb),
		this.startx=va.x,
		this.starty=va.y,
		this.endx=vb.x,
		this.endy=vb.y,
		this.next=function(i){
				var pointx = this.startx+(this.endx-this.startx)*i/this.length;
				var pointy = this.starty+(this.endy-this.starty)*i/this.length
				if (this.length != 0 ){
				return new aghs.geom.vector2(pointx, pointy)
				}else{
					return new aghs.geom.vector2(0, 0)
				}
		}
	}
	
	function freefall(id, initPos, slope, speed, walls){
		 var px_mm = 3;  // = 75px/25.4mm
		 // velocity 1m/s = 1 mm/ms = 1mm/ms * px/mm * ms/tick
		 this.speed = speed;
		 this.vel = this.speed * px_mm * tickInt;
		 var pion = Math.PI/180;
		 
		 this.elemSize = get(id).size;       // size object
		 this.currX = initPos.x;
		 this.currY = initPos.y;
		 this.xVel = this.vel * Math.cos(slope * pion);
		 this.yVel = this.vel * Math.sin(slope * pion);
		 this.walls = walls;
		 
		 //   gravity = 9.8m/s/s = 0.0098mm/ms/ms = 0.0098* ms/tick*ms/tick * px/mm
		 this.gravity = 0.0098 * px_mm * tickInt * tickInt;
		 
		 this.next = function(index)
		 {
			 var x, y;    // new pos candidate
			 
			 this.yVel += 0.5 * this.gravity;
			 x = this.currX + this.xVel;
			 y = this.currY + this.yVel;
			 if (x > this.walls.right - this.elemSize.width)
			 {
				 x = this.walls.right - this.elemSize.width;
				 this.xVel *= -0.8;    // lossy reflection next step
			 }
			 if (x < this.walls.left)
			 {
				 x = this.walls.left;
				 this.xVel *= -0.8;    // lossy reflection next step
			 }
			 if (y > this.walls.bottom - this.elemSize.height)
			 {
				 y = this.walls.bottom - this.elemSize.height;
				 if (Math.abs(this.yVel) < this.gravity)
				 {
					 // Now if velocity is less than g, let the g term be the loss mechanism
					 this.gravity *= 0.8;
					 this.yVel *= -1.0;
					 this.xVel *= 0.95;   // introduce rolling friction for x motion
				 }
				 else this.yVel *= -0.8;    // lossy reflection next step
			 }
			 if (y < this.walls.top)
			 {
				 y = this.walls.top;
				 this.yVel = -0.8 * this.yVel;    // lossy reflection next step
			 }
			 
			 this.currX = x;
			 this.currY = y;
			 return new aghs.geom.vector2(this.currX, this.currY);
		 }
		
	}
	
	function rectangle(va,width,height){
		this.shape = [];
		this.width = width;
		this.height = height;
		this.notpath = true;
		this.line1 = null;
		this.line2 = null;
		this.line3 = null;
		this.line4 = null;
		this.anim1 = null;
		this.anim2 = null;
		this.anim3 = null;
		this.anim4 = null;
		this.corner1 = va;
		this.corner2 = va.add(new v2(width,0));
		this.corner3 = va.add(new v2(width,height))
		this.corner4 = va.add(new v2(0,height))
		this.draw = function(){
			this.line1 = aghs.draw(new aghs.path.line(this.corner1,this.corner2))
			this.line2 = aghs.draw(new aghs.path.line(this.corner2,this.corner3))
			this.line3 = aghs.draw(new aghs.path.line(this.corner3,this.corner4))
			this.line4 = aghs.draw(new aghs.path.line(this.corner4,this.corner1))
			for (i = 0;i<this.line1.length;i++){
				this.shape.push(this.line1[i])
			}
			for (i = 0;i<this.line2.length;i++){
				this.shape.push(this.line2[i])
			}
			for (i = 0;i<this.line3.length;i++){
				this.shape.push(this.line3[i])
			}
			for (i = 0;i<this.line4.length;i++){
				this.shape.push(this.line4[i])
			}
			return this.shape;
		}
		this.animate = function(id){
			var _anim = this;
			this.anim1 = aghs.animatePath(id,new aghs.path.line(this.corner1,this.corner2),_anim.width).start()
			this.anim1.finished.addHandler(function(){
													
										_anim.anim2 = aghs.animatePath(id,new aghs.path.line(_anim.corner2,_anim.corner3),_anim.height).start()
										_anim.anim2.finished.addHandler(function(){
											
											_anim.anim3 = aghs.animatePath(id,new aghs.path.line(_anim.corner3,_anim.corner4),_anim.width).start()
											_anim.anim3.finished.addHandler(function(){
													
													_anim.anim4 = aghs.animatePath(id,new aghs.path.line(_anim.corner4,_anim.corner1),_anim.height).start()
											})
													
										})
													
								})
		}
	}
	
	function quadraticcurve(a,b,c){
		var curvex,curvey;
		for(curvex = -100;curvex<100;curvex+=0.1){
			curvey = (-a*(curvex*curvex)+(b*curvex)+c)
			new pixel('#000000',((curvex)*10)+300,curvey)
		}		
	}
	
  return {
	  circle:circle,
	  line:line,
	  freefall:freefall,
	  quadratic:quadraticcurve,
	  rectangle:rectangle
  }
})())


aghs.extend(aghs.geom,(function() {
								
	var contain,iscartesian = false,center = null;
	
	function cartesian(pos){
		aghs.geom.center = pos;
		aghs.geom.iscartesian = true;
	}
	
	function pixel(colour,x,y,container){
		this.contain = get(container?container:aghs.geom.contain);
		this.div = document.createElement('div');
		this.div.style.height = '1px';
		this.div.style.width = '1px';
		this.div.style.position = 'absolute'
		this.div.style.top = y+'px';
		this.div.style.left = x+'px';
		this.div.style.background = colour;
		this.contain.appendChild(this.div);
		return aghs.extend(this.div,elementMethods);
	}
	
		function vector2(x,y){
		
		if (aghs.geom.iscartesian){
			x = x+aghs.geom.center.x;
			y = (y*-1)+aghs.geom.center.y;
		}
		this.x = x;
		this.y = y;
		this[0] = x;
		this[1] = y;
		
		this.length = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
		this.costheta = this.x/this.length;
		this.sintheta = this.y/this.length;
		this.tantheta = this.y/this.x;
		
		this.matrix = Math.matrix([
								   [x],
								   [y]
								 ]);
		this.add = function(v){
			return new aghs.geom.vector2((this.x+v.x),(this.y+v.y));
		}
		this.subtract = function(v){
			return new aghs.geom.vector2((this.x-v.x),(this.y-v.y));
		}
		this.scale = function(sf){
			return new aghs.geom.vector2((this.x*sf),(this.y*sf));
		}
		this.dot =function(v){
			return this.x*v.x+this.y*v.y;
		}
		this.cross = function(v){
			return new vector3(0,0,(this.x*v.y)-(v.x*this.y));
		}
		return this;
	};
	
	function vector3(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.length = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
		this.matrix = Math.matrix([
								   [x],
								   [y],
								   [z]
								 ]);
		this.add = function(v){
			return new aghs.geom.vector3((this.x+v.x),(this.y+v.y),(this.z+v.z));
		}
		this.subtract = function(v){
			return new aghs.geom.vector3((this.x-v.x),(this.y-v.y),(this.z-v.z));
		}
		this.dot = function(v){
			return this.x*v.x+this.y*v.y+this.z*v.z;
		}
		this.cross = function(v){
			return new vector3(thiz.y*v.z-this.z*v.y,this.x*v.z-this.z*v.y,this.x*v.y-this.y*v.x);
		}
		return this;
	}
	
	function vector(args){
		this.dim = args.length;
		for(var i=0;i<args.length;i++){
			this[i] = args[i];
		}
		var dsSQ = 0;
		for(var i=0;i<args.length;i++){
			dsSQ += Math.pow(args[i],2)
		}
		this.modlus = Math.sqrt(dsSQ);
		
		this.add = function(v){
			var added = [];
			for(var i=0;i<this.dim;i++){
			added[i] = this[i]+v[i];
			}
			
			return new aghs.geom.vector(added);
		}
		this.subtract = function(v){
			var added = [];
			for(var i=0;i<this.dim;i++){
			added[i] = this[i]-v[i];
			}
			
			return new aghs.geom.vector(added);
		}
		this.dot = function(v){
			var added = 0;
			for(var i=0;i<this.dim;i++){
			added += this[i]+v[i];
			}
			
			return added;
		}
		if(this.dim==3){
		this.cross = function(v){
			var perm = Math.matrix([
									[
									 [0,0,0],[0,0,1],[0,-1,0]
									 ],
									[
									 [0,0,-1],[0,0,0],[1,0,0]
									 ],
									[
									 [0,1,0],[-1,0,0],[0,0,0]
									 ]
									])
			var c = [];
			for(var i=0;i<3;i++){
				c[i]=0;
				for(var j=0;j<3;j++){
					for(var k=0;k<3;k++){
						c[i] += perm[i][j][k]*this[j]*v[k];
					}
				}
			}
			return new aghs.geom.vector(c);
		}
		}
		return this;
		
	}
	
	function getLineGradient(va,vb){
		var gradient,y,x;
		y = va.y - vb.y;
		x = va.x - vb.x;
		
		if ((y != 0) && (x != 0)){
			gradient = y/x;
		} else { gradient = 0 }
		
		return gradient;
	}
	
	function getLineLength(va,vb){
		var length,y,x,z;
		x = va.x - vb.x;
		y = va.y - vb.y;
		
		z = (x*x)+(y*y);
		length = Math.sqrt(z)
		if (z < 0)length = 0;
		return length;
	}
	function midpoint(va,vb){
		return new aghs.geom.vector2((va.x+vb.x)/2,(va.y+vb.y)/2);
	}
	function boundary(left, top, width, height, reflect){ 
		this.left = left;
  		this.right = left + width;
 		this.top = top;
  		this.bottom = top + height;
  		this.reflect = reflect;
	}
	
	function transform(shape,m){
		var ma = Math.matrix(m);
		for(var i=0;i<shape.length;i++){
			var t = shape[i].matrixTransform(ma);
		}
	}
	
	return{
	  contain:contain,
	  iscartesian:iscartesian,
	  cartesian:cartesian,
	  center:center,
	  vector3:vector3,
	  vector2:vector2,
	  vector:vector,
	  boundary:boundary,
	  transform:transform,
	  getLineGradient:getLineGradient,
	  getLineLength:getLineLength,
	  pixel:pixel
	  }
})())

aghs.draw = function(path,container,colour){
	var pixels = [];
	if(!path.notpath){
		for (var i = 0;i<path.length;i++){
			var nextPos = path.next(i);
			pixels[i] = new aghs.geom.pixel(colour?colour:'rgb(51,51,51)',nextPos.x, nextPos.y,container)
		}
	}else{
		pixels = path.draw(container,colour)
	}
	return pixels;
}

aghs.timer = function(time,tickfunction){
	this.time = time;
	var t = this;
	this.int = 0;
	this.going = false;
	this.timerFunction = tickfunction;
	this.timeout = null;
	this.tick = new aghs.Event();
	this.tick.addHandler(tickfunction)
	this.start = function(){
		if(t.going){null}else{
		t.timeout = setInterval(t.timing , t.time);
		t.going=true;
		}
	};
	this.timing = function(){
		t.tick.fire(t.int++)
	}
	this.stop = function(){
		clearInterval(t.timeout);
	};
};

function Canvas(id){
	    this.canvas = get(id);
	    this.ctx = this.canvas.getContext('2d');
	    this.width = this.canvas.width;
	    this.height = this.canvas.height;
	    this.fill_color = "#ffffff";
	    this.stroke_color = "#000";
		this.newcenter = null;
		this.circco = false;
	}
	Canvas.prototype={
	    setcenter: function(x,y){
			this.newcenter = new aghs.geom.vector2(x,y);
			this.center();
	        return this;
	    },
		getco:function(r){
			if(this.circco){
				var x = r.x*Math.cos(r.y);
				var y = r.x*Math.sin(r.y);
				return v2(x,y);
				
			}else{
				return r	
			}
			
		},
		center:function(){
			var c = this.newcenter?this.ctx.moveTo(this.newcenter.x,this.newcenter.y): this.ctx.moveTo(this.width/2,this.height/2);
			return this.newcenter?this.newcenter: new aghs.geom.vector2(this.width/2,this.height/2);
		},
	    randomCoordinate: function(){
	        var r1 = (Math.random()<0.5?-Math.random():Math.random());
	        var r2 = (Math.random()<0.5?-Math.random():Math.random());
	        var c = this.center();
	        return c.add([c.x*r1/2,c.y*r2/2]);
	    },
	    isInside: function(p){
	        return (p.x>0 && p.y>0 && p.x < this.width && p.y < this.height);
	    },
	    clear: function(){
	        this.ctx.clearRect(0, 0, this.width, this.height);
	        this.ctx.save();
	        this.ctx.beginPath();
	        this.ctx.fillStyle = this.fill_color;
	        this.ctx.fillRect(0,0,this.width,this.height);
	        this.ctx.restore();
	    },
		lamina:function(corners,co){
			var c = this.newcenter?this.newcenter:{x:0,y:0};
	        this.ctx.save();
	        this.ctx.beginPath();
	        this.ctx.strokeStyle = this.stroke_color;
			this.ctx.fillStyle = co;
			this.ctx.moveTo(corners[0].x+c.x,corners[0].y+c.y);
			
			for(var i = 0; i<corners.length; i++){
				if(i!=corners.length-1){
				this.ctx.lineTo(corners[i+1].x+c.x,corners[i+1].y+c.y);
				}else{
				this.ctx.lineTo(corners[0].x+c.x,corners[0].y+c.y);
				}
			}	
	        
			this.ctx.stroke();
			this.ctx.fill();
	        this.ctx.restore();
		},
	    circle: function(p,r){
	        this.ctx.save();
	        this.ctx.beginPath();
	        this.ctx.strokeStyle = this.stroke_color;
	        this.ctx.moveTo(p.x+r,p.y);
	        this.ctx.arc(p.x, p.y, r, 0, 2*PI, false);
	        this.ctx.stroke();
	        this.ctx.restore();
	    },
	    line: function(x1,x2){
			var c = this.newcenter?this.newcenter:{x:0,y:0};
	        this.ctx.save();
	        this.ctx.beginPath();
	        this.ctx.strokeStyle = this.stroke_color;
	        this.ctx.moveTo(x1.x+c.x,x1.y+c.y);
	        this.ctx.lineTo(x2.x+c.x,x2.y+c.y);
	        this.ctx.stroke();
	        this.ctx.restore();
	    },
		pixel:function(x,y,colour){
			y = y*(-1)+200;
			x=x+200;
			this.ctx.save();
	        this.ctx.beginPath();
	        this.ctx.strokeStyle = colour?colour:this.stroke_color;
	        this.ctx.moveTo(x,y);
	        this.ctx.lineTo(x+1,y+1);
	        this.ctx.stroke();
	        this.ctx.restore();
		},
	    ellipse: function(a,b,r){
	        var a_b = a.subtract(b);

	        var q = a_b.scale( 1+(r/a_b.euclidLength()) );

        var a1 = b.add(q);
        var b1 = a.subtract(q);
        
        var a_a1 = a.subtract(a1);
        var a_a11 = a_a1.elementAt(1);
        var a_a12 = a_a1.elementAt(2);
        
        var b_b1 = b.subtract(b1);
        var b_b11 = b_b1.elementAt(1);
        var b_b12 = b_b1.elementAt(2);
        
        var c1 = b1.add([-1.2*b_b12,1.2*b_b11]);
        var c2 = a1.add([1.2*a_a12,-1.2*a_a11]);
        var c3 = a1.add([-1.2*a_a12,1.2*a_a11]);
        var c4 = b1.add([1.2*b_b12,-1.2*b_b11]);
        
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fill_color;
        this.ctx.moveTo(b1.elementAt(1),b1.elementAt(2));
        this.ctx.bezierCurveTo(c1.elementAt(1),c1.elementAt(2),c2.elementAt(1),c2.elementAt(2)  ,a1.elementAt(1),a1.elementAt(2));
        this.ctx.bezierCurveTo(c3.elementAt(1),c3.elementAt(2),c4.elementAt(1),c4.elementAt(2)  ,b1.elementAt(1),b1.elementAt(2));
        this.ctx.fill();
        this.ctx.strokeStyle = this.stroke_color;
        this.ctx.stroke();
        this.ctx.restore();
    }
};

aghs.canvas = Canvas;

aghs.colour = {};
window['colour'] = {};

aghs.extend(colour,function(){
	
	function setColour(object,css,start,end,frame,dur,tween){
		var b = aghs.colour.rgb(start);
		var e = aghs.colour.rgb(end);
		var red =b[0]+(((e[0]-b[0])/dur)*frame);
		var blue = b[1]+(((e[1]-b[1])/dur)*frame);
		var green = b[2]+(((e[2]-b[2])/dur)*frame);
		object.style[css] ='rgb('+parseInt(red)+','+parseInt(green)+','+parseInt(blue)+')';
		
	}
						 
	function d2h(dec) { 
   	    return dec.toString(16);
	};
	
	function h2d(hex) { 
       return parseInt(hex,16);
	}
	
	function rgb2h(r,g,b) { 
         return [d2h(r),d2h(g),d2h(b)];
	}
	function h2rgb(h,e,x) {
        return [h2d(h),h2d(e),h2d(x)];
	}

	function rgb(color) {
     if(color.indexOf('rgb')<=-1) {
     return h2rgb(color.substring(1,3),color.substring(3,5),color.substring(5,7));
     }
     return color.substring(4,color.length-1).split(',');
	}
	
	function blend(c1,c2){
		var c1 = aghs.colour.rgb(c1);
		var c2 = aghs.colour.rgb(c2);
		
		var red = (c1[0]+c2[0])/2;
		var blue = (c1[1]+c2[1])/2;
		var green = (c1[2]+c2[2])/2;
		
		return 'rgb('+parseInt(red)+','+parseInt(green)+','+parseInt(blue)+')'
	}
	
	function reflect(light,surface){
		var light = aghs.colour.rgb(light);
		var surface = aghs.colour.rgb(surface);
		var r = [];
		
		//red
		if(light[0]>=surface[0]){
			r[0] = surface[0]
		}else{
			r[0] = light[0]
		}
		//blue
		if(light[1]>=surface[1]){
			r[1] = surface[1]
		}else{
			r[1] = light[1]
		}
		//green
		if(light[2]>=surface[2]){
			r[2] = surface[2]
		}else{
			r[2] = light[2]
		}
		
		return 'rgb('+parseInt(r[0])+','+parseInt(r[1])+','+parseInt(r[2])+')'
	}
	
	function random(){
		var red = parseInt(Math.random()*250);
		var blue = parseInt(Math.random()*250);
		var green = parseInt(Math.random()*250);
		
		return 'rgb('+red+','+blue+','+green+')';
	}
	
	return{
		setColour:setColour,
		rgb:rgb,
		blend:blend,
		reflect:reflect,
		random:random
	}
}());
aghs.colour = colour;