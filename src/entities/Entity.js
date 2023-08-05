import Direction from "../enums/Direction.js";
import Vector from "../../lib/Vector.js";

export default class Entity
{
	static VELOCITY_LIMIT = 100;
	/**
	 * The base class to be extended by all entities in the game.
	 *
	 * @param {object} entityDefinition
	 */
	constructor(entityDefinition = {})
	{
		this.dimensions = entityDefinition.dimensions ?? new Vector();
		this.position = entityDefinition.position ?? new Vector();
		this.speed = entityDefinition.speed ?? new Vector();
		this.velocity = entityDefinition.velocity ?? new Vector(0, 0);
		this.velocityLimit = entityDefinition.velocityLimit ?? new Vector(Entity.VELOCITY_LIMIT, Entity.VELOCITY_LIMIT);
		this.direction = Direction.Right;
		this.sprites = [];
		this.currentAnimation = null;
		this.stateMachine = null;
		this.isDead = false;
		this.cleanUp = false;
		this.deathAnimation = false;
	}

	changeState(state, params) { this.stateMachine.change(state, params); }

	update(dt)
	{
		this.stateMachine.update(dt);
		this.currentAnimation.update(dt);
		this.position.add(this.velocity, dt);
	}
}