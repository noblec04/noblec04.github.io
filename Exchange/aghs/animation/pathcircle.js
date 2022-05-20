/*==================================================*
  Filename: animPathCircle-01.js
  Javascript animation path code.
  Circular path
  To be use with 'animationBasic.js'

  Date     Description                          By
  --------|------------------------------- ----|----
  16Jul07  Initial release for tutorial use     arc
 *==================================================*/

// creates circular path object
function circle(initPos, radius, angle0, stepSize)
{
  this.rad = radius;
  this.startAngle = angle0;
  this.aStep = stepSize;        // angle per step
  this.cx = initPos.x - this.rad * Math.cos(angle0 * PIon180);   // coords of centre
  this.cy = initPos.y - this.rad * Math.sin(angle0 * PIon180);
  this.currX = initPos.x;
  this.currY = initPos.y;
}

circle.prototype.nextStep = function(index)
{
  var angle = this.startAngle - index * this.aStep;  // +ve angles are cw, we want ccw
  this.currX = this.cx + this.rad * Math.cos(angle * PIon180);
  this.currY = this.cy + this.rad * Math.sin(angle * PIon180);

  return new pos(this.currX, this.currY);
}

