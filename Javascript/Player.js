var pos;
var vel;
var acc;
var score = 0;
var shootCount = 0;
var rotation;
var spin;
var maxSpeed = 10;
var boosting = false;
var bullets = new Array();
var asteroids = new Array(); 
var asteroidCount = 1000;
var lives = 0;
var dead = false;
var immortalCount = 0;   
var boostCount = 10;
var brain;
var vision = 8.0; 
var decision = 4.0; 
var replay = false;
var SeedUsed; 
var seedsUsed = new Array();
var upToSeedNo = 0;
var fitness;
var shotsFired = 4;
var shotsHit = 1;
var lifespan = 0;
var canShoot = true;

class Player {
    constructor() {
      pos = new createVector(width/2, height/2);
      vel = new createVector();
      acc = new createVector();  
      rotation = 0;
      SeedUsed = floor(random(1000000000));
      randomSeed(SeedUsed);
  
      
      asteroids.add(new Asteroid(random(width), 0, random(-1, 1), random (-1, 1)));
      asteroids.add(new Asteroid(random(width), 0, random(-1, 1), random (-1, 1)));
      asteroids.add(new Asteroid(0, random(height), random(-1, 1), random (-1, 1)));
      asteroids.add(new Asteroid(random(width), random(height), random(-1, 1), random (-1, 1)));
      
      var randX = random(width);
      var randY = -50 +floor(random(2))* (height+100);
      asteroids.add(new Asteroid(randX, randY, pos.x- randX, pos.y - randY));     
      brain = new NeuralNet(9, 16, 4);
    }

     move() {
      if (!dead) {
        checkTimers();
        rotatePlayer();
        if (boosting) {
          boost();
        } else {
          boostOff();
        }
  
        vel.add(acc);
        vel.limit(maxSpeed);
        vel.mult(0.99);
        pos.add(vel);
  
        for (var i = 0; i < bullets.size(); i++) {
          bullets.get(i).move();
        }
  
        for (var i = 0; i < asteroids.size(); i++) {
          asteroids.get(i).move();
        }
        if (isOut(pos)) {
          loopy();
        }
      }
    }

 checkTimers() {
      lifespan +=1;
      shootCount --;
      asteroidCount--;
      if (asteroidCount<=0) {
  
        if (replay) {
          randomSeed(seedsUsed.get(upToSeedNo));
          upToSeedNo ++;
        } else {
          var seed = floor(random(1000000));
          seedsUsed.add(seed);
          randomSeed(seed);
        }
        
        var randX = random(width);
        var randY = -50 +floor(random(2))* (height+100);
        asteroids.add(new Asteroid(randX, randY, pos.x- randX, pos.y - randY));
        asteroidCount = 1000;
      }
      
      if (shootCount <=0) {
        canShoot = true;
      }
    }
  
  
     boost() {
      acc = createVector.fromAngle(rotation); 
      acc.setMag(0.1);
    }
  
    boostOff() {
      acc.setMag(0);
    }

    rotatePlayer() {
      rotation += spin;
    }

    show() {
      if (!dead) {
        for (var i = 0; i < bullets.size(); i++) {
          bullets.get(i).show();
        }
        if (immortalCount >0) {
          immortalCount --;
        }
        if (immortalCount >0 && floor((immortalCount)/5)%2 ==0) {
        } else {
          pushMatrix();
          translate(pos.x, pos.y);
          rotate(rotation);
          fill(0);
          noStroke();
          beginShape();
          var size = 12;
          vertex(-size-2, -size);
          vertex(-size-2, size);
          vertex(2* size -2, 0);
          endShape(CLOSE);
          stroke(255);
          line(-size-2, -size, -size-2, size);
          line(2* size -2, 0, -22, 15);
          line(2* size -2, 0, -22, -15);
          if (boosting ) {
            boostCount --;
            if (floor((boostCount)/3)%2 ==0) {
              line(-size-2, 6, -size-2-12, 0);
              line(-size-2, -6, -size-2-12, 0);
            }
          }
          popMatrix();
        }
      }
      for (var i = 0; i < asteroids.size(); i++) {
        asteroids.get(i).show();
      }
    }

     shoot() {
      if (shootCount <=0) {
        bullets.add(new Bullet(pos.x, pos.y, rotation, vel.mag()));
        shootCount = 30;
        canShoot = false;
        shotsFired ++;
      }
    }

