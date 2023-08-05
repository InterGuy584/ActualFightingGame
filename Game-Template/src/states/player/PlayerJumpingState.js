import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerState from "./PlayerState.js"
import JumpState from "../../enums/JumpState.js";
import SpriteFactory from "../../services/SpriteFactory.js"
import { keys, sounds } from "../../globals.js";
import SoundName from "../../enums/SoundName.js";

export default class PlayerJumpingState extends PlayerState
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
		this.animation = 
		{
			single: new Animation([2, 3, 4, 5, 6, 7], 0.1, 1),
			double: new Animation([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.06, 1)
		}
	}

	enter()
	{
		sounds.stop(SoundName.Jump);
		sounds.play(SoundName.Jump);
        switch (this.player.jumpState)
        {
            case JumpState.DoubleJump:
				this.player.sprites = SpriteFactory.getSprite(PlayerStateName.DoubleJumping)
				this.player.currentAnimation = this.animation.double;
				this.player.jumpState = JumpState.TripleJump;
				this.player.velocity.y = -250;
				break;
			case JumpState.SingleJump:
				this.player.sprites = SpriteFactory.getSprite(PlayerStateName.DoubleJumping)
				this.player.currentAnimation = this.animation.double;
                this.player.jumpState = JumpState.DoubleJump;
                this.player.velocity.y = -250;
                break;
            case JumpState.OnGround:
				this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Jumping);
				this.player.currentAnimation = this.animation.single;
                this.player.jumpState = JumpState.SingleJump;
                this.player.velocity.y = -300;
                break;
        }
	}

	exit()
	{
		keys.Space = false;
		this.animation.single.refresh();
		this.animation.double.refresh();
	}

	update(dt)
	{
        this.player.currentAnimation.update(dt);
		super.gravity(dt);
		super.airControl();

        if (this.player.currentAnimation.isDone())
            this.player.changeState(PlayerStateName.Falling, this);
	}
}