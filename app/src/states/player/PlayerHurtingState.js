import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerState from "./PlayerState.js"
import SpriteFactory from "../../services/SpriteFactory.js"
import Direction from "../../enums/Direction.js";
import { sounds } from "../../globals.js";
import SoundName from "../../enums/SoundName.js";

export default class PlayerHurtingState extends PlayerState
{
	/**
	 * In this state, the player is stationary unless
	 * left or right are pressed, or if there is no
	 * collision below.
	 *
	 * @param {Player} player
	 */
	constructor(player)
	{ 
		super(player);
		this.animation = new Animation([0, 1, 2, 3, 4, 5, 6, 7], 0.1)
	}

	enter()
	{
		sounds.play(SoundName.Hurt)
		this.player.health--;
		this.player.velocity.y = -300;
		this.player.velocity.x = (this.player.direction == Direction.Left) ? 70 : -70;
		this.player.maxGravity = 150;
		this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Hurting);
		this.player.currentAnimation = this.animation;
	}

	exit()
	{
		this.animation.refresh();
		this.player.maxGravity = 150;
	}

	update(dt)
	{
		this.gravity(dt);
        this.player.currentAnimation.update(dt);

		super.airControl();
		if (this.player.velocity.y >= 0 && this.player.health > 0) super.land();
	}

    gravity(dt)
    {
		this.player.velocity.y += this.player.gravityScalar;
        this.player.position.add(this.player.velocity, dt);
    }
}