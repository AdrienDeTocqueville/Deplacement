module.exports = class Action
{
	constructor(type)
	{
		this.type = type;
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

	getOptions()
	{
		switch (this.type)
		{
			case 'GOTO':
				return `GOTO`;

			case 'ROTATE':
				return `ROTATE`;

			case 'EFFECTEUR':
				return `EFFECTEUR`;

			case 'WAIT':
				return `WAIT`;
		}
	}
}