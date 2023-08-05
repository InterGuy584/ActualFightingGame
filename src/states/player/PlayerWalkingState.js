import { keys } from "../../globals.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerState from "./PlayerState.js"
import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import SpriteFactory from "../../services/SpriteFactory.js"

export default class PlayerWalkingState extends PlayerState
{
	/**
	 * In this state, the player is on the ground and moving
	 * either left or right. From here, the player can go idle
	 * if nothing is being pressed and there is no X velocity.
	 * The player can fall if there is no collisions below them,
	 * and they can jump if they hit spacebar.
	 *
	 * @param {Player} player
	 */
	constructor(player)
	{
		super(player);
		this.animation = new Animation([4, 5, 6, 7], 0.3)
	}

	enter()
	{
		this.player.velocityLimit.x = 100;
		this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Walking);
		this.player.currentAnimation = this.animation
	}
	
	exit() { this.animation.refresh(); }

	update(dt)
	{
        this.player.position.add(this.player.velocity, dt);
        this.player.currentAnimation.update(dt);

		super.jump();
		super.duck();
		
		if (keys.a)
		{
			this.player.direction = Direction.Left;
			this.player.velocity.x = Math.max(this.player.velocity.x - this.player.speedScalar * this.player.frictionScalar, -this.player.velocityLimit.x);
		}
		else if (keys.d)
		{
			this.player.direction = Direction.Right;
			this.player.velocity.x = Math.min(this.player.velocity.x + this.player.speedScalar * this.player.frictionScalar, this.player.velocityLimit.x);
		}
		else if (keys.A || keys.D) this.player.changeState(PlayerStateName.Running, this);
		else this.stop();

		if (super.checkForNoTilesBelow()) this.player.changeState(PlayerStateName.Falling, this);
	}

	stop()
	{
		if (Math.abs(this.player.velocity.x) > 0) this.player.velocity.x *= this.player.frictionScalar;

		if (Math.abs(this.player.velocity.x) < 5)
		{
			this.player.velocity.x = 0;
			this.player.changeState(PlayerStateName.Idle, this);
		}
	}
}