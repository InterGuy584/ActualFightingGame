import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerState from "./PlayerState.js"
import { keys, sounds } from "../../globals.js";
import Vector from "../../../lib/Vector.js";
import SpriteFactory from "../../services/SpriteFactory.js"
import SoundName from "../../enums/SoundName.js";

export default class PlayerGunState extends PlayerState
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
			aiming: new Animation([0, 1, 2, 3, 4, 5], 0.1, 1),
			firing: new Animation([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.05, 1)
		}
		this.position = new Vector(0, 0);
        this.state = 'settingUp';
	}

	enter()
	{
		this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Aiming);
		this.player.currentAnimation = this.animation.aiming;
		this.player.velocity.y = -200;
		sounds.play(SoundName.Aim);
	}

	exit()
	{
        this.state = 'settingUp';
        this.animation.aiming.refresh();
        this.animation.firing.refresh();
	}

	update(dt)
    {
        this.player.currentAnimation.update(dt);

		super.airControl();
		
		switch (this.state)
		{
			case 'settingUp':
				if (this.player.currentAnimation.isDone())
					this.state = 'aiming';
				break;
			case 'aiming':
				super.land();
				if (keys.LeftClick)
				{
					sounds.play(SoundName.Gun)
					this.player.bullets--;
					this.animation.firing.refresh();
					this.player.velocity.y = -250;
					this.player.currentAnimation = this.animation.firing;
					this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Firing);
					this.state = 'firing';
				}
                if ((!keys.RightClick) || this.player.bullets <= 0)
                {
					this.player.velocity.y = -200;
                    this.player.currentAnimation = new Animation([5, 4, 3, 2, 1, 0], 0.1, 1);
					this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Aiming);
                    this.state = 'goingBack';
                }
				break;
			case 'firing':
				if (this.player.currentAnimation.isDone())
				{
					this.state = 'aiming';
				}
				break;
            case 'goingBack':
				if (this.player.currentAnimation.isDone())
					this.player.stateMachine.change(PlayerStateName.Falling, this);
                break;
		}
		super.gravity(dt);
	}
}