// Canvas variables
var c = document.getElementById("canvas"); // Canvas
var canvasHeight = 600, canvasWidth = 600; // hard coded in the html
var ctx = c.getContext("2d");

var squaresize = 20;
var gameSpeed = 1000/10;
var xTiles = canvasWidth/squaresize;
var yTiles = canvasHeight/squaresize;

// Movement variables
var dif = squaresize; // Stepsize

// Game loop element
var t;

var isPlaying = false;
var dead = false;

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

fruit = new Object();
fruit.move = randomizePosition;
fruit.width = squaresize;
fruit.height = squaresize;
fruit.draw = function drawFruit() {
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


function eatFruit() {
	if(head.x === fruit.x && head.y === fruit.y) {
		fruit.move(fruit);
		head.shouldAddChild = true;
	}
}

function update() {
	updatePositions();
	eatFruit();
	moveBullet();
	redraw();
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
		// bulletBorderCheck();
		head.update();

}

function redraw() {
	ctx.clearRect(0,0,620,620);
	fruit.draw();
	head.draw();
	if (bullet) {
		bullet.draw();	
	}
}

function bulletBorderCheck() {
	if (bullet.x < 0 || bullet.x > canvasWidth - squaresize) {
		bullet = null;
	} else if (bullet.y < 0 || bullet.y > canvasHeight - squaresize) {
		bullet = null;
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


// Create a new key/hash table
var command = {};
command[80]  = togglePlay; // p key
command[13]  = togglePlay; // Enter key
command[37] = function () { // Left key
	if(head.dir != "right")
		head.dir = "left";
}; 
command[38] = function () { // Up key
	if(head.dir !="down")
		head.dir = "up";
}; 
command[39] = function () { // Right key
	if(head.dir != "left")
		head.dir = "right";
}; 
command[40] = function () { // Down key
	if(head.dir != "up")
		head.dir = "down";
};
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

var bullet;

head.shoot = function () {
	console.log("shooting");
	bullet = new Bullet();
}

function Bullet() {
	this.x = head.x;
	this.y = head.y;
	this.dir = head.dir;
	this.width = squaresize/2;
	this.height = squaresize/2;

	this.draw = function () {
		console.log("drawing bullet");
		ctx.fillStyle = "#FF1500";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	this.move = function () {
		if(bullet.dir=="right") {
			bullet.x = bullet.x + 2*squaresize;
		} else if (bullet.dir=="left") {
			bullet.x = bullet.x - 2*squaresize;
		} else if (bullet.dir=="up") {
			bullet.y = bullet.y - 2*squaresize;
		} else if (bullet.dir=="down") {
			bullet.y = bullet.y + 2*squaresize;
		}
	}
}






