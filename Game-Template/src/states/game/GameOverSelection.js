import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Player from "../../entities/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import { context, keys, stateMachine, CANVAS_WIDTH, CANVAS_HEIGHT, images, sounds } from "../../globals.js";
import LevelMaker from "../../services/LevelMaker.js";
import Camera from "../../../lib/Camera.js";
import ImageName from "../../enums/ImageName.js";
import SoundName from "../../enums/SoundName.js";

export default class GameOverSelectionState extends State
{
	constructor()
	{
		super();
		this.menuOptions =
		{
			continue: 'Continue',
			quit: 'Quit',
		};

        this.choice = 'none';

		this.highlighted = this.menuOptions.start;
        this.enter();
	}

    enter()
    {
        this.choice = 'none';
    }

	update(dt)
	{
        if (keys.Enter)
        {
            sounds.play(SoundName.Select)
            switch (this.highlighted)
            {
                case this.menuOptions.continue:
                    this.choice = 'continue';
                    this.loadNewGame();
                    break;
                case this.menuOptions.quit:
                    this.choice = 'quit';
                    window.close();
            }
        }

        if (keys.w || keys.s)
		{
			keys.w = false;
			keys.s = false;
			this.highlighted = this.highlighted === this.menuOptions.continue ? this.menuOptions.quit : this.menuOptions.continue;
		}
	}

	loadNewGame()
	{
		let level = LevelMaker.makeLevel();

		let player = new Player
		(
			new Vector(Player.WIDTH, Player.HEIGHT),
			level.tilemap.playerSpawn,
			level
		);
		
		let camera = new Camera(player, new Vector(CANVAS_WIDTH, CANVAS_HEIGHT));
		stateMachine.change(GameStateName.Transition,
		{
			fromState: this,
			toState: stateMachine.states[GameStateName.Play],
            fade: 'white',
			toStateEnterParameters: 
			{
				level: level,
				player: player,
				camera: camera
			}
		});
	}

	render()
	{
        context.save();
        context.fillStyle = 'black'
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        switch (this.choice)
        {
            case 'none':
                images.render(ImageName.Dead, CANVAS_WIDTH / 2 - 120, CANVAS_HEIGHT / 2 - 120);
                break;
            case 'continue':
                images.render(ImageName.Continue, CANVAS_WIDTH / 2 - 120, CANVAS_HEIGHT / 2 - 120);
                break;
            case 'quit':
                images.render(ImageName.Quit, CANVAS_WIDTH / 2 - 120, CANVAS_HEIGHT / 2 - 120);
                break;
        }
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.font = "40px Joystix";
        context.fillStyle = this.highlighted === this.menuOptions.continue ? "red" : "darkRed";
		context.fillText(`${this.menuOptions.continue}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.8);
		context.fillStyle = this.highlighted === this.menuOptions.quit ? "red" : "darkRed";
		context.fillText(`${this.menuOptions.quit}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.9);
		context.restore();
	}
}