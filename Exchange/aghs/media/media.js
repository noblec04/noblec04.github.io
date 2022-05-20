// JavaScript Document
aghs.media = {}
aghs.extend(aghs.media,(function(){
	
	var mediaplayer = {
		wmp:'09889798790809',
		quicktime:'8987879709'		
		}
	
	var mediano = 0;
	
	function sound(url, player, ui){
		var playerid = mediaplayer[player];
		ui = ui?true:false;
		var ob = aghs.element.element({
							   tag:'embed',
							   id:'sound'+mediano,
							   src: url,
							   ui:ui
							   })
		if(player == 'wmp')
		{
			return{
				play:ob.play,
				pause:ob.pause,
				stop:ob.stop,
				mute:function(v){
					ob.mute = v
				}
			}
		}
		mediano++;
	}
	
	return{
		sound:sound
	}
	
})())