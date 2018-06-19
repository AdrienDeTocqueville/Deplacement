var Action = require('./action.js');

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

	displayOptions(type)
	{
		this.action = new Action(type);
		Robot.actionOptions.innerHTML = this.action.getOptions() + 
		'<button id="addAction">Valider</button>';

		document.querySelector("#addAction").addEventListener("click", this.addAction.bind(this));
	}

	addAction()
	{
		this.data[this.side].actions.push(this.action);
		this.action = new Action(this.action.type);

		this.displayActions();
	}

	displayActions()
	{
		// Clear all and add them back
		// It's dégeu and alors ?
		while (Robot.actionList.lastChild)
			Robot.actionList.removeChild(Robot.actionList.lastChild);

		for (let action of this.data[this.side].actions)
		{
			let el = document.createElement("li");
			el.innerHTML = action.toString() + '<div class="suppr">&times;</div>';

			Robot.actionList.appendChild(el);
		}
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
		if (e.target == Robot.selector)
		{
			if (!this.selectMode)
			{
				this.selectMode = true;
				Robot.canvas.style.cursor = 'crosshair';
				Robot.selector.className = 'selector active';
				return;
			}
		}
		else if (e.target != Robot.canvas || !this.selectMode)
			return;

		this.selectMode = false;
		Robot.canvas.style.cursor = '';
		Robot.selector.className = 'selector';
		if (e.target == Robot.canvas)
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
	Robot.actionOptions = document.querySelector(".actionselect > .options");

	Robot.canvas = document.querySelector("canvas");
	Robot.ctx = Robot.canvas.getContext("2d");

	Robot.xel = document.querySelector("#x");
	Robot.yel = document.querySelector("#y");


	// Color switch
	Robot.color.addEventListener("change", function(){ Robot.active.switchColor() });
	
	// Positon input
	var moveRobot = function() {
		Robot.active.setPosition(Robot.xel.value, Robot.yel.value);
	}
	Robot.xel.addEventListener("change", moveRobot);
	Robot.yel.addEventListener("change", moveRobot);

	// Position selection
	var selectPoint = function(e) {
		Robot.active.selectPoint(e);
	}
	Robot.canvas.addEventListener("click", selectPoint);
	Robot.selector.addEventListener("click", selectPoint);

	// Mouse coords
	Robot.canvas.addEventListener("mousemove", function(e){
		Robot.mousecoords.text = e.clientX + "; " + (IMG_HEIGHT-e.clientY);
	})

	// Select action
	Robot.actionSelect.addEventListener("change", function(e) {
		Robot.active.displayOptions(e.target.value);
	});
}());

let petit = new Robot(46, 36, 103, 404, VERT);
petit.draw();