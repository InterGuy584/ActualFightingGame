import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import { context, images } from "../globals.js";
import Sprite from "../../lib/Sprite.js";

export default class uiBox
{
    static TILE_SIZE = 16;
	/**
	 * Contains all the tiles that comprise the map.
	 *
	 * @param {number} width How many tiles wide the map will be.
	 * @param {number} height How many tiles tall the map will be.
	 */
	constructor(x, y, width, height)
	{
		this.position = new Vector(x, y);
        this.dimensions = new Vector(width, height);
        this.uiTileSprites = [];
        this.spriteRotations = [];
        this.generateSprites();
	}

    elementInArray(element, array)
    {
        let inArray = false;
        for (let i = 0; i < array.length; i++)
        {
            if (array[i] == element)
            {
                inArray = true;
                break;
            }
        }
        return inArray;
    }

    generateSprites() {
        for (let j = 0; j < this.dimensions.y; j += uiBox.TILE_SIZE)
        {
            for (let i = 0; i < this.dimensions.x; i += uiBox.TILE_SIZE)
            {
                // check for edge cases to see if it's a corner / edge tile
                // and if so, how should it be rotated?

                let edges = [];
                if (j == 0)
                    edges.push("top");
                if (i >= this.dimensions.x - uiBox.TILE_SIZE)
                    edges.push("right");
                if (j >= this.dimensions.y - uiBox.TILE_SIZE)
                    edges.push("bottom");
                if (i == 0)
                    edges.push("left");

                // one edge: top -> right -> bottom -> left
                // two edges: left-top -> top-right -> right-bottom -> bottom-left
                let rotation;
                if (this.elementInArray("top", edges) && !this.elementInArray("right", edges))
                    rotation = 0;
                else if (this.elementInArray("right", edges) && !this.elementInArray("bottom", edges))
                    rotation = Math.PI * 0.5;
                else if (this.elementInArray("bottom", edges) && !this.elementInArray("left", edges))
                    rotation = Math.PI;
                else if (this.elementInArray("left", edges) && !this.elementInArray("top", edges))
                    rotation = Math.PI * 1.5;

                let x;
                let y;

                switch (edges.length)
                {
                    case 0:
                        x = 0;
                        y = uiBox.TILE_SIZE;
                        // rotation doesn't matter if it's the center
                        rotation = 0;
                        break;
                    case 1:
                        x = uiBox.TILE_SIZE;
                        y = 0;
                        break;
                    case 2:
                        x = 0;
                        y = 0;
                        break;
                }

                this.uiTileSprites.push
                (
                    new Sprite(
                        images.get(ImageName.UiTiles),
                        x,
                        y,
                        uiBox.TILE_SIZE,
                        uiBox.TILE_SIZE
                    )
                )
                this.spriteRotations.push(rotation);
            }
        }
    }

	/*
		If our tiles were animated, this is potentially where we could iterate over all of them
		and update either per-tile or per-map animations for appropriately flagged tiles!
	*/
	update(dt) { }

	render()
    {
		for (let j = 0; j < Math.floor(this.dimensions.y / uiBox.TILE_SIZE); j++)
        {
            for (let i = 0; i < Math.floor(this.dimensions.x / uiBox.TILE_SIZE); i++)
            {
                context.save();
                context.translate(this.position.x + (i * uiBox.TILE_SIZE) + (uiBox.TILE_SIZE / 2), this.position.y + (j * uiBox.TILE_SIZE) + (uiBox.TILE_SIZE / 2));
                context.rotate(this.spriteRotations[j * Math.floor(this.dimensions.x / uiBox.TILE_SIZE) + i]);
                context.translate(-uiBox.TILE_SIZE / 2, -uiBox.TILE_SIZE / 2);
                this.uiTileSprites[j * Math.floor(this.dimensions.x / uiBox.TILE_SIZE) + i].render(0, 0);
                context.restore();
            }
        }
	}
}