     update() {
      for (var i = 0; i < bullets.size(); i++) {
        if (bullets.get(i).off) {
          bullets.remove(i);
          i--;
        }
      }    
      move();
      checkPositions();
    }

     checkPositions() {
      for (var i = 0; i < bullets.size(); i++) {
        for (var j = 0; j < asteroids.size(); j++) {
          if (asteroids.get(j).checkIfHit(bullets.get(i).pos)) {
            shotsHit ++;
            bullets.remove(i);
            score +=1;
            break;
          }
        }
      }
      if (immortalCount <=0) {
        for (var j = 0; j < asteroids.size(); j++) {
          if (asteroids.get(j).checkIfHitPlayer(pos)) {
            playerHit();
          }
        }
      }
    }

     playerHit() {
      if (lives == 0) {
        dead = true;
      } else {
        lives -=1;
        immortalCount = 100;
        resetPositions();
      }
    }

     resetPositions() {
      pos = new createVector(width/2, height/2);
      vel = new createVector();
      acc = new createVector();  
      bullets = [];
      rotation = 0;
    }
     loopy() {
      if (pos.y < -50) {
        pos.y = height + 50;
      } else
        if (pos.y > height + 50) {
          pos.y = -50;
        }
      if (pos.x< -50) {
        pos.x = width +50;
      } else  if (pos.x > width + 50) {
        pos.x = -50;
      }
    }
  

     calculateFitness() {
      var hitRate = shotsHit/shotsFired;
      fitness = (score+1)*10;
      fitness *= lifespan;
      fitness *= hitRate*hitRate;
    }
  
   
     mutate() {
      brain.mutate(globalMutationRate);
    }
    
    
    clone() {
      var clone = new Player();
      clone.brain = brain.clone();
      return clone;
    }
   
     cloneForReplay() {
      var clone = new Player(SeedUsed);
      clone.brain = brain.clone();
      clone.seedsUsed = seedsUsed.clone();
      return clone;
    }
  
    
     crossover(parent2) {
      var child = new Player();
      child.brain = brain.crossover(parent2.brain);
      return child;
    }
    
     look() {
      vision = 9.0;
      direction;
      for (var i = 0; i< vision.length; i++) {
        direction = createVector.fromAngle(rotation + i*(PI/4));
        direction.mult(10);
        vision[i] = lookInDirection(direction);
      }
  
      if (canShoot && vision[0] !=0) {
        vision[8] = 1;
      } else {
        vision[8] =0;
      }
    }
    
  
  
    lookInDirection(direction) {
      osition = new PVector(pos.x, pos.y);
      distance = 0;
      position.add(direction);
      distance +=1;
      while (distance< 60) {
        for (var a of asteroids) {
          if (a.lookForHit(position) ) {
            return  1/distance;
          }
        }
  
        position.add(direction);
  
        if (position.y < -50) {
          position.y += height + 100;
        } else
          if (position.y > height + 50) {
            position.y -= height -100;
          }
        if (position.x< -50) {
          position.x += width +100;
        } else  if (position.x > width + 50) {
          position.x -= width +100;
        }
  
  
        distance +=1;
      }
      return 0;
    }
    
  
     savePlayer(playerNo, score, popID) {
      var playerStats = new Table();
      playerStats.addColumn("Top Score");
      playerStats.addColumn("PopulationID");
      var tr = playerStats.addRow();
      tr.setFloat(0, score);
      tr.setInt(1, popID);
  
      saveTable(playerStats, "data/playerStats" + playerNo+ ".csv");
  
      saveTable(brain.NetToTable(), "data/player" + playerNo+ ".csv");
    }
    
  
    loadPlayer(playerNo) {
      var load = new Player();
      var t = loadTable("data/player" + playerNo + ".csv");
      load.brain.TableToNet(t);
      return load;
    }
  
        
     think(){
      decision = brain.output(vision);
  
      if (decision[0] > 0.8) {
        boosting = true;
      } else {
        boosting = false;
      }
      if (decision[1] > 0.8) {
        spin = -0.08;
      } else {
        if (decision[2] > 0.8) {
          spin = 0.08;
        } else {
          spin = 0;
        }
      }
      if (decision[3] > 0.8) {
        shoot();
      }
    }
  }