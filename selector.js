class Selector
{
	constructor(el, callback)
	{
		this.element = el;
		this.callback = callback;

		this.element.addEventListener('click', this.activate.bind(this));
	}

	activate()
	{	
		if (Selector.active)
		{
			if (Selector.active == this) {
				Selector.active.desactivate();
				return;
			}

			Selector.active.desactivate();
		}

		Selector.active = this;
		Selector.canvas.style.cursor = 'crosshair';
		this.element.className = 'selector active';
			
	}

	desactivate()
	{
		Selector.active = null;
		Selector.canvas.style.cursor = null;
		this.element.className = "selector";
	}
}

Selector.init = function(canvas) {
	Selector.canvas = canvas;
	Selector.active = null;

	Selector.canvas.addEventListener("click", function(e) {
		if (!Selector.active)
			return;

		Selector.active.callback(e);
		Selector.active.desactivate();
	});
}

module.exports = Selector;
