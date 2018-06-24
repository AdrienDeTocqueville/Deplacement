var imports = require('./action.js');
var Action = imports.Action;
var Selector = imports.Selector;

const IMG_WIDTH = 780, IMG_HEIGHT = 540;

class Robot
{
	constructor(width, height)
	{
		this.width = width;
		this.height = height;

		this.teams = [{x: 0, y: 0, actions:[]}, {x: 0, y: 0, actions:[]}];
		this.team = this.teams[0];
	}

	setPosition(x, y)
	{
		this.team.x = x;
		this.team.y = y;

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
		this.team.actions.push(new Action(type));
		this.displayActions();
	}

	removeAction(action)
	{
		let index = this.team.actions.indexOf(action);
		if (index > -1) {
			this.team.actions.splice(index, 1);
		}
		
		this.displayActions();
		this.draw();
	}

	displayActions()
	{
		// Empty list
		while (Robot.actionList.lastChild)
			Robot.actionList.removeChild(Robot.actionList.lastChild);

		// Add actions elements
		for (let action of this.team.actions)
			Robot.actionList.appendChild(action.element);
	}

	draw()
	{
		Robot.ctx.clearRect(0, 0, Robot.canvas.width, Robot.canvas.height);
		Robot.ctx.fillStyle="rgb(255, 236, 0)";

		Robot.ctx.fillRect(
			this.team.x - 0.5*this.width,
			(IMG_HEIGHT-this.team.y) - 0.5*this.height,
			this.width, this.height);

		this.drawActions();
	}

	drawActions()
	{
		Robot.ctx.lineWidth = 3;
		Robot.ctx.strokeStyle = 'blue';
		Robot.ctx.lineCap = 'round';

		let waypoints = this.team.actions.filter(action => (action.type == 'WAYPOINT' && action.x && action.y));

		Robot.ctx.beginPath();
		Robot.ctx.moveTo(this.team.x, IMG_HEIGHT - this.team.y);


		for (let waypoint of waypoints)
		{
			Robot.ctx.lineTo(waypoint.x, IMG_HEIGHT - waypoint.y);
		}
		Robot.ctx.stroke();
	}

	setTeam(team)
	{
		this.team = this.teams[team];
		this.setPosition(this.team.x, this.team.y);
		this.displayActions();
	}

	selectPoint(e)
	{
		this.setPosition(e.clientX, IMG_HEIGHT-e.clientY);
	}

	save()
	{
		let saveObj = {
			height: this.height,
			width: this.width,
			teams: [{}, {}]
		};

		for (let i of [0, 1])
		{
			saveObj.teams[i].x = this.teams[i].x;
			saveObj.teams[i].y = this.teams[i].y;
			
			saveObj.teams[i].actions = [];
			for (let action of this.teams[i].actions)
				saveObj.teams[i].actions.push(action.save());
		}

		return saveObj;
	}

	load(obj)
	{
		this.height = obj.height;
		this.width = obj.width;
		this.teams = [{}, {}];

		for (let i of [0, 1])
		{
			this.teams[i].x = obj.teams[i].x;
			this.teams[i].y = obj.teams[i].y;
			
			this.teams[i].actions = [];
			for (let action of obj.teams[i].actions)
				this.teams[i].actions.push(new Action(action));
		}

		this.team = this.teams[Robot.color.checked+0];
	}
}

// Init callbacks
(function()
{
	Robot.robots = [new Robot(20, 20), new Robot(10, 10)];
	Robot.active = Robot.robots[0];

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
	Action.Robot = Robot;


	// Color switch
	Robot.color.addEventListener("change", () => { Robot.active.setTeam(Robot.color.checked+0) });
	
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


// Define callbacks
const fs = require('fs'); // file system
const callbacks = require('electron').remote.getGlobal('callbacks');

callbacks.onOpen = (fileName) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if(err)
		alert("An error ocurred while opening file: " + err.message);
		
		// Load
		data = JSON.parse(data);

		Robot.robots[0].load(data.robots[0]);
		Robot.robots[1].load(data.robots[1]);

		Robot.active = Robot.robots[0];

		// Init display
		if (Selector.active)
			Selector.active.desactivate();
			
		Robot.active.displayActions();
		Robot.active.draw();
    });
}

callbacks.onSave = (fileName) => {
	let saveObj = {
		robots: [
			Robot.robots[0].save(),
			Robot.robots[1].save()
		]
	};

	fs.writeFile(fileName, JSON.stringify(saveObj), (err) => {
        if(err)
            alert("An error ocurred while writing file: " + err.message);
    });
}

callbacks.onExport = (fileName) => {
	console.log(fileName)
}