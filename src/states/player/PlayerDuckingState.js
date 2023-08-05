import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerState from "./PlayerState.js"
import { keys } from "../../globals.js";
import Vector from "../../../lib/Vector.js";
import SpriteFactory from "../../services/SpriteFactory.js"

export default class PlayerDuckingState extends PlayerState
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
        this.animation = new Animation([0, 1, 2, 3], 0.1, 1);
		this.position = new Vector(0, 0);
		this.state = 'duckingDown';
	}

	enter()
	{
		this.state = 'duckingDown';
		this.player.velocity.x = 0;
		this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Ducking);
		this.player.currentAnimation = this.animation;
	}

	exit()
	{
        this.animation.refresh();
	}

	update(dt)
    {
        this.player.currentAnimation.update(dt);
		if (super.checkForNoTilesBelow())
			this.player.changeState(PlayerStateName.Falling, this);
		
		switch (this.state)
		{
			case 'duckingDown':
				if (this.player.currentAnimation.isDone())
					this.state = 'ducking';
				break;
			case 'ducking':
				if (!keys.s && !keys.S)
				{
					this.state = 'duckingUp';
					this.player.currentAnimation = new Animation([3, 2, 1, 0], 0.1, 1);
				}
				break;
			case 'duckingUp':
				if (this.player.currentAnimation.isDone())
					this.player.changeState(PlayerStateName.Idle, this);
				break;
		}
	}
}