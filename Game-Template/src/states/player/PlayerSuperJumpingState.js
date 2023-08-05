import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerState from "./PlayerState.js"
import { keys, mouseCoor, sounds } from "../../globals.js";
import SpriteFactory from "../../services/SpriteFactory.js"
import SoundName from "../../enums/SoundName.js";

export default class PlayerSuperJumpingState extends PlayerState
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
            ducking:  new Animation([0, 1, 2, 3], 0.1, 1),
            charging: new Animation([0, 1, 2, 3, 4, 5, 6, 7], 0.1, 5),
            jumping:  new Animation([0, 1, 2, 3, 4, 5, 6, 7], 0.05, 1)
        };
        this.state = 'ducking';
        this.chargeUp = -300;
	}

	enter()
	{
		this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Ducking);
        this.player.currentAnimation = this.animation.ducking;
        this.player.boostUsed = true;
        sounds.play(SoundName.Charging);
	}

    exit()
    {
        this.animation.jumping.cycles = 2;
        this.chargeUp = -300;
        this.state = 'ducking';
        this.animation.ducking.refresh();
        this.animation.charging.refresh();
        this.animation.jumping.refresh();
    }

	update(dt)
    {
        this.player.currentAnimation.update(dt);

        switch (this.state)
        {
            case 'ducking':
                if (this.player.currentAnimation.isDone())
                {
                    this.state = 'charging';
                    this.player.sprites = SpriteFactory.getSprite(PlayerStateName.Charging);
                    this.player.currentAnimation = this.animation.charging;
                }
                break;
            case 'charging':
                this.chargeUp -= 3;
                this.player.velocity.y = 30;
                this.player.velocity.x = 0;
                this.player.maxGravity = 30;
                if (keys['LeftClick']) this.player.rotation = Math.atan2(mouseCoor.y - this.player.position.y, mouseCoor.x - this.player.dimensions.x) + Math.PI / 2
                else this.player.rotation = 0;
                
                if ((!keys.q && !keys.Q) || this.player.currentAnimation.isDone())
                {
                    sounds.stop(SoundName.Charging);
                    sounds.play(SoundName.Boost);
                    if (this.player.currentAnimation.isHalfwayDone())
                    {
                        this.animation.jumping.cycles = 3;
                    }
                    if (this.player.currentAnimation.isDone())
                    {
                        this.animation.jumping.cycles = 5
                    }
                    this.player.sprites = SpriteFactory.getSprite(PlayerStateName.DoubleJumping);
                    this.player.currentAnimation = this.animation.jumping;
                    this.player.rotation = 0;
                    this.player.maxGravity = 150;
                    this.state = 'jumping';
                    this.player.velocity.y = this.chargeUp;
                }
                break;
            case 'jumping':
                super.gravity(dt);
                super.airControl();
    
                if (this.player.currentAnimation.isDone())
                    this.player.changeState(PlayerStateName.Falling, this);
                break;
        }
    }
}