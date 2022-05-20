var 
Ve = function(ar){return new aghs.geom.vector(ar)},
v2 = function(x,y){return new aghs.geom.vector2(x,y)},
v3 = function(x,y,z){return new aghs.geom.vector3(x,y,z)},
line = aghs.path.line,
circle = aghs.path.circle,
rectangle = aghs.path.rectangle,
appendtofile = aghs.io.appendTo,
writetofile = aghs.io.writeTo,
ajaxPOST = aghs.ajax.post,
ajaxGET = aghs.ajax.get,
ajaxUpdater = aghs.ajax.updater
// JavaScript Document