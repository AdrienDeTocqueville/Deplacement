var Selector = require('./selector.js');

class Action
{
	constructor(type)
	{
		this.type = type;
		this.options = null;

		this.element = document.createElement("li");
		this.element.innerHTML = `
			<p>${this.toString()}  &nbsp;  <a class="arrow">&#10093;</a></p>
			<div class="suppr">&times;</div>
		`;

		this.element.querySelector("p").addEventListener('click', this.toggleOptions.bind(this));
	}

	toString()
	{
		switch (this.type)
		{
			case 'GOTO':
				return `GOTO(${this.x}, ${this.y})`;

			case 'ROTATE':
				return `ROTATE(${this.alpha})`;

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
				case 'GOTO':
					this.options.className = "position";
					this.options.innerHTML = `
						Position &nbsp;&nbsp;&nbsp;
						x: <input id="x" type="number" width="3">
						y: <input id="y" type="number" width="50">
						
						<div class="selector">&#10011;</div>
					`;
					console.dir(this.options, this.options.lastChildElement);
					this.selector = new Selector(this.options.lastElementChild, function(e) {
						that.x = e.clientX;	that.y = e.clientY;
					});
					break;

				case 'ROTATE':
					this.options.appendChild("GOTO");

				case 'EFFECTEUR':
					this.options.appendChild("GOTO");

				case 'WAIT':
					this.options.appendChild("GOTO");
			}

			this.element.appendChild(this.options);
		}
		else
		{
			this.element.removeChild(this.options);
			this.options = null;
		}
	}
}

module.exports = {
	Action,
	Selector
};
