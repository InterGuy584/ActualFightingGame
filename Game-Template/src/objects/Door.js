import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Player from "../entities/Player.js"
import { images, context, DEBUG } from "../globals.js";
import Tile from "./Tile.js";
import Vector from "../../lib/Vector.js";
import Hitbox from "../../lib/Hitbox.js";
import Animation from "../../lib/Animation.js";

export default class Door extends GameObject
{
    static WIDTH = Tile.TILE_SIZE * 2;
    static HEIGHT = Tile.TILE_SIZE * 2;

    constructor(position)
    {
        let dimensions = new Vector(Door.WIDTH, Door.HEIGHT);
        super(dimensions, position);

        this.playerReached = false;

        this.sprites = Sprite.generateSpritesFromSpriteSheet
        (
            images.get(ImageName.Exit),
            Door.WIDTH,
            Door.HEIGHT
        );
        this.animation = new Animation([0, 1, 2, 3], 0.2);

        this.hitbox = new Hitbox(this.position.x, this.position.y, Door.WIDTH, Door.HEIGHT);
    }

    update(dt) { this.animation.update(dt); }

    render()
    {
        this.sprites[this.animation.getCurrentFrame()].render(this.position.x, this.position.y);
        if (DEBUG) this.hitbox.render(context);
    }

    /**
     * @param {Player} collider
     */
    onCollision(collider)
    {
        super.onCollision(collider)
        
        if (collider instanceof Player)
            this.playerReached = true
    }
}