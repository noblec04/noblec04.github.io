// JavaScript Document

aghs.v3D= {};
/*
aghs.v3D:
this object contains functions which are passed to the aghs.draw function to allow 3d objects to be drawn to either the screen or to the canvas, the latter being more efficient, but both are quick enough to create animations.
*/

aghs.extend(aghs.v3D,(function(){
							  
		function Camera(v3,v3theta){
			this.position = v3;
			this.rotation = v3theta;
			this.rotate = function(deg){
				if(typeof(deg)== 'Number'){
				this.rotation.x = this.rotation.x + deg
				this.rotation.y = this.rotation.y + deg
				this.rotation.z = this.rotation.z + deg
				}
				else{
				this.rotation.x = this.rotation.x + deg.x
				this.rotation.y = this.rotation.y + deg.y
				this.rotation.z = this.rotation.z + deg.z
				}
			}
			this.translate = function(pos){
				this.position = this.position.add(pos);
			}
			this.zoom = function(factor){
				this.position.z = this.position.z * factor;
			}
		}
		
		function project3D(v3point,transform){
			/*var m1 = Math.matrix([
								  [1,				   0,				    0],
								  [0,Math.cos(v3theta.x),-Math.sin(v3theta.x)],
								  [0,Math.sin(v3theta.x),Math.cos(v3theta.x)]
								 ]);
			var m2 = Math.matrix([
								  [Math.cos(v3theta.y), 0,Math.sin(v3theta.y)],
								  [0,				    1,				   0],
								  [-Math.sin(v3theta.x),0,Math.cos(v3theta.x)]
								 ]);
			var m3 = Math.matrix([
								  [Math.cos(v3theta.z), -Math.sin(v3theta.z),0],
								  [Math.sin(v3theta.z),  Math.cos(v3theta.z),0],
								  [0,				 	0,					 1]
								 ]);
			var ma = Math.matrix([
								 [v3point.x],
								 [v3point.y],
								 [v3point.z]
								])
			var mc = Math.matrix([
								 [-v3camera.x],
								 [-v3camera.y],
								 [-v3camera.z]
								])
			var mac = ma.add(mc)
			
			var mpoint1 = m1.multiply(m2).multiply(m3);
			var mpoint2 = mpoint1.multiply(Math.matrix(transform?transform:[
						[1,0,0],
						[0,1,0],
						[0,0,1]
						]))
			
			var dx = mpoint2[0][0]*mac[0][0] + mpoint2[0][1]*mac[1][0] + mpoint2[0][2]*mac[2][0]
			var dy = mpoint2[1][0]*mac[0][0] + mpoint2[1][1]*mac[1][0] + mpoint2[1][2]*mac[2][0]
			var dz = mpoint2[2][0]*mac[0][0] + mpoint2[2][1]*mac[1][0] + mpoint2[2][2]*mac[2][0]
		
		var bx = (dx - v3viewer.x)*(v3viewer.z / dz);
		var by = (dy - v3viewer.y)*(v3viewer.z / dz);*/
		
		transform = transform?transform:[
						[1,0,0],
						[0,1,0],
						[0,0,1]
						];
		var bx = transform[0][0]*v3point.x+transform[0][1]*v3point.y+transform[0][2]*v3point.z;
		var by = transform[1][0]*v3point.x+transform[1][1]*v3point.y+transform[1][2]*v3point.z;
		
		
		return new aghs.geom.vector2(bx,by);
	}
	
	function cube(va,width,height,depth,canvas){
		this.shape = []
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.canvas = canvas;
		this.transformer = [
						[1,0,0],
						[0,1,0],
						[0,0,1]
						]
		this.corner1 = va;
		this.corner2 = va.add(new v3(width,0,0));
		this.corner3 =  va.add(new v3(width,height,0));;
		this.corner4 =  va.add(new v3(0,height,0));
		this.corner5 =  va.add(new v3(width,0,depth));
		this.corner6 =  va.add(new v3(0,height,depth));
		this.corner7 =  va.add(new v3(width,height,depth));
		this.corner8 =  va.add(new v3(0,0,depth));
		this.transform = function(m){
			this.transformer=m;
			return this;
		}
		this .rotatex = function(a){
			var b = Math.matrix([[1,0,0,0],
								[0,Math.cos(a),Math.sin(a),0],
								[0,Math.sin(a)*-1,Math.cos(a)]
								])
			this.transformer = b.multiply(this.transformer);
			return this;
		}
		this .rotatey = function(a){
			var b = Math.matrix([[Math.cos(a),0,Math.sin(a)*-1],
								[0,1,0],
								[Math.sin(a),0,Math.cos(a)]
								])
			this.transformer = b.multiply(this.transformer);
			return this;
		}
		this .rotatez = function(a){
			var b = Math.matrix([[Math.cos(a),Math.sin(a)*-1,0],
								[Math.sin(a),Math.cos(a),0],
								[0,0,1]
								])
			this.transformer = b.multiply(this.transformer);
			return this;
		}
		this.scale = function(x,y,z){
			var b = Math.matrix([
						[x,0,0],
						[0,y,0],
						[0,0,z]
						])
			this.transformer = b.multiply(this.transformer);
			return this;
		}
		this.draw = function(c){
			var corner1 = aghs.v3D.project3d(this.corner1,this.transformer)
			var corner2 = aghs.v3D.project3d(this.corner2,this.transformer)
			var corner3 = aghs.v3D.project3d(this.corner3,this.transformer)
			var corner4 = aghs.v3D.project3d(this.corner4,this.transformer)
			var corner5 = aghs.v3D.project3d(this.corner5,this.transformer)
			var corner6 = aghs.v3D.project3d(this.corner6,this.transformer)
			var corner7 = aghs.v3D.project3d(this.corner7,this.transformer)
			var corner8 = aghs.v3D.project3d(this.corner8,this.transformer)
			if(this.canvas==null){
			this.line1 = aghs.draw(new aghs.path.line(corner1,corner2),c)
			this.line2 = aghs.draw(new aghs.path.line(corner1,corner8),c)
			this.line3 = aghs.draw(new aghs.path.line(corner1,corner4),c)
			this.line4 = aghs.draw(new aghs.path.line(corner2,corner5),c)
			this.line5 = aghs.draw(new aghs.path.line(corner2,corner3),c)
			this.line6 = aghs.draw(new aghs.path.line(corner3,corner4),c)
			this.line7 = aghs.draw(new aghs.path.line(corner3,corner7),c)
			this.line8 = aghs.draw(new aghs.path.line(corner4,corner6),c)
			this.line9 = aghs.draw(new aghs.path.line(corner5,corner8),c)
			this.line10 = aghs.draw(new aghs.path.line(corner5,corner7),c)
			this.line11 = aghs.draw(new aghs.path.line(corner6,corner8),c)
			this.line12 = aghs.draw(new aghs.path.line(corner6,corner7),c)
			
			return [].concat(this.line1).concat(this.line2).concat(this.line3).concat(this.line4).concat(this.line5).concat(this.line6).concat(this.line7).concat(this.line8).concat(this.line8).concat(this.line10).concat(this.line11).concat(this.line12)

			}else{
			this.canvas.lamina([corner1,corner2,corner3,corner4,corner1],'#ff9933');
			this.canvas.lamina([corner1,corner2,corner5,corner8,corner1],'#ff9933');
			this.canvas.lamina([corner1,corner2,corner5,corner8,corner1],'#ff9933');
			this.canvas.lamina([corner1,corner4,corner6,corner8,corner1],'#ff9933');
			this.canvas.lamina([corner4,corner6,corner7,corner3,corner4],'#ff9933');
			this.canvas.lamina([corner2,corner5,corner7,corner3,corner2],'#ff9933');
			this.canvas.lamina([corner7,corner6,corner8,corner5,corner7],'#ff9933');
			
			/*this.line1 = this.canvas.line(corner1,corner2)
			this.line2 = this.canvas.line(corner1,corner8)
			this.line3 = this.canvas.line(corner1,corner4)
			this.line4 = this.canvas.line(corner2,corner5)
			this.line5 = this.canvas.line(corner2,corner3)
			this.line6 = this.canvas.line(corner3,corner4)
			this.line7 = this.canvas.line(corner3,corner7)
			this.line8 = this.canvas.line(corner4,corner6)
			this.line9 = this.canvas.line(corner5,corner8)
			this.line10 = this.canvas.line(corner5,corner7)
			this.line11 = this.canvas.line(corner6,corner8)
			this.line12 = this.canvas.line(corner6,corner7)*/
			}
		}
		this.notpath = true;
	}
	
	function lamina(corners,canvas,fill){
		this.shape = []
		this.corners = corners;
		this.corners2d = [];
		this.line = [];
		this.fill = fill;
		this.canvas = canvas;
		this.transformer = [
						[1,0,0],
						[0,1,0],
						[0,0,1]
						];
		this.transform = function(m){
			this.transformer=m;
			return this;
		}
		this .rotatex = function(a){
			var b = Math.matrix([[1,0,0],
								[0,Math.cos(a),Math.sin(a)],
								[0,Math.sin(a)*-1,Math.cos(a)]
								])
			this.transformer = b.multiply(this.transformer);
			return this;
		}
		this .rotatey = function(a){
			var b = Math.matrix([[Math.cos(a),0,Math.sin(a)*-1],
								[0,1,0],
								[Math.sin(a),0,Math.cos(a)]
								])
			this.transformer = b.multiply(this.transformer);
			return this;
		}
		this .rotatez = function(a){
			var b = Math.matrix([[Math.cos(a),Math.sin(a)*-1,0],
								[Math.sin(a),Math.cos(a),0],
								[0,0,1]
								])
			this.transformer = b.multiply(this.transformer);
			return this;
		}
		this.translatex = function(a){
			for(var b = 0; b<this.corners.length;b++){
				this.corners[b].x +=a;
			}
			return this;
		}
		this.translatey = function(a){
			for(var b = 0; b<this.corners.length;b++){
				this.corners[b].y +=a;
			}
			return this;
		}
		this.translatez = function(a){
			for(var b = 0; b<this.corners.length;b++){
				this.corners[b].z +=a;
			}
			return this;
		}
		this.draw = function(c){
			for(var i = 0; i<this.corners.length; i++){
				this.corners2d[i] = aghs.v3D.project3d(this.corners[i],this.transformer);
			}
			if(this.canvas==null){
			for(var i = 0; i<this.corners.length; i++){
				if(i!=this.corners.length-1){
				this.line[i] = aghs.draw(new aghs.path.line(this.corners2d[i],this.corners2d[i+1]),c);
				}else{
				this.line[i] = aghs.draw(new aghs.path.line(this.corners2d[i],this.corners2d[0]),c);
				}
			}
			
			return this.line;

			}else{
			this.canvas.lamina(this.corners2d,this.fill);	
			}
		}
		this.notpath = true;
	}
	
	
	function pyramid(va,width,height,depth,camera,viewer,canvas){
		this.shape = []
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.camera = camera;
		this.viewer = viewer;
		this.canvas = canvas;
		this.transformer = [
						[1,0,0],
						[0,1,0],
						[0,0,1]
						]
		this.corner1 = va;
		this.corner2 = va.add(new v3(width,0,0));
		this.corner3 =  va.add(new v3(width,height,0));;
		this.corner4 =  va.add(new v3(0,height,0));
		this.corner5 =  va.add(new v3(width,0,depth));
		this.transform = function(m){
			this.transformer=m;
			return this;
		}
		this.draw = function(c){
			var corner1 = aghs.v3D.project3d(this.corner1,this.camera.position,this.camera.rotation,this.viewer,this.transformer)
			var corner2 = aghs.v3D.project3d(this.corner2,this.camera.position,this.camera.rotation,this.viewer,this.transformer)
			var corner3 = aghs.v3D.project3d(this.corner3,this.camera.position,this.camera.rotation,this.viewer,this.transformer)
			var corner4 = aghs.v3D.project3d(this.corner4,this.camera.position,this.camera.rotation,this.viewer,this.transformer)
			var corner5 = aghs.v3D.project3d(this.corner5,this.camera.position,this.camera.rotation,this.viewer,this.transformer)
			if(this.canvas==null){
			this.line1 = aghs.draw(new aghs.path.line(corner1,corner2),c)
			this.line3 = aghs.draw(new aghs.path.line(corner1,corner4),c)
			this.line4 = aghs.draw(new aghs.path.line(corner2,corner5),c)
			this.line5 = aghs.draw(new aghs.path.line(corner2,corner3),c)
			this.line6 = aghs.draw(new aghs.path.line(corner3,corner4),c)
			this.line7 = aghs.draw(new aghs.path.line(corner2,corner4),c)
			this.line8 = aghs.draw(new aghs.path.line(corner4,corner5),c)
			
			return [].concat(this.line1).concat(this.line2).concat(this.line3).concat(this.line4).concat(this.line5).concat(this.line6).concat(this.line7).concat(this.line8).concat(this.line8).concat(this.line10).concat(this.line11).concat(this.line12)
			}else{
			this.line1 = this.canvas.line(corner1,corner2)
			this.line3 = this.canvas.line(corner1,corner5)
			this.line4 = this.canvas.line(corner2,corner5)
			this.line5 = this.canvas.line(corner3,corner5)
			this.line6 = this.canvas.line(corner4,corner5)
			this.line7 = this.canvas.line(corner2,corner3)
			this.line8 = this.canvas.line(corner3,corner4)
				
			}
		}
		this.notpath = true;
	}
	var defaultcamera = new Camera(new aghs.geom.vector3(1,10,50),new aghs.geom.vector3(1,1,1))
		
		
		function translate(v,x,y,z){
			var h = (v.dot)?v:new aghs.geom.vector(v);
			
			if(!h[3]){h[3]=1}
			
			var MA = Math.matrix([
					  [1,0,0,0],
					  [0,1,0,0],
					  [0,0,1,0],
					  [x,y,z,1]
			])
			
			return  MA.vm(h);
			
		}
		function scale(v,x,y,z){
			var h = (v.dot)?v:new aghs.geom.vector(v);
			
			if(!h[3]){h[3]=1}
			
			var MA = Math.matrix([
					  [x,0,0,0],
					  [0,y,0,0],
					  [0,0,z,0],
					  [0,0,0,1]
			])
			
			return  MA.vm(h);
			
		}
		function rotate(v,x,y,z){
			var h = (v.dot)?v:new aghs.geom.vector(v);
			
			if(!h[3]){h[3]=1}
			
			var rx = Math.matrix([
								[1,0,0,0],
								[0,Math.cos(x),Math.sin(x),0],
								[0,Math.sin(x)*-1,Math.cos(x),0],
								[0,0,0,1]
								])

			var ry = Math.matrix([[Math.cos(y),0,Math.sin(y)*-1,0],
								[0,1,0,0],
								[Math.sin(y),0,Math.cos(y),0],
								[0,0,0,1]
								])

			var rz = Math.matrix([[Math.cos(z),Math.sin(z)*-1,0,0],
								[Math.sin(z),Math.cos(z),0,0],
								[0,0,1,0],
								[0,0,0,1]
								])
			
			var trans = rx.multiply(ry);
			trans = trans.multiply(rz);
			
			return  trans.vm(h);
			
		}
		
		
		return {
		Camera:Camera,
		cube:cube,
		pyramid:pyramid,
		lamina:lamina,
		project3d:project3D,
		translate:translate,
		scale:scale,
		rotate:rotate,
		defaultcamera:defaultcamera
	}
})())