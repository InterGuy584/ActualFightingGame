import GameStateName from "../../enums/GameStateName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, sounds, stateMachine, timer } from "../../globals.js";
import State from "../../../lib/State.js"
import SoundName from "../../enums/SoundName.js";

/**
 * Represents the state the game is in right before we start playing.
 * It will fade in, display a drop-down "Level X" message, then transition
 * to the PlayState, where the player can start playing the game.
 */
// Well, level X never happened.
export default class TransitionState extends State
{
	constructor()
	{
		super();

		// Used to animate the full-screen transition rectangle.
		this.transitionAlpha = 0;
		this.currentState = null;
	}

	enter(parameters)
	{
		this.fromState = parameters.fromState;
		this.toState = parameters.toState;
		this.r = (parameters.fade == 'white') ? '255' : '0';
		this.g = (parameters.fade == 'white') ? '255' : '0';
		this.b = (parameters.fade == 'white') ? '255' : '0';
		this.toStateEnterParameters = parameters.toStateEnterParameters;
		this.currentState = this.fromState;
		this.transitionAlpha = 0;

		this.fadeOut();
	}

	update(dt) { timer.update(dt); }

	render()
	{
		this.currentState.render();
		context.fillStyle = `rgb(` + this.r + `, ` + this.g + `, ` + this.b + `, ${this.transitionAlpha})`;
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	/**
	 * Tween the transition rectangle's alpha to 1, then begin to
	 * fade in the next state.
	 */
	fadeOut()
	{
		timer.tween(this, ['transitionAlpha'], [1], 'static', 0.5, () =>
		{
			this.currentState = this.toState;
			this.currentState.enter(this.toStateEnterParameters);
			if (this.currentState.name == 'game-over-selection')
			{
				timer.wait(1, () => 
				{
					sounds.play(SoundName.Die);
					sounds.play(SoundName.Die2);
					sounds.play(SoundName.Die3);
					sounds.play(SoundName.Crash);
					timer.wait(1, () => this.fadeIn())
				})
			}
			else this.fadeIn();
		});
	}

	/**
	 * Tween the transition rectangle's alpha to 0, then set the
	 * current state to the new state in the state machine.
	 */
	fadeIn()
	{
		timer.tween(this, ['transitionAlpha'], [0], 'static', 0.5, () => { stateMachine.currentState = this.currentState; });
	}
}