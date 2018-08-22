var pos;
var vel;
var speed = 10;
var off = false;
var lifespan = 60;

class Bullet {
    constructor(x, y, r, playerSpeed) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.playerSpeed = playerSpeed;
        
        pos = new createVector(this.x, this.y);
        vel = createVector.fromAngle(this.r);
        vel.mult(speed + this.playerSpeed);
    }
}

function move() {
    lifespan --;
    if (lifespan<0) {
      off = true;
    } else {
      pos.add(vel);   
      if (isOut(pos)) {
        loopy();
      }
    }
  }


function show() {
    if (!off) {
      fill(255);
      ellipse(pos.x, pos.y, 3, 3);
    }
  }


function loopy() {
    if (pos.y < -50) {  pos.y = height + 50; } 
    else if (pos.y > height + 50) {  pos.y = -50;  }
    if (pos.x< -50) { pos.x = width +50; } 
    else if (pos.x > width + 50) { pos.x = -50; }
  }
 