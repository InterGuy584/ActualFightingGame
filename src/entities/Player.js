import Vector from "../../lib/Vector.js";
import Entity from "./Entity.js"
import { context, DEBUG } from "../globals.js";
import StateMachine from "../../lib/StateMachine.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import LevelMaker from "../services/LevelMaker.js";
import Tile from "../objects/Tile.js";
import Direction from "../enums/Direction.js";
import JumpState from "../enums/JumpState.js";
import PlayerIdleState from "../states/player/PlayerIdleState.js";
import PlayerWalkingState from "../states/player/PlayerWalkingState.js";
import PlayerRunningState from "../states/player/PlayerRunningState.js";
import PlayerFallingState from "../states/player/PlayerFallingState.js";
import PlayerDuckingState from "../states/player/PlayerDuckingState.js";
import PlayerJumpingState from "../states/player/PlayerJumpingState.js";
import PlayerSuperJumpingState from "../states/player/PlayerSuperJumpingState.js";
import PlayerFloatingState from "../states/player/PlayerFloatingState.js";
import Hitbox from "../../lib/Hitbox.js";
import SpriteFactory from "../services/SpriteFactory.js";
import PlayerGunState from "../states/player/PlayerGunState.js";
import PlayerSleepingState from "../states/player/PlayerSleepingState.js";
import PlayerHurtingState from "../states/player/PlayerHurtingState.js";
import PlayerDyingState from "../states/player/PlayerDyingState.js";

export default class Player extends Entity
{
	static WIDTH = 16;
	static HEIGHT = 16;
	static TOTAL_SPRITES = 11;
	static VELOCITY_LIMIT = 100;

	/**
	 * The hero character the player controls in the map.
	 * Has the ability to jump and will collide into tiles
	 * that are collidable.
	 *
	 * @param {Vector} dimensions The height and width of the player.
	 * @param {Vector} position The x and y coordinates of the player.
	 */
	constructor(dimensions, position, level)
	{
		super( {dimensions: dimensions, position: position, speed: 200} );
		this.level = level;

		this.speedScalar = 5;
		this.gravityScalar = 10;
		//this.maxGravity = 150;
		this.frictionScalar = 0.9;
		this.groundHeight = LevelMaker.GROUND_HEIGHT * Tile.TILE_SIZE - this.dimensions.y;
		this.jumpState = JumpState.Asleep;
		this.rotation = 0;

		this.health = 3;

		this.bullets = 0;
		this.gun = false;
		this.boost = false;
		this.hover = false;
		this.triple = false;
		this.boostUsed = false;
		this.asleep = true;

		this.sprites = SpriteFactory.getSprite(PlayerStateName.Idle);
		this.stateMachine = this.initializeStateMachine();

		this.hitbox = new Hitbox(this.position.x + 2, this.position.y + 2, this.dimensions.x - 4, this.dimensions.y - 4);
	}

	render()
	{
		context.save();
		let x = 0;
		let y = 0;
		context.rotate(this.rotation);
		if (this.direction === Direction.Left)
		{
			x = Math.floor(this.position.x);
			y = Math.floor(this.position.y);
		}
		else
		{
			context.translate(Math.floor(this.position.x) + this.dimensions.x, Math.floor(this.position.y));
			context.scale(-1, 1);
		}
		this.sprites[this.currentAnimation.getCurrentFrame()].render(x, y);
		//this.arrow.render(x, y - 20, this.rotation)
		context.restore();

		this.hitbox.set(this.position.x + 2, this.position.y + 2, this.dimensions.x - 4, this.dimensions.y - 4);
		if (DEBUG) this.hitbox.render(context);
	}

	initializeStateMachine()
	{
		const stateMachine = new StateMachine();
		stateMachine.add(PlayerStateName.Sleeping, 	   new PlayerSleepingState(this));
		stateMachine.add(PlayerStateName.Idle, 		   new PlayerIdleState(this));
		stateMachine.add(PlayerStateName.Walking, 	   new PlayerWalkingState(this));
		stateMachine.add(PlayerStateName.Running, 	   new PlayerRunningState(this));
		stateMachine.add(PlayerStateName.Falling, 	   new PlayerFallingState(this));
		stateMachine.add(PlayerStateName.Ducking, 	   new PlayerDuckingState(this));
		stateMachine.add(PlayerStateName.Jumping, 	   new PlayerJumpingState(this));
		stateMachine.add(PlayerStateName.SuperJumping, new PlayerSuperJumpingState(this));
		stateMachine.add(PlayerStateName.Floating, 	   new PlayerFloatingState(this));
		stateMachine.add(PlayerStateName.Aiming, 	   new PlayerGunState(this));
		stateMachine.add(PlayerStateName.Hurting, 	   new PlayerHurtingState(this));
		stateMachine.add(PlayerStateName.Dying, 	   new PlayerDyingState(this));

		//if (DEBUG)
		//{
		this.jumpState = JumpState.OnGround;
		stateMachine.change(PlayerStateName.Idle)
		//}

		return stateMachine;
	}
}