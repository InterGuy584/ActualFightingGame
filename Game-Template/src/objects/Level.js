import { timer } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Background from "./Background.js";
import Tilemap from "./Tilemap.js";

export default class Level
{
	/**
	 * 
	 * @param {Tilemap} tilemap 
	 */
	constructor(tilemap)
	{
		// objects will spawn based off of the tilemap
		this.tilemap = tilemap;
		this.dimensions = new Vector(this.tilemap.canvasDimensions.x, this.tilemap.canvasDimensions.y);
		this.objects = tilemap.objects;
		//this.background = new Background(this.tilemap.canvasDimensions);
	}

	update(dt)
	{
		//console.log(this.background)
		this.cleanUpEntitiesAndObjects();

		timer.update(dt);

		this.tilemap.update();
		//this.background.update();

		this.objects.forEach(object => { object.update(dt); });
	}

	render()
	{
		//this.background.render();
		this.tilemap.render();

		this.objects.forEach(object => { object.render(); });
	}

	cleanUpEntitiesAndObjects()
	{
		this.objects = this.objects.filter(object => !object.cleanUp);
	}

	addObject(object) { this.objects.push(object); }
	//addCamera(camera) { this.background.addCamera(camera); }
}