// Hei Vegard
var squaresize = 20;

// Movement variables
var dif = squaresize; // Stepsize
var dir = "down"; // Initial direction

// Game loop element
var t;

// Canvas variables
var c = document.getElementById("canvas"); // Canvas
var canvasHeight = 600, canvasWidth = 600;
var ctx = c.getContext("2d");


var isPlaying = false;

var head = new Head();

function Head() {
	this.x = Math.floor(Math.random()*580);
	this.y = Math.floor(Math.random()*600);
	this.width = squaresize;
	this.height = squaresize;
	this.child = null;

	this.update = function() {
		var prev_x = this.x,
			prev_y = this.y;

		if (dir == "left") {
			this.x = this.x - dif;
			if (this.x < 0)
				this.x = 580;
		} else if (dir == "up") {
			this.y = this.y - dif;
			if (this.y < 0)
				this.y = 580;
		} else if (dir == "right") {
			this.x = this.x + dif;
			if (this.x >= 600)
				this.x = 0;
		} else if (dir == "down") {
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

function Child(parent) {
	this.x = parent.x;
	this.y = parent.y;
	this.width = parent.width;
	this.height = parent.height;
	this.child = null;

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




fruit = new Object();
fruit.x = Math.floor(Math.random()*550);
fruit.y = Math.floor(Math.random()*550);
fruit.width = squaresize;
fruit.height = squaresize;
fruit.draw = function drawFruit() {
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(fruit.x, fruit.y, fruit.height, fruit.width);
}

function eatFruit() {
	if(head.x + head.width >= fruit.x && head.x <= fruit.x + fruit.width) {
		if(head.y + head.height >= fruit.y && head.y < fruit.y + fruit.height) {
			fruit.x = Math.floor(Math.random()*550);
			fruit.y = Math.floor(Math.random()*550);
			head.addChild();
		}
	}
}

function update() {
	updatePositions();
	eatFruit();
	redraw();
}

function updatePositions() {
	head.update();
}

function redraw() {
	ctx.clearRect(0,0,620,620);
	fruit.draw();
	head.draw();
}


// Create a new key/hash table
var command = {};
command[37] = function () { // Left key
	if(dir != "right")
		dir = "left";
}; 
command[38] = function () { // Up key
	if(dir !="down")
		dir = "up";
}; 
command[39] = function () { // Right key
	if(dir != "left")
		dir = "right";
}; 
command[40] = function () { // Down key
	if(dir != "up")
		dir = "down";
}; 
command[80]  = function () { // p key
	if(isPlaying){
		clearInterval(t);
	} else {
		t = setInterval("update()", 1000/10);
	}
	isPlaying = !isPlaying;
};
command[13]  = function () { // Enter key
	if(isPlaying){
		clearInterval(t);
	} else {
		t = setInterval("update()", 1000/10);
	}
	isPlaying = !isPlaying;
};

document.addEventListener('keydown',function(event) {
	command[event.keyCode]();
})
