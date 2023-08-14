import Vector from "../../lib/Vector.js";
import TileType from "../enums/TileType.js";
import Sprite from "../../lib/Sprite.js";
import { images, context, DEBUG } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Direction from "../enums/Direction.js";
import Hitbox from "../../lib/Hitbox.js";

export default class Tile
{
	static TILE_SIZE = 16;

	/**
	 * Represents one tile in the Tilemap and on the screen.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} tileSet Which tile texture this tile should have.
	 */
	constructor(x, y, type, tileSet, surround)
	{
		this.position = new Vector(x, y);
		this.dimensions = new Vector(Tile.TILE_SIZE, Tile.TILE_SIZE);
		this.type = type;
		this.tileSet = tileSet;
		this.sprite = this.getSprite();
		this.surround = surround;

		this.topSprites = [];
		this.topRotations = [];

		// if the sprite isn't a cloud, see if there's a tile next to it (for the puffiness or the spikiness).
		if (Tile.isEmptyType(this.type))
		{
			this.getTopSprites(TileType.Cloud)
			this.getTopSprites(TileType.Spike)
		}

		// give it a hitbox if it's a spike type
		this.hitbox = TileType.Spike ? new Hitbox((this.position.x * Tile.TILE_SIZE) - 6, (this.position.y * Tile.TILE_SIZE) - 6, Tile.TILE_SIZE + 12, Tile.TILE_SIZE + 12) : null
	}

	static isEmptyType(type)
	{
		let empty = false;
		switch (type)
		{
			case TileType.Empty:
				empty = true;
				break;
			case TileType.Treasure:
				empty = true;
				break;
			case TileType.Player:
				empty = true;
				break;
		}

		return empty;
	}

	getTopSprites(type)
	{
		let x = 0;
		let y = 0;
		switch (type)
		{
			case TileType.Cloud:
				y = 1;
				break;
			case TileType.Spike:
				y = 3;
				break;
			default:
				y = 1;
		}
		// direction determines the "first" side, assuming the rest sequentially go in a clockwise direction
		let direction = Direction.Up;
		let canDoCorner = [];
		canDoCorner['upRight'] = false;
		canDoCorner['rightDown'] = false;
		canDoCorner['downLeft'] = false;
		canDoCorner['leftUp'] = false;
		let surround = true;
		if (this.surround['up'] == type && this.surround['right'] == type && this.surround['down'] == type && this.surround['left'] == type)
			x = 4;
		else if(this.surround['up'] == type && this.surround['right'] == type && this.surround['down'] == type)
			x = 3;
		else if(this.surround['up'] == type && this.surround['right'] == type && this.surround['left'] == type)
		{
			x = 3;
			direction = Direction.Left;
		}
		else if(this.surround['up'] == type && this.surround['down'] == type && this.surround['left'] == type)
		{
			x = 3;
			direction = Direction.Down;
		}
		else if(this.surround['right'] == type && this.surround['down'] == type && this.surround['left'] == type)
		{
			x = 3;
			direction = Direction.Right;
		}
		else if (this.surround['down'] == type && this.surround['left'] == type)
		{
			x = 1;
			direction = Direction.Down;
			canDoCorner['upRight'] = true;
		}
		else if (this.surround['right'] == type && this.surround['left'] == type)
		{
			x = 2;
			direction = Direction.Right;
		}
		else if (this.surround['right'] == type && this.surround['down'] == type)
		{
			x = 1;
			direction = Direction.Right;
			canDoCorner['leftUp'] = true;
		}
		else if (this.surround['up'] == type && this.surround['left'] == type) {
			x = 1;
			direction = Direction.Left;
			canDoCorner['rightDown'] = true;
		}
		else if (this.surround['up'] == type && this.surround['down'] == type )
			x = 2;
		else if (this.surround['up'] == type && this.surround['right'] == type)
		{
			x = 1;
			canDoCorner['downLeft'] = true;
		}
		else if (this.surround['up'] == type)
		{
			x = 0;
			canDoCorner['rightDown'] = true;
			canDoCorner['downLeft'] = true;
		}
		else if (this.surround['right'] == type)
		{
			x = 0;
			direction = Direction.Right;
			canDoCorner['leftUp'] = true;
			canDoCorner['downLeft'] = true;
		}
		else if (this.surround['down'] == type)
		{
			x = 0;
			direction = Direction.Down;
			canDoCorner['upRight'] = true;
			canDoCorner['leftUp'] = true;
		}
		else if (this.surround['left'] == type)
		{
			x = 0;
			direction = Direction.Left;
			canDoCorner['upRight'] = true;
			canDoCorner['rightDown'] = true;
		}
		else surround = false;

		if (surround)
		{
			// grab the edge sprite here
			this.topSprites.push(new Sprite
			(
				images.get(ImageName.MainPlatformTileset),
				x * Tile.TILE_SIZE,
				y * Tile.TILE_SIZE,
				Tile.TILE_SIZE,
				Tile.TILE_SIZE,
				
			));

			let rotate;

			switch (direction)
			{
				case Direction.Up:
					rotate = Math.PI * 0.5;
					break;
				case Direction.Right:
					rotate = Math.PI;
					break;
				case Direction.Down:
					rotate = Math.PI * 1.5;
					break;
				case Direction.Left:
					rotate = 0;
					break;
			}
			this.topRotations.push(rotate);
		}

		// this is how flappy bird put the pipe on the top:
		/*
		// if top...	
			context.save();
			context.translate(this.x + this.width, this.y + this.height);
			context.rotate(Math.PI);
			context.drawImage(images.pipe, 0, 0);
			context.restore();
		// else...
			context.drawImage(images.pipe, this.x, this.y);
		*/
		// check for corners
		y += 1;
		x = 0;
		let oldRotationLength = this.topRotations.length;
		if (this.surround['upRight'] == type && canDoCorner['upRight'])
			this.topRotations.push(Math.PI * 0.5);
		if (this.surround['rightDown'] == type && canDoCorner['rightDown'])
			this.topRotations.push(Math.PI);
		if (this.surround['downLeft'] == type && canDoCorner['downLeft'])
			this.topRotations.push(Math.PI * 1.5);
		if (this.surround['leftUp'] == type && canDoCorner['leftUp'])
			this.topRotations.push(0);

		for (let i = 0; i < this.topRotations.length - oldRotationLength; i++)
		{
			this.topSprites.push(new Sprite
			(
				images.get(ImageName.MainPlatformTileset,
					x * Tile.TILE_SIZE,
					y * Tile.TILE_SIZE,
					Tile.TILE_SIZE,
					Tile.TILE_SIZE,
				)
			));
		}
	}

