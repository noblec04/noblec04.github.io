/*
Physics:
this adds a much needed physics module to the available maths module :), it stores a list of universal constants in SI units and functions for field strengths of different forces.
*/
window['Physics'] = {};

aghs.extend(Physics,(function(){
						   
		/*
		s = the distance between initial and final positions (displacement) (sometimes denoted R or x)
		u = the initial velocity (speed in a given direction)
		v = the final velocity
		a = the constant acceleration
		t = the time taken to move from the initial state to the final state
		*/
		var C = 3 * Math.pow(10,8);//speed of light
		var h = 6.63 * Math.pow(10,-34);//plank constant
		var g = 9.81;// earths gr field strength
		var E0 = 8.81*Math.pow(10,-12);// epsilon 0 - the permittivity of free space
		var G = 6.67*Math.pow(10,-11);// gravitational constant
		var U0 = 4*Math.PI*Math.pow(10,-7);// permeabillity of free space
		
		function acceleration(v,a,u,t){
			if(v==null){
			return u+a*t
			}
			if(a==null){
				return (v-u)/t
			}
			if(u==null){
				return v-a*t
			}
			if(t==null){
				return (v-u)/a
			}
			//v=u+at
		}
		
		function displacment(s,u,v,t){
			if(s==null){
				return (1/2)*(u+v)*t
			}
			if(u==null){
				return ((2*s)/t)-v
			}
			if(v==null){
				return ((2*s)/t)-u
			}
			if(t==null){
				return (2*s)/(u+v)
			}
			//s=(1/2)*(u+v)*t
		}
		
		function displacment2(s,a,u,t){
			if(s==null){
				return u*t+1/2*a*Math.pow(t,2)
			}
			if(u==null){
				return (2*s - a*Math.pow(t,2))/(2*t)
			}
			if(a==null){
				return (2*s - 2*u*t)/Math.pow(t,2);
			}
			if(t==null){
				return false
			}
			//s=u*t+1/2*Math.pow(a*t,2)
		}
		
		function displacment3(s,a,v,t){
			if(s==null){
				return v*t-1/2*a*Math.pow(t,2)
			}
			if(v==null){
				return (2*s + Math.pow(v*t,2))/(2*t)
			}
			if(a==null){
				return (2*v*t - 2*s )/Math.pow(t,2);
			}
			if(t==null){
				return false
			}
			//s=v*t-1/2*Math.pow(a*t,2)
		}
		
		function velocitySQ(v,a,u,s){
			v=Math.sqrt(Math.pow(u,2)+2*a*s)
		}
		
		function force(f,m,a){
			if(f==null){
			return m*a;
			}
			if(m==null){
			return f/a;
			}
			if(a==null){
			return f/m;
			}
		}
		
		function energyMass(E,m,v){
			if (E==null){
				return Math.sqrt( Math.pow(m,2) * Math.pow(Physics.C,4) + Math.pow(m*v,2) * Math.pow(Physics.C,2) )
			}
			if(m==null){
				return Math.sqrt(Math.pow(E,2)/(Math.pow(Physics.C,4)+Math.pow(v,2)*Math.pow(Physics.C,2)))
			}
			if(v==null){
				return Math.sqrt((Math.pow(E,2)-Math.pow(m,2) * Math.pow(Physics.C,4))/(Math.pow(m*v,2) * Math.pow(Physics.C,2)))
			}
		}
		
		function movingMass(m,v){
			return m/Math.sqrt(1-Math.pow(v,2)/Math.pow(Physics.C,2))
		}
		
		function angularv(theta,t){
			return theta/t;
		}
		
		function linearv(w,r){
			return w*r;
		}
		
		function centripetal(w,r,m){
			return Math.pow(w,2)*r*m;
		}
		
		function EField(q,d){
			return (1/(4*Math.PI*Physics.E0))*(q/(d*d));
		}
		
		function GField(m,ri,pos){
			var vec = new aghs.geom.vector2(0,0);
			for(var i=0;i<m.length;i++){
				var mag = ri[i].subtract(pos).length*-1;
				var uv = ri[i].subtract(pos).scale(1/mag)
				var f = uv.scale(1/Math.pow(mag,2));
				var v = f.scale(m[i])
				vec = vec.add(v);
			}
			vec = vec.scale(Physics.G)
			return vec;
		}
		function GForce(m1,m2,r1,r2){
			var M = m1*m2;
			var R = r2.subtract(r1);
			var R2 = R.scale(M*(-Physics.G));
			var f=R2.scale(1/Math.pow(R2.length,3))
			
			return f;
		}
		
		function magneticfluxd(i,r){
			return (U0 * i)/(2*Math.PI*r);
		}
		function magneticflux(i,r,a){
			return magneticfluxd(i,r)*a
		}
		
		function Magneticforce(i1,i2,l,r){
			return magneticfluxd(i1,r)*i2*l;
		}
		function EFE(T){
			var G = [];
			for(var i=0;i<3;i++){
				G[i] = [];
			}
			
			for(var i=0;i<3;i++){
				for(var j=0;j<3;j++){
					G[i][j] = 8*Physics.G*Math.PI*(1/Math.pow(Physics.C,4))*T[i][j];
				}
			}
			
			return G;
			
		}
		return {
		C:C,
		h:h,
		g:g,
		G:G,
		E0:E0,
		acceleration:acceleration,
		displacment:displacment,
		displacment2:displacment2,
		displacment3:displacment3,
		velocitySQ:velocitySQ,
		force:force,
		energyMass:energyMass,
		movingMass:movingMass,
		angularv:angularv,
		linearv:linearv,
		centripetal:centripetal,
		magneticfluxd:magneticfluxd,
		magneticflux:magneticflux,
		Magneticforce:Magneticforce,
		Magneticforce:Magneticforce,
		EFE:EFE,
		EField:EField,
		GField:GField,
		GForce:GForce		
	}
})())