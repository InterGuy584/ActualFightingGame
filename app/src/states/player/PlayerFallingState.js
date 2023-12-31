import { keys } from "../../globals.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerState from "./PlayerState.js"
import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import JumpState from "../../enums/JumpState.js";
import SpriteFactory from "../../services/SpriteFactory.js";

export default class PlayerFallingState extends PlayerState
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
		this.animation = new Animation([4, 5, 6, 7], 0.2)
	}

	enter()
	{
		console.log("fall")
		this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Falling);
		this.player.currentAnimation = this.animation;
		if (this.player.jumpState == JumpState.OnGround) this.player.jumpState = JumpState.SingleJump
	}

	update(dt)
	{
		// How do I make the held w key trigger a jump on the ground, but not in the air?
		console.log(keys.w);
		super.gravity(dt);
        this.player.currentAnimation.update(dt);

		// don't let them jump after double jump
		if ((keys.w || keys.W)
		&& (this.player.jumpState != JumpState.DoubleJump))
				this.player.changeState(PlayerStateName.Jumping, this);
		super.superJump();
		super.float();
		super.aim();
		if (keys.s || keys.S) this.player.velocity.y = 250;

		//super.airControl();
        super.land();
	}
}