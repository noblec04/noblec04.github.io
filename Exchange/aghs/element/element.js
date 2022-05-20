/*
aghs.element
This file provides shortcut acces to functions in other files, allowing methods to be applied directly to page elements, rather than the element having to be referenced as a variable passed to a function, the element can be held in an object and the shortcut methods called from that object.

A number of methods at the end also provide a way of creating dynamic elements with javascript.
*/

aghs.element = {}
aghs.element.id = 0;
elementMethods = {
	setValue:function(value){this.value = value},
	write:function(value){this.innerHTML = value},
    addEvent:function(evnt, fn)
	{
		if (window.addEventListener){
			this.addEventListener(evnt, fn, false);
			} else if(window.attachEvent){
				var f = function(){
					fn.call(this, window.event);
					};			
				this.attachEvent('on' + evnt, f)
			}
	},
	show:function(){
		this.style.display = 'block';
		return this;
	},		
	hide:function(){
		this.style.display = 'none';
		return this;
	},
	append:function(o,id){
		var newobj = document.createElement(o)
		newobj.id = id;
		this.appendChild(newobj);
		return aghs.extend(newobj,elementMethods);
	},
	z:null,
	ajaxHTML:function(url){
		var obj = this;
		aghs.ajax.get(url,function(r){obj.innerHTML +=r})
	},
	
	front:0,
	set3dPosition:function(v3){
		this.style.top = v3.y;
		this.style.left = v3.x;
		this.front = v3.z;
		
		var zno = v3.z * 0.03;
		var width = this.width;
		var height = this.height;
		var zindex = this.style.zindex;
		this.width = (width - zno).toString();
		this.height = (height - zno).toString();
		this.style.zindex = (zindex - zno).toString();
		
		return this;
	},
	matrixTransform:function(m){
		var ma = Math.matrix([
							  [parseInt(this.style.left)],
							  [parseInt(this.style.top)]
							 ])
		var mb = ma.vectorTransform(m);
		this.style.left = mb[0][0];
		this.style.top = mb[1][0];
	},
	step:5,
	css:function(props){
		if(typeof(props)=='object'){
		for(var bits in props){
			if(bits == 'opacity'){this.style.filter = 'alpha(opacity = '+ props[bits] + ')'; this.style.opacity = props[bits]/100 }else{
			this.style[bits] = props[bits]
			}
		}
		}else{return this.style[props]}
	},
	/*fx: function(type,from,to,duration,tween){
		switch(type)
		{
		case 'path':
		return aghs.animatePath(this.id,new aghs.path.line(new aghs.geom.vector2(parseInt(this.style.left),parseInt(this.style.top)),new aghs.geom.vector2(to.x,to.y)),500).start();
		break;
		default:
		return aghs.animate(this,type,from,to,duration,tween).start();
		break;
		}
	}*/
	fx: function(props){
		var f = aghs.animator(this,props);
		f.start();
		return f;
	},
	expand:function(dir,to){
		switch(dir){
			case'down'||'height':return this.fx({height:{end:to,duration:10}});break;
			case'left'||'width':return this.fx({width:{end:to,duration:10}});break;
		}
	},
	setDrag:function(postype,props){
		this.css({position:postype})
		aghs.extend(this,props);
		this.className = 'dragme';
		aghs.extend(this,{onDrag:new aghs.Event()})
		return this
	}
}

document.getElementsByClassName = function(className) {
	var children = document.getElementsByTagName('*') || document.all;
	var elements = new Array();
  
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		var classNames = child.className.split(' ');
		for (var j = 0; j < classNames.length; j++) {
			if (classNames[j] == className) {
				elements.push(child);
				break;
			}
		}
	}
	return elements;
}

