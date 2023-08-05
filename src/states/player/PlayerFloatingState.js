import { keys, sounds, timer } from "../../globals.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerState from "./PlayerState.js"
import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import JumpState from "../../enums/JumpState.js";
import SpriteFactory from "../../services/SpriteFactory.js"
import SoundName from "../../enums/SoundName.js";

export default class PlayerFloatingState extends PlayerState
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
            charge: new Animation([0, 1, 2, 3], 0.075, 1),
            fly: new Animation([4, 5, 6, 7], 0.075),
            land: new Animation([3, 2, 1, 0], 0.075, 1)
        }
        this.state = 'charge';
	}

	enter()
	{
        sounds.play(SoundName.Jetpack);
		this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Floating);
        this.player.currentAnimation = this.animation.charge;
        this.player.velocity.x *= 1.5;
    }
    
    exit()
    {
        sounds.stop(SoundName.Jetpack);
        this.player.velocity.x /= 1.5;
        this.animation.charge.refresh();
        this.animation.fly.refresh();
        this.animation.land.refresh();
        this.state = 'charge';
    }

	update(dt)
	{
        super.gravity(dt)
        this.player.position.add(this.player.velocity, dt);

        if (this.player.velocity.y >= 25) this.player.velocity.y = 25;
        switch (this.state)
        {
            case 'charge':
                if (this.player.currentAnimation.isDone())
                {
                    this.state = 'fly';
                    this.player.currentAnimation = this.animation.fly;
                }
                break;
            case 'fly':
                if ((!keys.f && !keys.F)
                //|| this.player.jetpack <= 0
                )
                {
                    this.state = 'land';
                    this.player.currentAnimation = this.animation.land;
                }
                super.airControl();
                break;
            case 'land':
                if (this.player.currentAnimation.isDone())
                    this.player.changeState(PlayerStateName.Falling, this);
                break;
        }
        super.land();
	}
}