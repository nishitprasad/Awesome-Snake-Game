
var numberOfColumns=25, numberOfRows=25;

var EMPTYSPACE=0, SNAKESPACE=1, FRUITSPACE=2;

var GOLEFT=0, GOUP=1, GORIGHT=2, GODOWN=3;

var KEY_LEFT =37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40, KEY_EXIT1 = 87, KEY_EXIT2 = 119, KEY_RESET1=82, KEY_RESET2=114, KEY_START1=83, KEY_START2=115;

var KEY_SPACE = 32, KEY_PAUSE1=80, KEY_PAUSE2=112;

var gameOver = false;

//Game Objects
var canvas, drawContext, keyState, frames, score=0, gameOverScore=0;

var grid = {
	width: null,
	height: null,
	_grid: null,

	init: function(d, c, r) {
		this.width = c;
		this.height = r;

		this._grid = [];
		for(var x=0; x<c; x++) {
			this._grid.push([]);
			for(var y=0; y<r; y++) {
				this._grid[x].push(d);
			}
		}
	},

	set: function(val, x, y) {
		this._grid[x][y] = val;
	},

	get: function(x, y) {
		return this._grid[x][y];
	}
}

var snake = {

	direction: null,
	_queue: null,
	last: null,

	init: function(d, x, y) {
		this.direction = d;
		this._queue = [];
		this.insert(x, y);
	},

	insert: function(x, y) {
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
	},

	remove: function(){
		return this._queue.pop();
	}
}

function startScreen(){
	drawContext.fillStyle = "#222";
	drawContext.fillRect(0, 0, canvas.width, canvas.height);
	drawContext.fillStyle = "white";
	drawContext.font = "40px Helvetica";
	drawContext.fillText("AWESOME", numberOfColumns*5.8, numberOfRows*2);
	drawContext.fillText("SNAKE GAME", numberOfColumns*4.5, numberOfRows*3.5);
	drawContext.font = "20px Helvetica";
	drawContext.fillText("PRESS S TO START", numberOfColumns*6, numberOfRows*10);
	drawContext.font = "12px Helvetica";
	drawContext.fillText("By Nishit Prasad", numberOfColumns*8, numberOfRows*19);
}

function pauseScreen(){
	drawContext.fillStyle = "#222";
	drawContext.fillRect(0, 0, canvas.width, canvas.height);
	drawContext.fillStyle = "white";
	drawContext.font = "40px Helvetica";
	drawContext.fillText("AWESOME", numberOfColumns*5.8, numberOfRows*2);
	drawContext.fillText("SNAKE GAME", numberOfColumns*4.5, numberOfRows*3.5);
	drawContext.font = "20px Helvetica";
	drawContext.fillText("GAME PAUSED", numberOfColumns*7, numberOfRows*8);
	drawContext.font = "16px Helvetica";
	drawContext.fillText("Current Score: " + score, numberOfColumns*7.4, numberOfRows*12);	
	drawContext.fillText("To Resume: Press SPACE", numberOfColumns*6, numberOfRows*14);
}

function gameOverScreen(){
	drawContext.fillStyle = "#222";
	drawContext.fillRect(0, 0, canvas.width, canvas.height);
	drawContext.fillStyle = "white";
	drawContext.font = "40px Helvetica";
	drawContext.fillText("AWESOME", numberOfColumns*5.8, numberOfRows*2);
	drawContext.fillText("SNAKE GAME", numberOfColumns*4.5, numberOfRows*3.5);
	drawContext.font = "50px Helvetica";
	drawContext.fillText("GAME OVER", numberOfColumns*4, numberOfRows*8);
	drawContext.font = "16px Helvetica";
	drawContext.fillText("Your Score: " + gameOverScore, numberOfColumns*8, numberOfRows*12);	
	drawContext.fillText("To Restart: Press S", numberOfColumns*7, numberOfRows*14);
}

function setFood() {
	var empty = [];
	for(var x=0; x<grid.width; x++){
		for(var y=0; y<grid.height; y++){
			if(grid.get(x, y)===EMPTYSPACE){
				empty.push({x:x, y:y});
			}
		}
	}
	var randomPosition = empty[Math.floor(Math.random()*empty.length)];
	grid.set(FRUITSPACE, randomPosition.x, randomPosition.y);
}

