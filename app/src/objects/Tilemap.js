import Vector from "../../lib/Vector.js";
import Tile from "./Tile.js";
import TileType from "../enums/TileType.js";
import Treasure from "./Treasure.js";
import Door from "./Door.js";
import LevelMaker from "../services/LevelMaker.js";
import ItemType from "../enums/ItemType.js"

export default class Tilemap
{
	/**
	 * Contains all the tiles that comprise the map.
	 *
	 * @param {number} width How many tiles wide the map will be.
	 * @param {number} height How many tiles tall the map will be.
	 * @param {array} tiles The array of Tile objects that comprise the map.
	 */
	constructor(width, height, tiles, tileSet)
	{
		this.objects = [];
		this.tileDimensions = new Vector(width, height);
		this.canvasDimensions = new Vector(width * Tile.TILE_SIZE, height * Tile.TILE_SIZE);
		this.initializeTiles(width, height, tiles);
		this.tileset = tileSet;
	}

	initializeTiles(width, height, tiles)
	{
		this.tiles = []
		this.itemTypes = this.generateItemTypes();
		this.itemCounter = 0;

		for (let j = 0; j < height; j++)
		{
			for (let i = 0; i < width; i++)
			{
				// check for various objects
				this.checkForTreasure(tiles[j*width + i], i, j);
				this.checkForPlayerSpawn(tiles[j*width + i], i, j);

				let adjacent = [];
				// set these as empty ahead of time for edge cases
				adjacent['up'] = TileType.Empty;
				adjacent['upRight'] = TileType.Empty;
				adjacent['right'] = TileType.Empty;
				adjacent['rightDown'] = TileType.Empty;
				adjacent['down'] = TileType.Empty;
				adjacent['downLeft'] = TileType.Empty;
				adjacent['left'] = TileType.Empty;
				adjacent['leftUp'] = TileType.Empty;

				// only empty tiles get edges and corners.
				if (Tile.isEmptyType(tiles[j * width + i])) {
					
					// first, check for edge cases
					let edge = []
					edge['up'] = false;
					edge['right'] = false;
					edge['down'] = false;
					edge['left'] = false;

					if ((j - 1) < 0)
						edge['up'] = true;
					if ((i + 1) >= width)
						edge['right'] = true;
					if ((j + 1) >= height)
						edge['down'] = true;
					if ((i - 1) < 0)
						edge['left'] = true;

					// start from the top, go clockwise
					// always check for edge cases
					if (!edge['up'])
						adjacent['up'] = tiles[(j - 1) * width + i];
					// if there's a cloud tile above and to the right
					if (!edge['up'] && !edge['right'])
						adjacent['upRight'] = tiles[(j - 1) * width + ( i + 1)];
					// and so on...
					if (!edge['right'])
						adjacent['right'] = tiles[j * width + (i + 1)];
					if (!edge['down'] && !edge['right'])
						adjacent['rightDown'] = tiles[(j + 1) * width + (i + 1)];
					if (!edge['down'])
						adjacent['down'] = tiles[(j + 1) * width + i];
					if (!edge['down'] && !edge['left'])
						adjacent['downLeft'] = tiles[(j + 1) * width + (i - 1)];
					if (!edge['left'])
						adjacent['left'] = tiles[j * width + (i - 1)];
					if (!edge['up'] && !edge['left'])
						adjacent['leftUp'] = tiles[(j - 1) * width + (i - 1)];
				}
				this.tiles.push(new Tile(i, j, tiles[(j * width) + i], this.tileset, adjacent));
			}
		}
	}

	generateItemTypes()
	{
		let itemTypes = []
		let bullets = 6;
		let totalItems = (LevelMaker.TOTAL_CHUNK_HEIGHT * LevelMaker.TOTAL_CHUNK_WIDTH) - 1;
		
		itemTypes.push(ItemType.SuperJump);
		itemTypes.push(ItemType.TripleJump);
		itemTypes.push(ItemType.Hover);

		for (let i = 0; i < bullets; i++)
			itemTypes.push(ItemType.Bullet);

		for (let i = 0; i < totalItems - (bullets + 3); i++)
			itemTypes.push(ItemType.Heart);

		// shuffle the items
		itemTypes = LevelMaker.shuffleArray(itemTypes);

		return itemTypes;
	}

	checkForTreasure(tile, x, y)
	{
		if (tile == TileType.Treasure)
		{
			// check if it's within range of the second chunk,
			// if so, make it an exit instead
			if
			(
				x >= LevelMaker.CHUNK_WIDTH &&
				x < LevelMaker.CHUNK_WIDTH * 2 &&
				y >= 0 &&
				y < LevelMaker.CHUNK_HEIGHT
			)
				// make this a door instead
				this.objects.push(new Door(new Vector(x * Tile.TILE_SIZE, (y * Tile.TILE_SIZE) - Tile.TILE_SIZE)))
			else
			{
				this.objects.push(new Treasure(new Vector(x * Tile.TILE_SIZE, y * Tile.TILE_SIZE), this.itemTypes[this.itemCounter]))
				this.itemCounter++;
			}
		}
	}

	checkForPlayerSpawn(tile, x, y)
	{
		if (tile == TileType.Player)
		{
			/*
			if
			(
				x >= LevelMaker.CHUNK_WIDTH &&
				x < LevelMaker.CHUNK_WIDTH * 2 &&
				y >= LevelMaker.CHUNK_HEIGHT * (LevelMaker.TOTAL_CHUNK_HEIGHT - 1) &&
				y < LevelMaker.CHUNK_HEIGHT * LevelMaker.TOTAL_CHUNK_HEIGHT
			)
			*/
			this.playerSpawn = new Vector(x * Tile.TILE_SIZE, y * Tile.TILE_SIZE);
		}
	}

	/*
		If our tiles were animated, this is potentially where we could iterate over all of them
		and update either per-tile or per-map animations for appropriately flagged tiles!
	*/
	update(dt) { }

	render() { this.tiles.forEach(tile => { tile.render(this.tileset); }); }

	/**
	 * Returns the tilemap (x, y) of a tile given the
	 * canvas (x, y) of coordinates in the world space.
	 *
	 * @param {number} x Canvas X
	 * @param {number} y Canvas Y
	 * @returns The tile at the given canvas coordinates.
	 */

	getTileFromCoordinate(x, y)
	{
		for (let i = 0; i < this.tiles.length; i++)
		{
			if (this.tiles[i].isPointWithinTile(new Vector(x, y)))
				return this.tiles[i];
		}
		return null;
	}
}