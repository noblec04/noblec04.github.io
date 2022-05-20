/*==================================================*
  Filename: animationPaths-01.js
  Javascript animation path code.
  Free fall under gravity
  To be use with 'animationBasic.js'

  Date     Description                          By
  --------|------------------------------- ----|----
  16Jul07  Initial release for tutorial use     arc
 *==================================================*/

// FreeFall path object
function size(w, h)
{
  this.width = w;
  this.height = h;
}

function getElementSize(id)
{
  var docObj = document.getElementById(id);

  var w = docObj.offsetWidth;   // value in pixels
  var h = docObj.offsetHeight;

  return new size(w, h);
}

function boundary(left, top, width, height, reflect)
{
  this.left = left;
  this.right = left + width;
  this.top = top;
  this.bottom = top + height;
  this.reflect = reflect;    // bounce off wall else disappear
}

function freeFall(id, initPos, slope, speed, walls)     // speed in m/sec = mm/msec
{
  var px_mm = 3;  // = 75px/25.4mm
  // velocity 1m/s = 1 mm/ms = 1mm/ms * px/mm * ms/tick
  var vel = speed * px_mm * tickInt;

  this.elemSize = getElementSize(id);       // size object
  this.currX = initPos.x;
  this.currY = initPos.y;
  this.xVel = vel * Math.cos(slope * PIon180);
  this.yVel = vel * Math.sin(slope * PIon180);
  this.walls = walls;

  //   gravity = 9.8m/s/s = 0.0098mm/ms/ms = 0.0098* ms/tick*ms/tick * px/mm
  this.gravity = 0.0098 * px_mm * tickInt * tickInt;
}

freeFall.prototype.nextStep = function(index)
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
    else
      this.yVel *= -0.8;    // lossy reflection next step
  }
  if (y < this.walls.top)
  {
    y = this.walls.top;
    this.yVel = -0.8 * this.yVel;    // lossy reflection next step
  }

  this.currX = x;
  this.currY = y;
  return new pos(this.currX, this.currY);
}
