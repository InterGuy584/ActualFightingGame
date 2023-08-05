import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Player from "../../entities/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { context, stateMachine, sounds } from "../../globals.js";
import LevelMaker from "../../services/LevelMaker.js";
import SoundName from "../../enums/SoundName.js";

export default class GameOverState extends State
{
	constructor()
	{
		super();
	}

	enter(parameters)
	{
		this.level = LevelMaker.makeEmptyLevel();
		this.player = new Player
		(
			new Vector(256, 256),
			new Vector(800, -250),
			this.level
		);
		this.player.changeState(PlayerStateName.Dying, this);
		this.opacity = 0.0;
	}

	update(dt)
	{
		this.player.rotation += 0.001;
		this.player.position.y += 2;
		this.player.update(dt);
		if (this.player.position.y >= -200 && this.player.position.y <= -100)
		{
			sounds.play(SoundName.Fall);
		}
		if (this.player.position.y >= 50 && this.opacity < 1.0)
		{
			this.opacity += 0.01
		}
		if (this.player.position.y >= 370)
		{
			stateMachine.change(GameStateName.Transition,
			{
				fromState: this,
				toState: stateMachine.states[GameStateName.GameOverSelection],
				fade: 'black'
			});
		}
	}

	render()
	{
		this.player.render();
		this.level.render();

		context.save();
		context.font = '64px Joystix';
		context.fillStyle = 'red';
		context.globalAlpha = this.opacity;
		context.fillText("Game Over...", 100, 100);
		context.globalAlpha = 1.0;
		context.restore();
	}
}