function get(obj){
	
	if(typeof(obj.fx)=='function'){
	return obj;
	}else{if(typeof(obj)=='object'){
		return aghs.extend(obj,elementMethods)
	}
	}
	
	if(document.getElementById(obj)){
		
	return aghs.extend(document.getElementById(obj),elementMethods)
	
	}
	
	if(document.getElementsByClassName(obj)){
		var obs = document.getElementsByClassName(obj),obse=[];
		for(var i =0; i<obs.length;i++){
			obse[i] = aghs.extend(obs[i],elementMethods)
		}
		return obse;
	}
	
	if(document.getElementsByTagName(obj)){
		var obs = document.getElementByTagName(obj),obse=[];
		for(var i =0; i<obs.length;i++){
			obse[i] = aghs.extend(obs[i],elementMethods)
		}
		return obse;						 
	}
	
	if(document.getElementsByName(obj)){
		var obs = document.getElementByName(obj),obse=[];
		for(var i =0; i<obs.length;i++){
			obse[i] = aghs.extend(obs[i],elementMethods)
		}
		return obse;
	}
	
	
}
aghs.extend(aghs.element,(function(){
								   
		function element(prop){
			var obj = document.createElement(prop.tag);
			for(key in prop)
			{
				obj[key] = prop[key];
			}
			(obj.container || document.getElementsByTagName('body')[0]).appendChild(obj);
			return aghs.extend(obj,elementMethods);
		}
		function drag(container,x,y,hhv,lhv,hvv,lvv,src,id){
			var container = (container || document.getElementsByTagName('body')[0]);
			var object = element({
								 tag:'img',
								 id:id,
								 hhl:hhv,lhl:lhv,hvl:hvv,lvl:lvv,
								 className:'dragme',
								 src:src,
								 ondrag:new aghs.Event()
								 })
			object.style.position = 'absolute';
			
			
			return object;
		}
		function textbox(container,x,y,id){
			var container = (container || document.getElementsByTagName('body')[0]);
			var object = document.createElement('input');
			object.type = 'text';
			object.style.position = 'relative';
			object.style.top = y + 'px';
			object.style.left = x + 'px';
			object.id = (id || aghs.element.id++)
			container.appendChild(object);
			return get(object.id);

		}
		function input(container,x,y,id,type){
			if (typeof(container)== 'string')container = get(container);
			var container = (container || document.getElementsByTagName('body')[0]);
			var object = document.createElement('input');
			object.type = type;
			object.style.position = 'relative';
			object.style.top = y + 'px';
			object.style.left = x + 'px';
			object.id = (id || aghs.element.id++);
			object.name = id;
			container.appendChild(object);
			return get(object.id);

		}
		function button(container,x,y,value,id){
			var container = (container || document.getElementsByTagName('body')[0]);
			var object = document.createElement('input');
			object.type = 'button';
			object.value = (value || 'button');
			object.style.position = 'relative';
			object.id = (id || aghs.element.id++)
			object.style.top = y + 'px';
			object.style.left = x + 'px';
			container.appendChild(object);
			return get(object.id);
		}
		function graphic(container,x,y,id,src){
			var container = (get(container) || document.getElementsByTagName('body')[0]);
			var object = document.createElement('img');
			object.type = 'text';
			object.style.position = 'absolute';
			object.style.top = y + 'px';
			object.style.left = x + 'px';
			object.src = src
			object.id = (id || aghs.element.id++)
			container.appendChild(object);
			return get(object.id);
		}
		function div(container,x,y,id){
			if (typeof(container)== 'string')container = get(container);
			var container = (container || document.getElementsByTagName('body')[0]);
			var object = document.createElement('div');
			object.style.position = 'relative';
			object.style.top = y + 'px';
			object.style.left = x + 'px';
			object.id = (id || aghs.element.id++)
			container.appendChild(object);
			return get(object.id);
		}
		function form(container,x,y,id,action){
			var container = (container || document.getElementsByTagName('body')[0]);
			var object = document.createElement('form');
			object.style.position = 'relative';
			object.style.top = y + 'px';
			object.style.left = x + 'px';
			object.action = action;
			object.id = (id || aghs.element.id++)
			container.appendChild(object);
			return get(object.id);

		}
		function Flash(container,x,y,id,src,params){
			var container = (container || document.getElementsByTagName('body')[0]);
			var object = document.createElement('object');
			var parameters = [];
			
			object.style.position = 'absolute'
			object.style.top = y;
			object.style.left = x;
			
			parameters[0] = document.createElement('param');
			parameters[0].name = 'source'
			parameters[0].value = src;
			
			container.appendChild(object);
			
			for(var j=1;j<params.length;j++){
				
				parameters[j] = document.createElement('param');
				parameters[j].name = params[j].name;
				parameters[j].value = params[j].value;
				
				object.appendChild(parameters[j])
				
			}
			var embed = document.createElement('embed');
			embed.src = src;
			object.appendChild(embed);
		}
		
		function fileuploader(container,x,y,id){
			var div = element({
								 tag:'div',
								 id:id
								 });
				div.css({top:x, left:y});
			var form = form(div,0,0,id+'form','')
		}
		
		function iframe(container,x,y,id,src){
			var container = (container || document.getElementsByTagName('body')[0]);
			var object = document.createElement('iframe');
			object.style.position = 'relative';
			object.style.top = y + 'px';
			object.style.left = x + 'px';
			object.id = (id || aghs.element.id++)
			object.name = id;
			object.src = src;
			container.appendChild(object);
			return get(object.id);
		}
		return{
			Flash:Flash,
			drag:drag,
			textbox:textbox,
			button:button,
			graphic:graphic,
			div:div,
			iframe:iframe,
			input:input,
			element:element,
			form:form
		}
})())