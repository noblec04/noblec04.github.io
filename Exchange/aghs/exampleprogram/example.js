    if (!window.Applications)
	window.Applications = {};
	
var word = (function()
{
	function handleLoad(contain) 
	{
		this.ui = this.UI(contain);
		
		/*aghs.Event.add(this.ui.password,"onClick",this.handleMouseClick);
		aghs.Event.add(this.ui.username,"onClick",this.handleMouseDown);
		aghs.Event.add(this.ui.submit,"onClick",this.handleMouseUp);
		this.ui.submit.onClick = this.handleMouseClick;*/
	};
	
	function UI(contain){
		var password = new aghs.element.textbox(contain,5,100);
		var username = new aghs.element.textbox(contain,40,100)
		var submit1 = new aghs.element.button(contain,60,100,'login')
		
		submit1.setValue('boom it works still')
		submit1.addEvent('click',handleMouseClick);
		submit1.css({opacity:0});
		submit1.fx('opacity',0,1,80,null)/*.finished.addHandler(function(){*/;submit1.fx('width',100,150,70,aghs.tween.bounceEaseOut)//})
		
		return{
			password:password,
			username:username,
			submit1:submit1
		}
	}
	
	// Sample event handlers
	function handleMouseClick(e) 
	{
		alert('mousedown');
	};
	
	function handleMouseDown(e) 
	{
		alert('mousedown');
	};
	
	function handleMouseUp(e) 
	{
		// Put clicked logic here
		alert("up");
	};
	return{
		handleLoad:handleLoad,
		UI:UI,
		handleMouseClick:handleMouseClick,
		handleMouseDown:handleMouseDown,
		handleMouseUp:handleMouseUp
	}
}
)()
Applications.Word = {};
aghs.extend(Applications.Word,word)

Applications.Word.handleLoad(get('main'));