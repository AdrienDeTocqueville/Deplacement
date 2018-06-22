var Selector = require('./selector.js');

class Action
{
	constructor(type)
	{
		this.type = type;
		this.options = null;

		this.element = document.createElement("li");
		this.element.innerHTML = `
			<p>
				<a class="texte">${this.toString()}</a>  &nbsp;
				<a class="arrow">&#10093;</a>
			</p>
			<div class="suppr">&times;</div>
		`;

		this.element.querySelector("p").addEventListener('click', this.toggleOptions.bind(this));
		this.element.querySelector(".suppr").addEventListener('click', this.delete.bind(this));
	}

	toString()
	{
		switch (this.type)
		{
			case 'WAYPOINT':
				return `WAYPOINT(${this.x}, ${this.y})`;

			case 'EFFECTEUR':
				return `EFFECTEUR(${this.action})`;

			case 'WAIT':
				return `WAIT(${this.duration})`;
		}
	}

	toggleOptions()
	{
		if (!this.options)
		{
			var that = this;
			this.options = document.createElement("div");

			switch (this.type)
			{
				case 'WAYPOINT':
					this.options.className = "position waypoint";
					this.options.innerHTML = `
						x: <input id="x" type="number" width="3">
						y: <input id="y" type="number" width="50">
						
						<div class="selector">&#10011;</div>
					`;

					this.xel = this.options.querySelector("#x");
					this.yel = this.options.querySelector("#y");
					
					var setPos = function() {
						that.setPosition(that.xel.value, that.yel.value);
					}
					this.setPosition(this.x, this.y); // Init inputs
					this.xel.addEventListener("change", setPos);
					this.yel.addEventListener("change", setPos);

					this.selector = new Selector(this.options.lastElementChild, function(e) {
						that.setPosition(e.clientX, 540-e.clientY);
					});
					break;

				case 'EFFECTEUR':
					this.options.appendChild("WAYPOINT");

				case 'WAIT':
					this.options.appendChild("WAYPOINT");
			}

			this.element.className = "options";
			this.element.appendChild(this.options);
		}
		else
		{
			this.element.className = "";
			this.element.removeChild(this.options);
			this.options = null;
		}
	}

	setPosition(x, y)
	{
		this.x = x;
		this.y = y;

		this.xel.value = x;
		this.yel.value = y;

		this.element.firstElementChild.firstElementChild.firstChild.nodeValue = this.toString();
		
		Action.robot.active.draw();
	}

	delete()
	{
		Action.robot.active.removeAction(this);
	}
}

module.exports = {
	Action,
	Selector
};
