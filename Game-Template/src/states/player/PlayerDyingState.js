import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerState from "./PlayerState.js"
import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import SpriteFactory from "../../services/SpriteFactory.js";

export default class PlayerDyingState extends PlayerState
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
		this.animation = new Animation([0, 1, 2, 3], 0.1)
	}

	enter()
	{
		this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Dying);
		this.player.currentAnimation = this.animation;
	}

	update(dt)
	{
        this.player.currentAnimation.update(dt);
	}
}