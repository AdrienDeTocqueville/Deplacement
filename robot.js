var imports = require('./action.js');
var Action = imports.Action;
var Selector = imports.Selector;


const IMG_WIDTH = 780, IMG_HEIGHT = 540;
const VERT = 0, ORANGE = 1;

class Robot
{
	constructor(width, height, x, y, side)
	{
		Robot.active = this;

		this.width = width;
		this.height = height;

		this.data = [{x, y, actions:[]}, {x, y, actions:[]}];

		this.setColor(side || VERT);
		this.computeSymmetric(this.data[this.side], this.data[1-this.side]);
	}

	setPosition(x, y)
	{
		this.data[this.side].x = x;
		this.data[this.side].y = y;

		Robot.xel.value = x;
		Robot.yel.value = y;

		this.draw();
	}

	computeSymmetric(src, dest)
	{
		dest.x = IMG_WIDTH-src.x;
		dest.y = src.y;
	}

	createAction(type)
	{
		this.data[this.side].actions.push(new Action(type));
		this.displayActions();
	}

	displayActions()
	{
		// Clear all and add them back
		// It's dégeu and alors ?
		while (Robot.actionList.lastChild)
			Robot.actionList.removeChild(Robot.actionList.lastChild);

		for (let action of this.data[this.side].actions)
			Robot.actionList.appendChild(action.element);
	}

	draw()
	{
		Robot.ctx.clearRect(0, 0, Robot.canvas.width, Robot.canvas.height);
		
		Robot.ctx.fillStyle="rgb(255, 236, 0)";
		Robot.ctx.fillRect(
			this.data[this.side].x - 0.5*this.width,
			(IMG_HEIGHT-this.data[this.side].y) - 0.5*this.height,
			this.width, this.height);
	}

	switchColor()
	{
		this.setColor(Robot.color.checked+0);
	}

	setColor(c)
	{
		this.side = c;
		this.setPosition(this.data[this.side].x, this.data[this.side].y);
		this.displayActions();
	}

	selectPoint(e)
	{
		this.setPosition(e.clientX, IMG_HEIGHT-e.clientY);
	}
}


// Init callbacks
(function()
{
	Robot.active = null;
	Robot.table = document.querySelector("img");
	Robot.mousecoords = document.querySelector("#mousecoords");
	Robot.color = document.querySelector(".switch input");
	Robot.selector = document.querySelector(".selector");
	
	Robot.actionList = document.querySelector(".actionlist");
	Robot.actionSelect = document.querySelector(".actionselect > select");
	Robot.actionCreate = document.querySelector(".actionselect > button");

	Robot.canvas = document.querySelector("canvas");
	Robot.ctx = Robot.canvas.getContext("2d");

	Robot.xel = document.querySelector("#x");
	Robot.yel = document.querySelector("#y");

	Selector.init(Robot.canvas);


	// Color switch
	Robot.color.addEventListener("change", function(){ Robot.active.switchColor() });
	
	// Positon input
	var moveRobot = function() {
		Robot.active.setPosition(Robot.xel.value, Robot.yel.value);
	}
	Robot.xel.addEventListener("change", moveRobot);
	Robot.yel.addEventListener("change", moveRobot);

	// Position selection
	Robot.selector = new Selector(document.querySelector(".position > .selector"), function(e) {
		Robot.active.selectPoint(e);
	});

	// Mouse coords
	Robot.canvas.addEventListener("mousemove", function(e){
		Robot.mousecoords.text = e.clientX + "; " + (IMG_HEIGHT-e.clientY);
	})

	// Select action
	Robot.actionCreate.addEventListener("click", function(e) {
		if (Robot.actionSelect.selectedIndex)
			Robot.active.createAction(Robot.actionSelect.value);
	});
}());

let petit = new Robot(46, 36, 103, 404, VERT);
petit.draw();
