import Graphic from "./Graphic.js";

export default class Images
{
	constructor(context)
	{
		this.context = context;
		this.images = {};
	}

	load(imageDefinitions)
	{
		imageDefinitions.forEach(image =>
		{
			this.images[image.name] = new Graphic
			(
				image.path,
				image.width,
				image.height,
				this.context,
			);
		});
	}

	get(name) { return this.images[name]; }

	render(name, x, y, width = null, height = null, scale = { x: 1.0, y: 1.0 })
	{
		const image = this.get(name);

		let w = width ?? image.width;
		let h = height ?? image.height;
		
		image.render(x, y, w * scale.x, h * scale.y);
	}
}
