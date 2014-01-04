// Canvas variables
var c = document.getElementById("canvas"); // Canvas
var canvasHeight = 600, canvasWidth = 600; // hard coded in the html
var ctx = c.getContext("2d");

var squaresize = 20;
var fps = 10;
var gameSpeed = 1000/fps;
var xTiles = canvasWidth/squaresize;
var yTiles = canvasHeight/squaresize;

// Movement variables
var dif = squaresize; // Stepsize

// Game loop element
var t;

var score = 0;

var shouldAddSlowFruit = false;
var shouldAddSpeedFruit = true;
var speedDif = 8;

var isPlaying = false;
var dead = false;
var hasMoved = false;

randomizePosition = function(object) {
	object.x = Math.floor(Math.random()*(xTiles-1))*squaresize;
	object.y = Math.floor(Math.random()*(yTiles-1))*squaresize;
}


function Head() {
	this.width = squaresize;
	this.height = squaresize;
	this.dir = "down";
	this.child = null;
	this.shouldAddChild = false;

	this.ateItself = function() {
		if(this.child) {
			if(this.child.collides(this.x, this.y)) {
				// Snake ate itself, end game
				return true;
			}
		}
		return false;
	}

	this.update = function() {
		var prev_x = this.x,
			prev_y = this.y;

		if (head.dir == "left") {
			this.x = this.x - dif;
			if (this.x < 0)
				this.x = 580;
		} else if (head.dir == "up") {
			this.y = this.y - dif;
			if (this.y < 0)
				this.y = 580;
		} else if (head.dir == "right") {
			this.x = this.x + dif;
			if (this.x >= 600)
				this.x = 0;
		} else if (head.dir == "down") {
			this.y = this.y + dif;
			if (this.y >= 600)
				this.y = 0;
		}
		if (this.child) {
			this.child.update(prev_x, prev_y);
		}
	}

	this.addChild = function() {
		if (this.child) {
			this.child.addChild();
		} else {
			this.child = new Child(this);
		}
	}

	this.draw = function() {
		ctx.fillStyle = "#00FF15";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		if (this.child) {
			this.child.draw();
		}
	}
}

var head = new Head();
randomizePosition(head);

function eatFruit() {
	if(head.x === fruit.x && head.y === fruit.y) {
		fruit.move(fruit);
		head.shouldAddChild = true;
		score++;
	}
	if(shouldAddSpeedFruit) {
		if(head.x === speedFruit.x && head.y === speedFruit.y) {
			speedFruit.move(speedFruit);
			head.shouldAddChild = true;
			stopPlaying();
			fps = fps+speedDif;
			gameSpeed = 1000/fps;
			score++;
			shouldAddSpeedFruit = false;
			startSpeedPlaying();
			//speedFruit = null;
		}
	}
	if(shouldAddSlowFruit) {
		if(head.x === slowFruit.x && head.y === slowFruit.y) {
			slowFruit.move(slowFruit);
			head.shouldAddChild = true;
			stopPlaying();
			fps = fps-speedDif;
			gameSpeed = 1000/fps;
			score++;
			shouldAddSlowFruit = false;
			startSlowPlaying();
			//slowFruit = null;
		}
	}

}

fruitCheck = function() {
	i = 0;
	while(i != score) {
		if(i*15 == score){
			shouldAddSpeedFruit = true;
		}
		if(i*30 == score){
			shouldAddSlowFruit = true;
		}
		i++;
	}
}

slowFruit = new Object();
if(slowFruit) {
	slowFruit.move = randomizePosition;
	slowFruit.width = squaresize;
	slowFruit.height = squaresize;
	slowFruit.draw = function () {
		ctx.fillStyle = "#CC00FF";
		ctx.fillRect(slowFruit.x, slowFruit.y, slowFruit.height, slowFruit.width);
	}
	slowFruit.move(slowFruit);
}


speedFruit = new Object();
if(speedFruit) {
	speedFruit.move = randomizePosition;
	speedFruit.width = squaresize;
	speedFruit.height = squaresize;
	speedFruit.draw = function () {
		ctx.fillStyle = "#FFCC00";
		ctx.fillRect(speedFruit.x, speedFruit.y, speedFruit.height, speedFruit.width);
	}
	speedFruit.move(speedFruit);
}


fruit = new Object();
fruit.move = randomizePosition;
fruit.width = squaresize;
fruit.height = squaresize;
fruit.draw = function () {
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(fruit.x, fruit.y, fruit.height, fruit.width);
}
fruit.move(fruit);