	getSprite()
	{
		let sprite;
		switch (this.type)
		{
			case TileType.Cloud:
				sprite = this.getCloudSprite();
				break;
			case TileType.Spike:
				sprite = this.getCloudSprite();
				break;
			default:
				// if it's an empty sprite
				sprite = null;
				break;
		}
		return sprite;
	}

	getCloudSprite()
	{
		return new Sprite
		(
			images.get(ImageName.MainPlatformTileset),
			0,
			0,
			Tile.TILE_SIZE,
			Tile.TILE_SIZE
		);
	}

	render()
	{
		if (this.sprite != null)
			this.sprite.render(this.position.x * Tile.TILE_SIZE, this.position.y * Tile.TILE_SIZE);
		
		for (let i = 0; i < this.topSprites.length; i++)
		{
			context.save();
			context.translate((this.position.x * Tile.TILE_SIZE) + (Tile.TILE_SIZE / 2), (this.position.y * Tile.TILE_SIZE) + (Tile.TILE_SIZE / 2));
			context.rotate(this.topRotations[i]);
			context.translate(-Tile.TILE_SIZE / 2, -Tile.TILE_SIZE / 2);
			this.topSprites[i].render(0, 0);
			context.restore();
		}

		if (this.hitbox != null && (this.type == TileType.Spike && DEBUG)) this.hitbox.render(context);
	}

	isCollidable = () => this.type == TileType.Cloud || this.type == TileType.Spike;

	/**
	 * @param {Hitbox} hitbox
	 * @returns Whether this game object collided with an entity using AABB collision detection.
	 */
	didCollideWithEntity(hitbox) { return this.hitbox.didCollide(hitbox) && this.type == TileType.Spike };

	isPointWithinTile(point)
	{
		return (point.x >= this.position.x * Tile.TILE_SIZE &&
			point.x < this.position.x * Tile.TILE_SIZE + Tile.TILE_SIZE &&
			point.y >= this.position.y * Tile.TILE_SIZE &&
			point.y < this.position.y * Tile.TILE_SIZE + Tile.TILE_SIZE)
	}
}