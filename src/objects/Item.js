import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Player from "../entities/Player.js"
import { images, context, DEBUG, sounds } from "../globals.js";
import Tile from "./Tile.js";
import Vector from "../../lib/Vector.js";
import Hitbox from "../../lib/Hitbox.js";
import ItemType from "../enums/ItemType.js";
import SoundName from "../enums/SoundName.js";

export default class Item extends GameObject
{
    static WIDTH = Tile.TILE_SIZE;
    static HEIGHT = Tile.TILE_SIZE;

    constructor(position, type)
    {
        let dimensions = new Vector(Item.WIDTH, Item.HEIGHT);
        super(dimensions, position);

        this.type = type;
        this.sprite = this.getItemSprite(this.type);

        this.hitbox = new Hitbox(this.position.x, this.position.y, Item.WIDTH, Item.HEIGHT);
    }

    getItemSprite(type)
    {
        let x;
        let y;
        switch(type)
        {
            case ItemType.Heart:
                x = 0;
                y = 0;
                break;
            case ItemType.Bullet:
                x = 1 * Item.WIDTH;
                y = 0;
                break;
            case ItemType.TripleJump:
                x = 0;
                y = 1 * Item.HEIGHT;
                break;
            case ItemType.Hover:
                x = 1 * Item.WIDTH;
                y = 1 * Item.HEIGHT;
                break;
            case ItemType.SuperJump:
                x = 2 * Item.WIDTH;
                y = 1 * Item.HEIGHT;
                break;
        }

        return new Sprite
        (
            images.get(ImageName.Items),
            x,
            y,
            Item.WIDTH,
            Item.HEIGHT
        )
    }

    render()
    {
        //this.sprites[this.currentAnimation.getCurrentFrame()].render(x, y, this.rotation);
        this.sprite.render(this.position.x, this.position.y);
        if (DEBUG) this.hitbox.render(context);
    }

    /**
     * @param {Player} collider
     */
    onCollision(collider)
    {
        super.onCollision(collider)
        let escape = false;
        
        if (collider instanceof Player)
        {
            switch (this.type)
            {
                case ItemType.Heart:
                    if (collider.health >= 3) escape = true;
                    else collider.health++;
                    break;
                case ItemType.Bullet:
                    collider.bullets += 1;
                    collider.gun = true;
                    break;
                case ItemType.TripleJump:
                    collider.triple = true;
                    break;
                case ItemType.Hover:
                    collider.hover = true;
                    break;
                case ItemType.SuperJump:
                    collider.boost = true;
                    break;
            }
            if (!escape)
            {
                sounds.play(SoundName.Item)
                this.collected = true;
            }
        }

    }
}