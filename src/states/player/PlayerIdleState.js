import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { keys, mouseCoor, cX, cY } from "../../globals.js";
import PlayerState from "./PlayerState.js"
import SpriteFactory from "../../services/SpriteFactory.js"

export default class PlayerIdleState extends PlayerState
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
		this.animation = new Animation([2, 3], 0.5)
	}

	enter()
	{
		this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Idle);
		this.player.currentAnimation = this.animation;
	}

	update(dt)
	{
		this.player.currentAnimation = this.animation;

		if (keys.a || keys.A) this.player.direction = Direction.Left;
		else if (keys.d || keys.D) this.player.direction = Direction.Right;

		if (keys.a || keys.d) this.player.changeState(PlayerStateName.Walking, this);
		else if (keys.A || keys.D) this.player.changeState(PlayerStateName.Running, this);
		
		super.jump();
		super.duck();

		if (super.checkForNoTilesBelow()) this.player.changeState(PlayerStateName.Falling, this);
		this.stop();
	}

	stop()
	{
		if (Math.abs(this.player.velocity.x) > 0) this.player.velocity.x *= this.player.frictionScalar;
		if (Math.abs(this.player.velocity.x) < 5) this.player.velocity.x = 0;
	}
}