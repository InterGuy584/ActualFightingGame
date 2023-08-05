import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Player from "../../entities/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import ImageName from "../../enums/ImageName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, sounds, stateMachine } from "../../globals.js";
import LevelMaker from "../../services/LevelMaker.js";
import Camera from "../../../lib/Camera.js"
import SoundName from "../../enums/SoundName.js";

export default class TitleScreenState extends State
{
	constructor()
	{
		super();
		this.enter();
	}

	enter()
	{
		sounds.play(SoundName.Choir);
		this.level = LevelMaker.makeLevel();

		this.player = new Player
		(
			new Vector(Player.WIDTH, Player.HEIGHT),
			this.level.tilemap.playerSpawn,
			this.level
		);
		this.camera = new Camera(this.player, new Vector(CANVAS_WIDTH, CANVAS_HEIGHT));
	}

	update()
	{
		if (keys.Enter)
		{
			sounds.play(SoundName.Select)
			stateMachine.change(GameStateName.Transition,
			{
				fromState: this,
				toState: stateMachine.states[GameStateName.Play],
				fade: 'white',
				toStateEnterParameters: 
				{
					level: this.level,
					player: this.player,
					camera: this.camera
				}
			});
		}
	}

	render()
	{
		this.level.render();
		context.fillStyle = 'blue'
		let w = CANVAS_WIDTH / 2 - 250;
		let h = 220;

		context.globalAlpha = 0.3;
		images.render(ImageName.LogoBig, w, h);
		context.globalAlpha = 1.0;
		images.render(ImageName.LogoBig, w + 10, h + 10);
	}
}