function init() {
	score = 0;

	grid.init(EMPTYSPACE, numberOfColumns, numberOfRows);
	var sp = {x:Math.floor(numberOfColumns/2), y:numberOfRows-1};

	snake.init(GOUP, sp.x, sp.y);
	grid.set(SNAKESPACE, sp.x, sp.y);

	setFood();
}

function loop() {
	if(keyState[KEY_PAUSE1]|| keyState[KEY_PAUSE2]) {
		pauseScreen();
	} else if(gameOver===true){
		gameOverScreen();
	} else if(keyState[KEY_START2] || keyState[KEY_START1]){		
		update();
		draw();
	} else {
		startScreen();
	}
	setTimeout(function() {
		window.requestAnimationFrame(loop, canvas);
	}, 24);
	
}

function update() {
	frames++;

	if(keyState[KEY_LEFT] && snake.direction != GORIGHT)
		snake.direction=GOLEFT;
	if(keyState[KEY_UP] && snake.direction!=GODOWN)
		snake.direction=GOUP;
	if(keyState[KEY_RIGHT] && snake.direction!=GOLEFT)
		snake.direction=GORIGHT;
	if(keyState[KEY_DOWN] && snake.direction!=GOUP)
		snake.direction=GODOWN;
	

	if(frames%5===0){
		var newX = snake.last.x;
		var newY = snake.last.y;

		switch(snake.direction){
			case GOLEFT:
				newX--;
				break;
			case GOUP:
				newY--;
				break;
			case GORIGHT:
				newX++;
				break;
			case GODOWN:
				newY++;
				break;
		}

		if( 0 > newX || newX > grid.width-1
			|| 0 > newY || newY > grid.height-1 ||
			grid.get(newX, newY) === SNAKESPACE ){

			gameOver=true;
			gameOverScore=score;
			return init();
		}

		if(keyState[KEY_RESET2] || keyState[KEY_RESET1]){
			
			delete keyState[KEY_START2];
			delete keyState[KEY_START1];
			return init();
		}

		if(grid.get(newX,newY) === FRUITSPACE) {
			
			var tail = {x:newX, y:newY};
			score++;
			setFood();
		} else {
			
			var tail = snake.remove();
			grid.set(EMPTYSPACE, tail.x, tail.y);
			tail.x = newX;
			tail.y = newY;
		}
	
		grid.set(SNAKESPACE, tail.x, tail.y);
		snake.insert(tail.x, tail.y);
	}
}

function draw() {
	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;

	for(var x=0; x<grid.width; x++){
		for(var y=0; y<grid.height; y++){
			switch(grid.get(x, y)) {
				case EMPTYSPACE:
					drawContext.fillStyle = "#222";
					drawContext.fillRect(x*tw, y*th, tw, th);
					break;
				case SNAKESPACE:
					drawContext.fillStyle = "white";
					drawContext.strokeStyle = "#222";
					drawContext.strokeRect(x*tw, y*th, tw, th);
					drawContext.fillRect(x*tw, y*th, tw, th);
					break;
				case FRUITSPACE:
					drawContext.fillStyle = "red";
					drawContext.fillRect(x*tw, y*th, tw, th);
					break;
			}
		}
	}
	
	drawContext.font = "16px Helvetica";
	drawContext.fillStyle = "white";
	drawContext.fillText("SCORE: " + score, 10, canvas.height-10);
	drawContext.fillText("PAUSE: Press P", canvas.width-130, canvas.height-10);
	drawContext.fillText("RESET: Press R", canvas.width-260, canvas.height-10);
}

function main() {
	canvas = document.getElementById("canvas");
	canvas.width = numberOfColumns*20;
	canvas.height = numberOfRows*20;
	drawContext = canvas.getContext("2d");
	document.body.appendChild(canvas);

	frames = 0;
	keyState = {};

	document.addEventListener("keydown", function(event){
		if(event.keyCode===KEY_SPACE){
			delete keyState[KEY_PAUSE1];
			delete keyState[KEY_PAUSE2];
		} else {
			keyState[event.keyCode] = true;
		}
	});
	document.addEventListener("keyup", function(event){
		if(event.keyCode===KEY_PAUSE1 || event.keyCode===KEY_PAUSE2){
			;
		} else if(event.keyCode===KEY_START1 || event.keyCode===KEY_START2) {
			gameOver = false;
		} else {
			delete keyState[event.keyCode];
		}	
	});

	init();

	loop();	
}

main();