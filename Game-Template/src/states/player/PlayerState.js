import Player from "../../entities/Player.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import State from "../../../lib/State.js"
import { keys, sounds } from "../../globals.js";
import Direction from "../../enums/Direction.js";
import JumpState from "../../enums/JumpState.js";
import SoundName from "../../enums/SoundName.js";

export default class PlayerState extends State
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
		super();
		this.player = player;
	}
	
    jump() { if (keys.Space) this.player.changeState(PlayerStateName.Jumping, this); }
    duck() { if (keys.s || keys.S) this.player.changeState(PlayerStateName.Ducking, this); }
	superJump() { if ((keys.q || keys.Q) && this.player.boost && !this.player.boostUsed) this.player.changeState(PlayerStateName.SuperJumping, this); }
	float() { if ((keys.f || keys.F) && this.player.hover) this.player.changeState(PlayerStateName.Floating, this); }
	aim() { if (keys.RightClick && this.player.bullets > 0) this.player.changeState(PlayerStateName.Aiming, this); }

	checkForNoTilesBelow()
	{
		let bottomLeftTile = this.player.level.tilemap.getTileFromCoordinate(this.player.position.x + 2, this.player.position.y + Player.HEIGHT);
		let bottomRightTile = this.player.level.tilemap.getTileFromCoordinate(this.player.position.x + Player.WIDTH - 2, this.player.position.y + Player.HEIGHT);

		return ((bottomLeftTile == null || !bottomLeftTile.isCollidable()) && (bottomRightTile == null || !bottomRightTile.isCollidable()))	
	}
	
    gravity(dt)
    {
		this.player.velocity.y =
		this.player.velocity.y + this.player.gravityScalar < this.player.maxGravity ?
			this.player.velocity.y + this.player.gravityScalar :
			this.player.maxGravity;
        this.player.position.add(this.player.velocity, dt);
    }

	land()
	{
		let bottomLeftTile = this.player.level.tilemap.getTileFromCoordinate(this.player.position.x + 2, this.player.position.y + Player.HEIGHT);
		let bottomRightTile = this.player.level.tilemap.getTileFromCoordinate(this.player.position.x + Player.WIDTH - 2, this.player.position.y + Player.HEIGHT);

		if ((bottomLeftTile != null && bottomLeftTile.isCollidable()) || (bottomRightTile != null && bottomRightTile.isCollidable()))
		{
			sounds.stop(SoundName.Land);
			sounds.play(SoundName.Land);
			this.player.velocity.y = 0;
			this.player.jumpState = JumpState.OnGround;
			this.player.changeState(PlayerStateName.Idle, this);
			this.player.boostUsed = false;
		}
	}

    airControl()
    {
        if (keys.a || keys.A)
		{
			this.player.direction = Direction.Left;
			this.player.velocity.x = Math.max(this.player.velocity.x - this.player.speedScalar * this.player.frictionScalar, -this.player.velocityLimit.x);
		}
		else if (keys.d || keys.D)
		{
			this.player.direction = Direction.Right;
			this.player.velocity.x = Math.min(this.player.velocity.x + this.player.speedScalar * this.player.frictionScalar, this.player.velocityLimit.x);
		}
    }
}