function Child(parent) {
	this.x = parent.x;
	this.y = parent.y;
	this.width = parent.width;
	this.height = parent.height;
	this.child = null;

	this.collides = function(x, y) {
		if(this.x === x && this.y === y) {
			return true;
		} else if(this.child) {
			return this.child.collides(x,y);
		}
		return false;
	}

	this.update = function(x, y) {
		var prev_x = this.x,
			prev_y = this.y;

		this.x = x;
		this.y = y;
		if (this.child) {
			this.child.update(prev_x, prev_y);
		}
	}

	this.addChild = function() {
		if (this.child) {
			this.child.addChild();
		} else {
			this.child = new Child(this);
		}
	}

	this.draw = function() {
		ctx.fillStyle = "#000";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		if (this.child) {
			this.child.draw();
		}
	}
}




function update() {
	updatePositions();
	eatFruit();
	fruitCheck();
	bulletBorderCheck();
	redraw();
	hasMoved = false;
	console.log(score);
}

function updatePositions() {
	if(head.ateItself()) {
		dead = true;
		stopPlaying();
		console.log("OH YOU DEAD!");
		return;
	} else if (head.shouldAddChild) {
		head.addChild();
		head.shouldAddChild = false;
	}
		head.update();

}

function redraw() {
	ctx.clearRect(0,0,620,620);
	fruit.draw();
	head.draw();
	for (var i = bullet.length - 1; i >= 0; i--) {
		if(bullet[i] != null) {
			bullet[i].move();
			bullet[i].draw();
		}
	}
	if(shouldAddSpeedFruit){
		speedFruit.draw();
	}
	if(shouldAddSlowFruit){
		slowFruit.draw();
	}
}


function stopPlaying() {
	console.log("stopping play");
	clearInterval(t);
	isPlaying = false;
}
function startPlaying() {
	console.log("starting play");
	t = setInterval("update()", gameSpeed);
	isPlaying = true;
}
function startSlowPlaying() {
	console.log("starting slow play");
	t = setInterval("update()", gameSpeed);
	isPlaying = true;
}
function startSpeedPlaying() {
	console.log("starting speed play");
	t = setInterval("update()", gameSpeed);
	isPlaying = true;
}

// Create a new key/hash table
var command = {};
command[80]  = togglePlay; // p key
command[13]  = togglePlay; // Enter key
command[37] = function () { // Left key
	if(head.dir != "right" && hasMoved==false)
		head.dir = "left";
		hasMoved = true;
}; 
command[38] = function () { // Up key
	if(head.dir !="down" && hasMoved==false)
		head.dir = "up";
		hasMoved = true;
}; 
command[39] = function () { // Right key
	if(head.dir != "left" && hasMoved==false)
		head.dir = "right";
		hasMoved = true;
}; 
command[40] = function () { // Down key
	if(head.dir != "up" && hasMoved==false)
		head.dir = "down";
		hasMoved = true;
};
command[70] = function () {
	head.addChild();
}
command[32] = function () {
	console.log("pressed space");
	head.shoot();
}


function togglePlay() {
	console.log("toggling");
	if(isPlaying){
		stopPlaying();
	} else {
		startPlaying();
	}
}


 


document.addEventListener('keydown',function(event) {
	console.log('YOU PRESSED: ' + event.keyCode);
	var f = command[event.keyCode];
	if (typeof(f) == 'function') {
		f();
	}
})



//Bullet shooting part of the game, not yet to be implemented

var bullet = new Array();

head.shoot = function () {
	console.log("shooting");
	var i = 0;
	while (bullet[i] != null || bullet[i] != undefined) {
		i++
	}
	bullet[i] = new Bullet();
	console.log(bullet);
}

function Bullet() {
	this.x = head.x;
	this.y = head.y;
	this.dir = head.dir;
	this.width = squaresize/2;
	this.height = squaresize/2;

	this.draw = function () {
		console.log("drawing bullet");
		ctx.fillStyle = "#000000";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	this.move = function () {
		for (var i = bullet.length - 1; i >= 0; i--) {
			if(bullet[i] != null) {
				if(bullet[i].dir=="right") {
					bullet[i].x = bullet[i].x + 2*squaresize;
				} else if (bullet[i].dir=="left") {
					bullet[i].x = bullet[i].x - 2*squaresize;
				} else if (bullet[i].dir=="up") {
					bullet[i].y = bullet[i].y - 2*squaresize;
				} else if (bullet[i].dir=="down") {
					bullet[i].y = bullet[i].y + 2*squaresize;
				}
			}
		}
	}
}

function bulletBorderCheck() {
	for (var i = bullet.length - 1; i >= 0; i--) {
		if (bullet[i] != null && (bullet[i].x < 0 || bullet[i].x > canvasWidth - squaresize)) {
			bullet[i] = null;
		} else if (bullet[i] != null && (bullet[i].y < 0 || bullet[i].y > canvasHeight - squaresize)) {
			bullet[i] = null;
		}
	}
}




