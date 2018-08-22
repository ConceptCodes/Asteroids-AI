var pos;
var vel;
var size = 3;
var radius = 60;
var chunks = [];
var split = false;

class Asteroid {
    constructor(posX, posY, velX, velY) {
        this.posX = posX;
        this.posY = posY;
        this.velX = velX;
        this.velY = velY;
        pos = new createVector(this.posX, this.posY);
        vel = new createVector(this.velX, this.velY);
        vel.normalize();
        vel.mult(0.75);
    }
}

function show(){
    if(split) {
        chunks.forEach(i => { i.show(); });
    } else {
        noFill();
        stroke(255);
        ellipse(pos.x, pos.y, radius, 12);
    }
}

function move() {
    if (split) { chunks.forEach(i => { i.move(); }); } 
    else {
        pos.add(vel);
        if (isOut(pos)) { loopy(); }
    }
}

function loopy() {
    if (pos.y < -50) { pos.y = height + 50; }
    else if (pos.y > height + 50) {  pos.y = -50;  }
    if (pos.x < -50) {  pos.x = width +50; }
    else if (pos.x > width + 50) { pos.x = -50;  }
  }

function checkIfHit( bulletPos) {
    if (split) {
      chunks.forEach( i => { if (a.checkIfHit(bulletPos)) {  return true;  } });
      return false;
    } else {
      if (dist(pos.x, pos.y, bulletPos.x, bulletPos.y)< radius) {
        isHit();
        return true;
      }
      return false;
    }
  }

function checkIfHitPlayer(playerPos) {
    if (split) {
        chunks.forEach( i => { if (a.checkIfHitPlayer(playerPos)) { return true; }});
        return false;
    } else {
        if (dist(pos.x , pos.y , playerPos.x , playerPos.y ) < radius + 15) {
            isHit();
            return true;
        }
        return false;
    }
}

function lookForHit(bulletPos) {
    if (split) {
        chunks.forEach( i => { 
            if (i.lookForHit(bulletPos)) { return true;}});
            return false;
    } else {
        if (dist(pos.x , pos.y , bulletPos.x , bulletPos.y) < radius) {
            return true;
        }
        return false;
    }
}

function isHit() {
    split = true;
    if (size == 1) {
      return;
    } else {
      var velocity = new createVector(vel.x,vel.y);
      velocity.rotate(-0.3);
      chunks.add(new Asteroid(pos.x, pos.y, velocity.x, velocity.y , size-1)); 
      velocity.rotate(0.5);
      chunks.add(new Asteroid(pos.x, pos.y, velocity.x, velocity.y , size-1)); 
    }
  }
