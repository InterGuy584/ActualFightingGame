import Tilemap from "../objects/Tilemap.js";
import Level from "../objects/Level.js";
import ChunkData from "../data/levelLayouts/chunkData.js";
import TileType from "../enums/TileType.js";
import ImageName from "../enums/ImageName.js";
import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";

export default class LevelMaker
{
    // a chunk is an area of tiles (40 by 20 in this case)
	// chunks are shuffled across a set area (5 by 3 in this case) to generate new, but familiar level layouts.
	static TOTAL_CHUNK_WIDTH = 3;
	static TOTAL_CHUNK_HEIGHT = 5;

	static CHUNK_WIDTH = 40;
	static CHUNK_HEIGHT = 20;

	static GROUND_HEIGHT = 15;

	static POWERUP_CHANCE = 0.1;

	// basically the only function called by outside sources
	// this whole class exists to do one thing, and this function manages that thing.
	static makeLevel()
	{
		const tiles = []
		let shuffledChunkData = LevelMaker.shuffleArray(LevelMaker.copyArray(ChunkData));
		//console.log(shuffledChunkData)

		// first, iterate through each chunk's data, convert then into an array of tiles.
		/*
		for (let j = 0; j < LevelMaker.TOTAL_CHUNK_HEIGHT; j++)
		{
			for (let i = 0; i < LevelMaker.TOTAL_CHUNK_WIDTH; i++)
			{
				if (i == 0) LevelMaker.processFirstOfChunkRow(shuffledChunkData[(j * LevelMaker.TOTAL_CHUNK_WIDTH) + i].split(""), tiles);
				else LevelMaker.processRestOfChunkRow(shuffledChunkData[(j * LevelMaker.TOTAL_CHUNK_WIDTH) + i].split(""), tiles, j, i);
			}
		}
		*/
		
		LevelMaker.processBasicRoom(tiles);
		return new Level(new Tilemap(40, 20, tiles, ImageName.MainPlatformTileset));
	}

	static makeEmptyLevel()
	{
		return new Level(new Tilemap(LevelMaker.CHUNK_WIDTH * LevelMaker.TOTAL_CHUNK_WIDTH, LevelMaker.CHUNK_HEIGHT * LevelMaker.TOTAL_CHUNK_HEIGHT, [], ImageName.MainPlatformTileset));
	}

	static copyArray(array)
	{
		let newArray = [];
		for (let i = 0; i < array.length; i++)
			newArray.push(array[i]);
		return newArray;
	}

	static shuffleArray(array)
	{
		let newArray = [];
		let index;

		while (array.length > 0)
		{
			index = getRandomPositiveInteger(0, array.length - 1);
			newArray.push(array[index]);
			array.splice(index, 1);
		}

		return newArray;
	}
	
	// fill the first chunk in the row with its proper tiles.
	// fill the rest of the row with empty tiles (placeholders)
	static processFirstOfChunkRow(data, tiles)
	{
		// tiles per one full row of chunks
		let tilesPerChunkRow = LevelMaker.CHUNK_WIDTH * LevelMaker.CHUNK_HEIGHT * LevelMaker.TOTAL_CHUNK_WIDTH

		// tiles per one full row of tiles
		let tilesPerTileRow = LevelMaker.CHUNK_WIDTH * LevelMaker.TOTAL_CHUNK_WIDTH;

		let dataCounter = 0;

		for (let j = 0; j < LevelMaker.CHUNK_HEIGHT; j++)
		{
			for (let i = 0; i < tilesPerTileRow; i++)
			{
				if (i < LevelMaker.CHUNK_WIDTH)
				{
					switch (data[dataCounter])
					{
						case 'E':
							tiles.push(TileType.Empty);
							break;
						case 'C':
							tiles.push(TileType.Cloud);
							break;
						case 'S':
							tiles.push(TileType.Spike);
							break;
						case 'T':
							tiles.push(TileType.Treasure);
							break;
						case 'P':
							tiles.push(TileType.Player);
							break;
						default:
							tiles.push(TileType.Empty);
					}
					dataCounter++;
				}
				else tiles.push(TileType.Empty);
			}
		}
	}

	static processBasicRoom(tiles) {

		for (let j = 0; j < LevelMaker.CHUNK_HEIGHT; j++) {
			for (let i = 0; i < LevelMaker.CHUNK_WIDTH; i++) {
				if (j == LevelMaker.CHUNK_HEIGHT - 3 && i == (LevelMaker.CHUNK_WIDTH/2) - 2) {
					tiles.push(TileType.Player);
					continue;
				}

				if (j < LevelMaker.CHUNK_HEIGHT - 2) {
					tiles.push(TileType.Empty);
				} else {
					tiles.push(TileType.Cloud);
				}
			}
		}
		console.log(tiles);
	}
	
	// this replaces the placeholders with the actual tile types.
	static processRestOfChunkRow(data, tiles, row, col)
	{
		// tiles per one full row of chunks
		let tilesPerChunkRow = LevelMaker.TOTAL_CHUNK_WIDTH * LevelMaker.CHUNK_WIDTH * LevelMaker.CHUNK_HEIGHT;

		// tiles per one full row of tiles
		let tilesPerTileRow = LevelMaker.TOTAL_CHUNK_WIDTH * LevelMaker.CHUNK_WIDTH;

		for (let j = 0; j < LevelMaker.CHUNK_HEIGHT; j++)
		{
			for (let i = 0; i < LevelMaker.CHUNK_WIDTH; i++)
			{
				switch (data[(j * LevelMaker.CHUNK_WIDTH) + i])
				{
					case 'E':
						tiles[(row * tilesPerChunkRow) + (j * tilesPerTileRow) + (col * LevelMaker.CHUNK_WIDTH) + i] = TileType.Empty;
						break;
					case 'C':
						tiles[(row * tilesPerChunkRow) + (j * tilesPerTileRow) + (col * LevelMaker.CHUNK_WIDTH) + i] = TileType.Cloud;
						break;
					case 'S':
						tiles[(row * tilesPerChunkRow) + (j * tilesPerTileRow) + (col * LevelMaker.CHUNK_WIDTH) + i] = TileType.Spike;
						break;
					case 'T':
						tiles[(row * tilesPerChunkRow) + (j * tilesPerTileRow) + (col * LevelMaker.CHUNK_WIDTH) + i] = TileType.Treasure;
						break;
					case 'P':
						tiles[(row * tilesPerChunkRow) + (j * tilesPerTileRow) + (col * LevelMaker.CHUNK_WIDTH) + i] = TileType.Player;
						break;
					default:
						tiles[(row * tilesPerChunkRow) + (j * tilesPerTileRow) + (col * LevelMaker.CHUNK_WIDTH) + i] = TileType.Empty;
						break;
				}
			}
		}
	}
}