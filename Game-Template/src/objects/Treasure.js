import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Player from "../entities/Player.js"
import { images, context, DEBUG } from "../globals.js";
import Tile from "./Tile.js";
import Vector from "../../lib/Vector.js";
import Hitbox from "../../lib/Hitbox.js";
import Item from "./Item.js";

export default class Treasure extends GameObject
{
    static WIDTH = Tile.TILE_SIZE;
    static HEIGHT = Tile.TILE_SIZE;

    static CLOSED = 0;
    static OPEN = 1;

    constructor(position, itemType)
    {
        let dimensions = new Vector(Treasure.WIDTH, Treasure.HEIGHT);
        super(dimensions, position);

        this.open = false;
        this.item = null;
        this.itemType = itemType;

        this.sprites = Sprite.generateSpritesFromSpriteSheet
        (
            images.get(ImageName.Treasure),
            Treasure.WIDTH,
            Treasure.HEIGHT
        );

        this.hitbox = new Hitbox(this.position.x, this.position.y, Treasure.WIDTH, Treasure.HEIGHT);
    }

    onOpen()
    {
        this.open = true;
        this.item = new Item(new Vector(this.position.x, this.position.y - Tile.TILE_SIZE), this.itemType);
    }

    render()
    {
        this.sprites[(this.open) ? Treasure.OPEN : Treasure.CLOSED].render(this.position.x, this.position.y);

        if (this.item != null)
        {
            this.item.render();
            if (this.item.collected)
                this.item = null;
        }
        if (DEBUG) this.hitbox.render(context);
    }

    didCollideWithEntity(hitbox, collider)
    {
        if (this.item != null && this.item.didCollideWithEntity(hitbox))
            this.item.onCollision(collider);
        return super.didCollideWithEntity(hitbox);
    }

    /**
     * @param {Player} collider
     */
    onCollision(collider)
    {
        super.onCollision(collider)
        
        if (collider instanceof Player && !this.open)
            this.onOpen();
    }
}