/**
 * Game Name
 * HEAVEN JUMPER
 *
 * Authors
 * PHIL LIZOTTE
 * SEAN GREGORY
 *
 * Brief description
 * Collect powerups and items to climb your way to the top of the aether because that's pretty cool.
 *
 * Asset sources
 * None yet
 */

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import
{
	canvas,
	context,
	fonts,
	images,
	keys,
	sounds,
	stateMachine,
} from "./globals.js";
import PlayState from "./states/game/PlayState.js";
import GameOverState from "./states/game/GameOverState.js";
import VictoryState from "./states/game/VictoryState.js";
import TitleScreenState from "./states/game/TitleScreenState.js";
import PauseState from "./states/game/PauseState.js";
import TransitionState from "./states/game/TransitionState.js";
import GameOverSelectionState from "./states/game/GameOverSelection.js";

fetch('./src/config.json').then(response => response.json())
.then(response => 
{
	// Fetch the asset definitions from config.json.
	const
	{
		images: imageDefinitions,
		fonts: fontDefinitions,
		sounds: soundDefinitions,
		// @ts-ignore
	} = response;

	// Load all the assets from their definitions.
	images.load(imageDefinitions);
	fonts.load(fontDefinitions);
	sounds.load(soundDefinitions);

	// Add all the states to the state machine.
	stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());
	stateMachine.add(GameStateName.Transition, new TransitionState());
	stateMachine.add(GameStateName.GameOver, new GameOverState());
	stateMachine.add(GameStateName.GameOverSelection, new GameOverSelectionState());
	stateMachine.add(GameStateName.Victory, new VictoryState());
	stateMachine.add(GameStateName.Play, new PlayState());
	stateMachine.add(GameStateName.Pause, new PauseState());

	stateMachine.change(GameStateName.TitleScreen);

	// Add event listeners for player input.
	canvas.addEventListener('keydown', event =>
	{ 
		keys[event.key] = true;
		if (event.key == "Shift")
		{
			if (keys.a)
			{
				keys.a = false;
				keys.A = true;
			}
			if (keys.d)
			{
				keys.d = false;
				keys.D = true;
			}
			if (keys.f)
			{
				keys.f = false;
				keys.F = true;
			}
			if (keys.q)
			{
				keys.q = false;
				keys.Q = true;
			}
			if (keys.p)
			{
				keys.p = false;
				keys.P = true;
			}
		}
		if (event.key == ' ')
			keys.Space = true;
	});
	canvas.addEventListener('keyup', event =>
	{
		keys[event.key] = false;
		if (event.key == "Shift")
		{
			if (keys.A)
			{
				keys.A = false;
				keys.a = true;
			}
			if (keys.D)
			{
				keys.D = false;
				keys.d = true;
			}
			if (keys.F)
			{
				keys.F = false;
				keys.f = true;
			}
			if (keys.Q)
			{
				keys.Q = false;
				keys.q = true;
			}
			if (keys.P)
			{
				keys.P = false;
				keys.p = true;
			}
		}
		if (event.key == ' ')
			keys.Space = false;
	});
	canvas.addEventListener('mousedown', event =>
	{
		switch (event.button)
		{
			case 0: keys.LeftClick = true; break;
			case 2: keys.RightClick = true; break;
		}
	})
	canvas.addEventListener('mouseup', event =>
	{
		switch (event.button)
		{
			case 0: keys.LeftClick = false; break;
			case 2: keys.RightClick = false; break;
		}
	});

	const game = new Game(stateMachine, context, canvas.width, canvas.height);
	
	canvas.oncontextmenu = function(e) { e.preventDefault(); }

	game.start();

	// Focus the canvas so that the player doesn't have to click on it.
	canvas.focus();
})