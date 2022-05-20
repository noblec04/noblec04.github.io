// This file was going to build toward implementing a very basic simulation of a hardware logic circuit.
aghs.logic = {}

aghs.extend(aghs.logic,(function(){
							
function not(){
	var t;
	for(var i=0;i<arguments.length;i++){
		if(arguments[i]){
			t = true;
		}
	}
	
	if(t)return false
	
	if(!t)return true
	
}

function and(){
	var tr,fa;
	if(arguments.length<2)return false
	
	for(var i=1;i<arguments.length;i++){
		if(arguments[i]==arguments[i-1]){
			tr = true;
		}else{
			fa = true
			tr = false;
		}
	}
	
	if(fa) return false
	if(!fa) return true
	
}
	
	return{
	not:not,
	and:and
	}
	
	})())