import { keys } from "../../globals.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerState from "./PlayerState.js"
import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import SpriteFactory from "../../services/SpriteFactory.js"

export default class PlayerRunningState extends PlayerState
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
		this.animation = new Animation([8, 9, 10, 11, 12, 13, 14, 15], 0.15)
	}

	enter()
	{
		this.player.velocityLimit.x *= 1.5;
		this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Running);
		this.player.currentAnimation = this.animation;
	}

	exit()
	{
		keys.Shift = false;
		this.player.velocityLimit.x /= 1.5;
		this.animation.refresh();
	}

	update(dt)
	{
        this.player.position.add(this.player.velocity, dt);
        this.player.currentAnimation.update(dt);

		super.jump();
		super.duck();
		
		if (keys.A)
		{
			this.player.direction = Direction.Left;
			this.player.velocity.x = Math.max(this.player.velocity.x - this.player.speedScalar * this.player.frictionScalar, -this.player.velocityLimit.x);
		}
		else if (keys.D)
		{
			this.player.direction = Direction.Right;
			this.player.velocity.x = Math.min(this.player.velocity.x + this.player.speedScalar * this.player.frictionScalar, this.player.velocityLimit.x);
		}
        else this.player.changeState((keys.a || keys.d) ? PlayerStateName.Walking : PlayerStateName.Idle);

		if (super.checkForNoTilesBelow()) this.player.changeState(PlayerStateName.Falling, this);
	}
}