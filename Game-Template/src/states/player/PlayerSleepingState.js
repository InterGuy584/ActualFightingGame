import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { context, keys, sounds } from "../../globals.js";
import PlayerState from "./PlayerState.js"
import SpriteFactory from "../../services/SpriteFactory.js"
import JumpState from "../../enums/JumpState.js";
import SoundName from "../../enums/SoundName.js";

export default class PlayerSleepingState extends PlayerState
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
            asleep: new Animation([0, 0, 0], 1),
            wakeUp: new Animation([1, 2, 3, 4, 4, 4], 1.5, 1),
            struggling: new Animation([5, 6], 0.15, 8),
            gettingUp: new Animation([7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 0.1, 1)
        }
        this.state = 'asleep';
	}

	enter()
	{
		this.player.position.y -= 16;
        this.state = 'asleep';
		this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Sleeping);
		this.player.currentAnimation = this.animation.asleep;
	}

    exit()
    {
		this.player.position.y += 16;
        this.state = 'asleep';
        this.animation.asleep.refresh();
        this.animation.wakeUp.refresh();
        this.animation.struggling.refresh();
        this.animation.gettingUp.refresh();
    }

	update(dt)
	{
        this.player.currentAnimation.update(dt);
        switch (this.state)
        {
            case 'asleep':
                if (keys.Space)
                {
                    this.player.currentAnimation = this.animation.wakeUp;
                    this.state = 'wakeUp';
                }
                break;
            case 'wakeUp':
                if (this.player.currentAnimation.isDone())
                {
                    sounds.play(SoundName.Struggle);
                    this.player.currentAnimation = this.animation.struggling;
                    this.state = 'struggling';
                }
                break;
            case 'struggling':
                if (this.player.currentAnimation.isDone())
                {
                    sounds.stop(SoundName.Struggle);
                    sounds.play(SoundName.Explosion);
                    sounds.play(SoundName.Jump);
                    this.player.asleep = false;
                    this.player.jumpState = JumpState.OnGround;
                    this.player.currentAnimation = this.animation.gettingUp;
                    this.state = 'gettingUp';
                }
                break;
            case 'gettingUp':
                if (this.player.currentAnimation.isDone())
                    this.player.changeState(PlayerStateName.Idle);
                break;
        }
	}
}