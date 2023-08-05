import State from "../../../lib/State.js";
import { context, CANVAS_WIDTH, CANVAS_HEIGHT, keys, stateMachine, sounds } from "../../globals.js";
import GameStateName from "../../enums/GameStateName.js";
import uiBox from "../../objects/uiBox.js";
import LevelMaker from "../../services/LevelMaker.js";
import Player from "../../entities/Player.js";
import Vector from "../../../lib/Vector.js";
import Camera from "../../../lib/Camera.js";
import SoundName from "../../enums/SoundName.js";

export default class VictoryState extends State
{
	constructor() { super(); }

	enter(parameters)
	{
		sounds.stop(SoundName.Choir);
		sounds.play(SoundName.Victory);
		let uiHeight = Math.floor((CANVAS_HEIGHT - 32) / uiBox.TILE_SIZE) * uiBox.TILE_SIZE;
		let uiWidth = Math.floor((uiHeight * 1.5) / uiBox.TILE_SIZE) * uiBox.TILE_SIZE;
		let uiY = 16;
		let uiX = 221;
		// make a UI box
		this.uiBox = new uiBox(uiX, uiY, uiWidth, uiHeight);
		this.parameters = parameters

		this.healthPoints = this.parameters.player.health * 100;
		this.bulletPoints = this.parameters.player.bullets * 50;
		this.triplePoints = 0;
		this.tripleText;
		if (this.parameters.player.triple)
		{
			this.triplePoints = 200;
			this.tripleText = "Got It!";
		}
		else this.tripleText = "Missed It...";

		this.hoverPoints = 0;
		this.hoverText;
		if (this.parameters.player.hover)
		{
			this.hoverPoints = 200;
			this.hoverText = "Got It!";
		}
		else this.hoverText = "Missed It...";

		this.boostPoints = 0;
		this.boostText;
		if (this.parameters.player.boost)
		{
			this.boostPoints = 200;
			this.boostText = "Got It!";
		}
		else this.boostText = "Missed It...";
		this.totalPoints = this.healthPoints + this.bulletPoints + this.triplePoints + this.hoverPoints + this.boostPoints;

		this.previousTopScores = [];
		this.writeScoreToLocalStorage(this.totalPoints);
	}

	render()
	{
		this.uiBox.render();

		context.fillStyle = 'black';
		context.font = '56px Joystix';
		context.fillText(`Brilliant Victory!!!`, 350, 75);

		context.font = '20px Joystix';

		context.fillText(`Health remaining: ` + this.parameters.player.health, 270, 125);
		context.fillText(`100pts each = `, 670, 125);
		context.fillText(this.healthPoints + "pts", 910, 125);

		context.fillText(`Collected Bullets: ` + this.parameters.player.bullets, 270, 175);
		context.fillText(`50pts each = `, 670, 175);
		context.fillText(this.bulletPoints + "pts", 910, 175);
		
		context.fillText(`Triple Jump Bonus: ` + this.tripleText, 270, 225);
		context.fillText(`200 pts worth = `, 670, 225);
		context.fillText(this.triplePoints + "pts", 910, 225);

		context.fillText(`Jet Hover Bonus: ` + this.hoverText, 270, 275);
		context.fillText(`200 pts worth = `, 670, 275);
		context.fillText(this.hoverPoints + "pts", 910, 275);

		context.fillText(`Hyper Boost Bonus: ` + this.boostText, 270, 325);
		context.fillText(`200 pts`, 670, 325);
		context.fillText(this.boostPoints + "pts", 910, 325);

		context.fillText("Previous:", 270, 375);
		if (this.previousTopScores[2] != null)
			context.fillText("3rd: " + this.previousTopScores[2] + "pts", 270, 405);
		if (this.previousTopScores[1] != null)
			context.fillText("2nd: " + this.previousTopScores[1] + "pts", 570, 405);
		if (this.previousTopScores[0] != null)
			context.fillText("1st: " + this.previousTopScores[0] + "pts", 870, 405);
		
		context.font = '56px Joystix';
		context.fillText(`Total Score`, 270, 475);
		context.fillText(this.totalPoints + "pts", 750, 475);

		context.font = '36px Joystix';
		context.fillText(`Press enter to play again`, 345, 535);
	}

	

	writeScoreToLocalStorage(score)
	{		
		let scoreDataString = window.localStorage.getItem('scores');
		let scoreData = []
		let scoreString = "" + score;

		if (scoreDataString != null && scoreDataString != undefined)
			scoreData = scoreData.concat(scoreDataString.split(","));
		
		for (let i = 0; i < scoreData.length; i++)
			this.previousTopScores.push(scoreData[i]);

		scoreData.push(scoreString);

		scoreData = this.sortScores(scoreData);

		if (scoreData.length > 3)
			scoreData.length = 3;

		window.localStorage.setItem('scores', scoreData.toString());
	}

	sortScores(scores)
	{
		let highestIndex = 0;
		let newArray = []
		while (scores.length > 0)
		{
			for (let j = 1; j < scores.length; j++)
			{
				if (parseInt(scores[j]) > parseInt(scores[highestIndex]))
				{
					highestIndex = j;
				}
			}
			newArray.push(scores[highestIndex]);
			scores.splice(highestIndex, 1);
			highestIndex = 0;
		}
		return newArray;
	}

	update() { if (keys['Enter']) this.loadNewGame(); }

	loadNewGame()
	{
		let level = LevelMaker.makeLevel();

		let player = new Player
		(
			new Vector(Player.WIDTH, Player.HEIGHT),
			level.tilemap.playerSpawn,
			level
		);
		
		stateMachine.change(GameStateName.Transition,
		{
			fromState: this,
			toState: stateMachine.states[GameStateName.Play],
            fade: 'white',
			toStateEnterParameters: 
			{
				level: level,
				player: player,
				camera: new Camera(player, new Vector(CANVAS_WIDTH, CANVAS_HEIGHT))
			}
		});
	}
}