/*
Math:
the first 4functions were already part of the ***** library, however the rest of this file was built from scratch to provide useable methods to work with mathematical objects in JS.
*/

aghs.extend(Math,(function(){
	
	function square(no){
		return no*no;
	}
	
	function rads(no){
		return (no * Math.PI)/180
	}
	
	function deg(no){
		return (no * 180)/Math.PI;
	}
	
	function cube(no){
		return no*no*no;
	}
	
	function mod(n){
		if(n<0){return n*(-1)}else{return n}
	}
/*
Math.matrix:
this object took a long time to get right, and required that i learn the subtelties of index/einstein notation which then simplified the computational steps emmensley. however
*/
	function matrix(m){
		m.columns = m[0].length;
		m.rows = m.length;
		
		m.minor = function(matrix,row,col)
		{
			var i,j,a,b;
 
			a = b = 0;
			var minor = [];
			for (var i=0; i < matrix.rows-1; i++) {
					minor[i] = new Array(matrix.columns-1);
			}
			minor = Math.matrix(minor);
 
			for( i = 0; i < matrix.columns; i++ )
			{
				if( i != row )
				{
					b = 0;
					for( j = 0; j < matrix.rows; j++ )
					{
						if( j != col )
						{
							minor[a][b] = Math.pow(-1,i+j-1)*matrix[i][j];
							b++;		// Increase column-count of minor
						}
					}
					a++;			// Increase row-count of minor
				}
			}
 
			return minor;
		}
//the determinant method was the most difficult function to create, and took the longest to debug, but it now finally works for all square matrices.
		m.determinant = function(matrix){
	var i, result = 0;
 
 	if( matrix.rows < 1 )
 	{
 		alert("CalcDeterminant( ) : Invalid matrix.");
 		return 0;
 	}
 
 		// The 'stopping' condition
		if( matrix.rows == 1 )
			return matrix[0][0];
	 
		for( i = 0; i < matrix.rows; i++ )
		{
			if( !matrix.minor(matrix,0,i))
			{
				alert("Memory allocation failed.");
				return 0;
			}
	 
			result += (matrix[0][i] * matrix.determinant(matrix.minor(matrix,0,i)));
		}
 
 	return result;			
		}
		m.inv = function(){
		
		var minors = [];
		var det = m.determinant(m);
		for (var i=0; i < m.columns;i++)
		{
			minors[i]=new Array(m.rows);
		}
		minors= Math.matrix(minors)
		
			for(var i=0;i<m.columns;i++)
			{
				for(var j=0;j<m.rows;j++)
				{
					minors[i][j] = m.determinant(m.minor(m,i,j))/det
				}
			}
			
			minors = minors.transpose();
		
		return minors;
		
		}
		/*m.inverse = function(){
			if(this.columns==2 && this.rows==2){
				var a = m[0][0];
				var b = m[0][1];
				var c = m[1][0];
				var d = m[1][1];
				var det = (a*d)-(b*c);
				var det1 = 1/det;
				m.inverseMatrix = [
									  [null,null],
									  [null,null]
									 ];
				m.inverseMatrix[0][0] = det1*d;
				m.inverseMatrix[0][1] = det1*(-b);
				m.inverseMatrix[1][0] = det1*(-c);
				m.inverseMatrix[1][1] = det1*a;
				
				return m.inverseMatrix;			
				}
			else{
				if(this.columns==3 && this.rows==3){
					var a,b,c,d,e,f,g,h,i;
					a=m[0][0];b=m[0][1];c=m[0][2],d=m[1][0],e=m[1][1];f=m[1][2];g=m[2][0];h=m[2][1],i=m[2][2];
					
					var det3 = (a*e*i)-(a*f*h)+(b*f*g)-(b*d*i)+(c*d*h)-(c*e*g);
					
					if(det3==0){alert('this matrix does not have an inverse');return false}
					det3 = 1/det3;
					var na,nb,nc,nd,ne,nf,ng,nh,ni;
					na=(e*i)-(f*h);nb=(c*h)-(b*i);nc=(b*f)-(c*e);nd=(f*g)-(d*i);ne=(a*i)-(c*g);nf=(c*d)-(a*f);ng=(d*h)-(e*g);nh=(b*g)-(a*h);ni=(a*e)-(b*d);
					
					return Math.matrix([
								 [na*det3,nb*det3,nc*det3],
								 [nd*det3,ne*det3,nf*det3],
								 [ng*det3,nh*det3,ni*det3]
								 ])
				}else{alert('this matrix can not yet be computed \n sorry for the incovenience')}
			}
		};*/
						
		m.add = function(ma){
			for(var b = 0;b<m.length;b++)
			{
				for(var c = 0; c<m[b].length;c++)
				{
					var m1 = m[b][c];
					var m2 = ma[b][c];
					var ans = m1 + m2;
					this[b][c] = ans;
				}
			}
			return m;
		};
		
		m.multiply = function(ma){
			
			var rowsA = this.length;
				var rowsB = ma.length; // == colsA
				var colsB = ma[0].length;
				
				var matrixC = new Array(rowsA);
				
				for (var i=0; i < rowsA; i++) {
					matrixC[i] = new Array(colsB);
				}
				
			
			for(i = 0; i < colsB; i++){
				for(j = 0; j < rowsA; j++){
					for(k = 0, matrixC[i][j] = 0; k < rowsB; k++){
						matrixC[i][j] += this[i][k] * ma[k][j];
					}
				}
			}
			return Math.matrix(matrixC);
		};
		m.transpose = function(){
			var mn =[];
			for (var i=0; i < m.rows; i++) {
					mn[i] = new Array(m.columns);
				}
				mn = Math.matrix(mn);
			for(i = 0; i < m.columns; i++){
				for(j = 0; j < m.rows; j++){
					mn[j][i] = m[i][j]
				}
			}
			return mn
			
			
		};
		
		
		m.vm = function(ma){
			var rowsA = m.length;
				
			var matrixC = new Array(rowsA);
				
			
			for(i = 0; i < rowsA; i++){
				matrixC[i] = 0;
				for(j = 0; j < rowsA; j++){
						matrixC[i] += m[j][i] * ma[j];
				}
			}
			return new aghs.geom.vector(matrixC);
		}
	return m;
	}
	
	function quadraticformula(a,b,c){
		var dis = (b*b)-(4*a*c);
		if(dis>0){
		dis = Math.sqrt(dis);
		postx = (-1*b) + dis;
		negtx = (-1*b) - dis;
		
		postx = postx/(2*a)
		negtx = negtx/(2*a);
		
		return{
			positive:postx,
			negative:negtx
			}
		}else{
			dis = dis*-1;
			dis = Math.sqrt(dis);
			return{
				positive:Math.complex((-1*b)/(2*a),dis),
				negative:Math.complex((-1*b)/(2*a),-dis)
			}
		}
	}
/*
Math.complex:
adds some very simple functions to the Math object, but allows the full solutions of all quadratics to be obtained and manipulated in JS.
*/
function complex(real,imag){
		return{
			real:real,
			i:imag,
			add:function(c){
				if(typeof(c) != 'Number'){
					return Math.complex(this.real+c.real,this.imag+c.i);
				}else{
					return Math.complex(this.real+c,this.imag);
				}
			},
			minus:function(c){
				return Math.complex(this.real-c.real,this.imag-c.i);
			},
			modulus:function(){
				return(Math.sqrt(Math.pow(this.real,2)+Math.pow(this.i,2)))
			},
			conjugate:function(){
				return Math.complex(this.real,-this.i);
			},
			multiply:function(co){
				var a = this.real*co.real;
				var b = this.real*co.i;
				var c = this.i*co.real;
				var d = this.i*co.i;
				
				var r = a-d;var im = b+c;
				
				return Math.complex(r,im);
			},
			divide:function(co){
				var a = this.real,b=this.i,c=co.real,d=co.i;
				
				var r = (a*c + b*d)/(c*c + d*d);
				var im = (a*d - b*c)/(c*c + d*d);
				
				return Math.complex(r,im);
				
			},
			toString:function(){
				return(this.real + '+' + this.i + 'i');
			}
			
		}
	}
	
	function sum(n,i,func,p){
	var acc=0;
		for(var i=i; i<n;i++){
			acc+= eval(func);
		}
		return acc;
	}
	
	function BezierCurve(t,p){
		var n = p.length;
		return Math.sum(n,0,'Math.nCr(n,i)*Math.pow('+ (1-t) +',(n-i))*Math.pow('+t+',i)*p[i]',p)
	}
	
	function factorial(n){
		var ex = n;
		if(n<=1)
		{
			return 1;
		}else{
			for(n = n-1;n>0;n--){
				ex = ex*n
			}
			return ex;
		}
	}
	
	function nCr(n,r){
		var ans = Math.factorial(n)/(Math.factorial(r)*Math.factorial(n-r))
		
		return ans;
	}
	
	function nPr(n,r){
		var ans = Math.factorial(n)/(Math.factorial(n-r))
		
		return ans;
	}
	
	function binomial(a,b,n){
		
		for(var i = n, r = 0,ans = 0; i > -1;i--)
		{
			ans += Math.nCr(n,r)*Math.pow(a,(n-r))*Math.pow(b,r)
			r++
		}
		return ans;
	}

	
	var Stats = {
		data:function(xn,yn){
			this.sumX = 0;
			for(var i = 0; i<xn.length;i++)
			{
				this.sumX += xn[i];
			}
			this.sumXSQ = 0;
			for(var i = 0; i<xn.length;i++)
			{
				this.sumXSQ += Math.pow(xn[i],2);
			}
			this.sumY = 0;
			for(var i = 0; i<yn.length;i++)
			{
				this.sumY += yn[i];
			}
			this.sumYSQ = 0;
			for(var i = 0; i<yn.length;i++)
			{
				this.sumYSQ += Math.pow(yn[i],2);
			}
			this.meanX = this.sumX/xn.length;
			this.meanY = this.sumY/yn.length;
		},
		dists:{
			Bin:function(n,p){
				return{
					mean:n*p,
					variance:n*p*(1-p),
					P:function(xn){
						return Math.nCr(n,xn)*Math.pow(p,xn)*Math.pow((1-p),n-xn)
					}
				}
			},
			Po:function(l){
				return{
					mean:l,
					variance:l,
					P:function(xn){
						return Math.pow(Math.E,-l)*(Math.pow(l,xn)/(Math.factorial(xn)))
					}
				}
			},
			Geo:function(p){
				return{
					mean:1/p,
					variance:(1-p)/Math.pow(p,2),
					P:function(xn){
						return p*Math.pow((1-p),(xn-1))
					}
				}
			}
			}
		}
	
	function vectorfield(x,y){
		this.x = x;
		this.y = y;
		this.getvector = function(x1,y1){
			var x = x1, y = y1;
			return new aghs.geom.vector2(eval(this.x),eval(this.y));		
		}
	}
	
	function numericalIntegration(func,x1,x2){
		var y = [], n = 500, h = (x2-x1)/n,j=0;
		for(var i=x1;i<x2;i+=h){
			y[j] = Math.solve(func,i);
			j++;
		}
		var first = y[0]+y[j-1];
		var second = null;
		for(var t = 1;t<j;t++){
			second+=y[t];
		}
		return((0.5*h*(first+2*(second))));
	}
	
	function firstnumdiff(res,x){
		if(typeof(res)=='function'){
				var func = function(x1){
				var results = res;
				var y = (results(x1+0.5)+results(x1+0.25)+results(x1-0.5)+results(x1-0.25)+results(x1))/5;
				return y;
				}
			
		}else{
		
		var func = function(x1){
				var results = res;
				x1 = Math.round(x1);
				var y = (results[(x1+1)]+results[(x1-1)]+results[x1])/3;
				return y
			};
			
		}
		if(typeof(res)=='function'){
		var h=0.00001;
		}else{
			h=1;
		}
		var first = func(x+h);
		var sec = func(x);
		return(((first-sec)/h));
	}
	
	function secnumdiff(res,x){
		if(typeof(res)=='function'){
		var h=0.00001;
		}else{
			h=1;
		}
		var first = Math.firstnumdiff(res,x+h)
		var sec = Math.firstnumdiff(res,x)
		return(((first-sec)/h));
	}
	
	function thirdnumdiff(res,x){
		if(typeof(res)=='function'){
		var h=0.00001;
		}else{
			h=1;
		}
		var first = Math.secnumdiff(res,x+h)
		var sec = Math.secnumdiff(res,x)
		return(((first-sec)/h));
	}
	
	function differentiate(string){
		var diffs = {
		'x':'1','Math.cos':'-1*Math.sin','Math.exp':'Math.exp','Math.sin':'Math.cos'			
		}
		
		
		var addparts = string.split('+');
		for(var i =0; i<addparts.length;i++){
			var multparts = addparts[i].split('*');
			for(var j = 0; j<multparts.length;j++){
				var outinparts = multparts[j].split('(')
				var outfunc = outinparts[0];
				if(outinparts[1]){
				var infunc = outinparts[1].split(')')[0];
				alert(diffs[infunc]+'*'+diffs[outfunc]+'('+infunc+')')
				}else{
				alert(diffs[outfunc])			
				}				
			}			
		}		
	}
	
	function solve(y,x){
			var parts2 = [],parts3 =[];
			var newparts2=0;
	
			parts2 = y.split('+');
			for(var i=0;i<parts2.length;i++)
				{
					if(parts2[i].indexOf('^')!=-1){
					var power = parts2[i].split('^')[1];
					var coeff = parts2[i].split('x')[0];
					if(power == null){power = 1};
					if(coeff == null || coeff ==''){coeff = 1};
					coeff = eval(coeff)
					power = eval(power)
		
					var xpower = Math.pow(x, power)
					var ans = coeff*xpower;
					}else{
						ans = eval('('+parts2[i]+');');
						}
					newparts2+= ans;
				}
			return newparts2;
		
		};
/*
Vector Calculus:

The following 2 functions provide numerical methods for doing 3 dimensional vector calculus with the divergence and the curl operators
*/		function div(vx,vy,vz,v){
		
				var funcx = function(x){
				var x1 = (vx(x+0.5,v[1],v[2])+vx(x+0.25,v[1],v[2])+vx(x-0.5,v[1],v[2])+vx(x-0.25,v[1],v[2])+vx(x,v[1],v[2]))/5;
				return x1;
				}
				var funcy = function(y){
				var y1 = (vy(v[0],y+0.5,v[2])+vy(v[0],y+0.25,v[2])+vy(v[0],y-0.5,v[2])+vy(v[0],y-0.25,v[2])+vy(v[0],y,v[2]))/5;
				return y1;
				}
				var funcz = function(z){
				var z1 = (vz(v[0],v[1],z+0.5)+vz(v[0],v[1],z+0.25)+vz(v[0],v[1],z-0.5)+vz(v[0],v[1],z-0.25)+vz(v[0],v[1],z))/5;
				return z1;
				}
			
		var h=0.00001;

		var firstx = funcx(v[0]+h);
		var secx = funcx(v[0]);
		var diffx = ((firstx-secx)/h);
		
		var firsty = funcy(v[1]+h);
		var secy = funcy(v[1]);
		var diffy = ((firsty-secy)/h);
		
		var firstz = funcz(v[2]+h);
		var secz = funcz(v[2]);
		var diffz = ((firstz-secz)/h);
		
		
		return(diffx+diffy+diffz);


}

	
function curl(vx,vy,vz,v){
		
				var funcxy = function(x){
				var x1 = (vy(x+0.5,v[1],v[2])+vy(x+0.25,v[1],v[2])+vy(x-0.5,v[1],v[2])+vy(x-0.25,v[1],v[2])+vy(x,v[1],v[2]))/5;
				return x1;
				}
				var funcyx = function(y){
				var y1 = (vx(v[0],y+0.5,v[2])+vx(v[0],y+0.25,v[2])+vx(v[0],y-0.5,v[2])+vx(v[0],y-0.25,v[2])+vx(v[0],y,v[2]))/5;
				return y1;
				}
				var funczy = function(z){
				var z1 = (vy(v[0],v[1],z+0.5)+vy(v[0],v[1],z+0.25)+vy(v[0],v[1],z-0.5)+vy(v[0],v[1],z-0.25)+vy(v[0],v[1],z))/5;
				return z1;
				}
				var funcxz = function(x){
				var x1 = (vz(x+0.5,v[1],v[2])+vz(x+0.25,v[1],v[2])+vz(x-0.5,v[1],v[2])+vz(x-0.25,v[1],v[2])+vz(x,v[1],v[2]))/5;
				return x1;
				}
				var funcyz = function(y){
				var y1 = (vz(v[0],y+0.5,v[2])+vz(v[0],y+0.25,v[2])+vz(v[0],y-0.5,v[2])+vz(v[0],y-0.25,v[2])+vz(v[0],y,v[2]))/5;
				return y1;
				}
				var funczx = function(z){
				var z1 = (vx(v[0],v[1],z+0.5)+vx(v[0],v[1],z+0.25)+vx(v[0],v[1],z-0.5)+vx(v[0],v[1],z-0.25)+vx(v[0],v[1],z))/5;
				return z1;
				}

			
		var h=0.00001;

		var firstxy = funcxy(v[0]+h);
		var secxy = funcxy(v[0]);
		var diffxy = ((firstxy-secxy)/h);
		
		var firstyx = funcyx(v[1]+h);
		var secyx = funcyx(v[1]);
		var diffyx = ((firstyx-secyx)/h);
		
		var firstzy = funczy(v[2]+h);
		var seczy = funczy(v[2]);
		var diffzy = ((firstzy-seczy)/h);
		
		var firstxz = funcxz(v[0]+h);
		var secxz = funcxz(v[0]);
		var diffxz = ((firstxz-secxz)/h);
		
		var firstyz = funcyz(v[1]+h);
		var secyz = funcyz(v[1]);
		var diffyz = ((firstyz-secyz)/h);
		
		var firstzx = funczx(v[2]+h);
		var seczx = funczx(v[2]);
		var diffzx = ((firstzx-seczx)/h);
		
		var vectorout = new aghs.geom.vector([diffyz-diffzy,diffxz-diffzx,diffxy-diffyx]);
		return(vectorout);


	}

	
	return {
		cube:cube,
		nCr:nCr,
		sum:sum,
		nPr:nPr,
		mod:mod,
		rads:rads,
		deg:deg,
		BezierCurve:BezierCurve,
		binomial:binomial,
		factorial:factorial,
		square:square,
		solve:solve,
		matrix:matrix,
		differentiate:differentiate,
		numericalIntegration:numericalIntegration,
		firstnumdiff:firstnumdiff,
		secnumdiff:secnumdiff,
		 thirdnumdiff: thirdnumdiff,
		quadraticformula:quadraticformula,
		complex:complex,
		Stats:Stats,
		vectorfield:vectorfield,
		div:div,
		curl:curl
		
	}
})())