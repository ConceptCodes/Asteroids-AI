var humanPlayer;
var speed = 100;
var MutationRate = 0.001;
var showBest = true;
var runBest =  false;
var humanPlaying = false;


function setup() {
	createCanvas(windowWidth, windowHeight);
	humanPlayer = new Player();
	pop = new Population(200);
	frameRate(speed);
}

function draw() {
	background(0); 
	if (humanPlaying) {
	  if (!humanPlayer.dead) {
		humanPlayer.update();
		humanPlayer.show();
	  } else {
		humanPlaying = false;
	  }
	} else 
	if (runBest) {
	  if (!pop.bestPlayer.dead) {
		pop.bestPlayer.look();
		pop.bestPlayer.think();
		pop.bestPlayer.update();
		pop.bestPlayer.show();
	  } else {
		runBest = false;
		pop.bestPlayer = pop.bestPlayer.cloneForReplay();
	  }
	} else {
	  if (!pop.done()) {
		pop.updateAlive();
	  } else {
		pop.calculateFitness(); 
		pop.naturalSelection();
	  }
	}
	showScore();
  }

function keyPressed() {
	switch(key) {
		case ' ':
			if (humanPlaying) {
				humanPlayer.shoot();
			} else {
				showBest = !showBest;
			}
			break;
		case '+':
			speed += 10;
			frameRate(speed);
			console.log(speed);
			break;
		case 'h':
			MutationRate /= 2;
			console.log(MutationRate);
			break;
		case 'b':
			runBest = true;
			break;
	}

	if (key == CODED) {
		if (keyCode == UP) {
			humanPlayer.bootstring = true;
		}
		if (keyCode == LEFT) {
			humanPlayer.spin = -0.08;
		} else if  (keyCode == RIGHT) {
			humanPlayer.spin = 0.08;
		}
	}
}

function keyReleased() {
	if (key == CODED) {
		if (keyCode == UP) {
			humanPlayer.bootstring = false;
		}
		if (keyCode == LEFT) {
			humanPlayer.spin = 0;
		} else if  (keyCode == RIGHT) {
			humanPlayer.spin = 0;
		}
	}
}

function isOut(pos) {
	if (pos.x < -50 || pos.y < -50 || pos.x > width+ 50 || pos.y > 50+height) {
		return true;
	}
	return false;
}

function showScore() {
	if (humanPlaying) {
		fill(255);
		textAlign(LEFT);
		text('Score: ' + humanPlayer.score, 80, 60);
	} 
	  if (runBest) {
		  fill(255)
		  textAlign(LEFT);
		  text("Score: " + pop.bestPlayer.score, 80, 60);
		  text("Gen " + pop.gen, width-200, 60);
	  }  else {
		  if (showBest) {
			  fill(255);
			  textAlign(LEFT);
			  text("Score: " + pop.players[0].score, 80, 60);
			  text("Gen: " + pop.gen, width-200, 60);
		  }
	  }
}

