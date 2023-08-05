import State from "../../../lib/State.js";
import GameStateName from "../../enums/GameStateName.js";
import { keys, stateMachine, context, CANVAS_HEIGHT, CANVAS_WIDTH } from "../../globals.js";

export default class PauseState extends State
{
    constructor() { super(); this.offscreen = false; }

    enter(parameters)
    {
		this.level = parameters.level;
		this.player = parameters.player;
		this.camera = parameters.camera;
        window.addEventListener('blur', () => this.offscreen = true)
        this.offscreen = false;
    }

    exit()
    {
        this.offscreen = false;
        window.removeEventListener('blur', () => this.offscreen = true)
        window.removeEventListener('focus', () => 
        {
            stateMachine.change(GameStateName.Play,
            {
                level: this.level,
                player: this.player,
                camera: this.camera
            });
        });
    }

    update(dt)
    {
        if (this.offscreen)
        {
            window.addEventListener('focus', () => 
            {
                stateMachine.change(GameStateName.Play,
                {
                    level: this.level,
                    player: this.player,
                    camera: this.camera
                });
            });
        }

        if (keys.p)
        {
            keys.p = false;
            keys.P = false;
            stateMachine.change(GameStateName.Play, 
            {
                level: this.level,
                player: this.player,
                camera: this.camera
            });
        }
    }

    render()
    {
		context.save();

		this.moveContext();

        context.restore();
    }

	moveContext()
	{
		let contextX;
		let contextY;

		contextX =
		(this.camera.position.x < 0) ? 0 : 
		(this.camera.position.x > this.level.dimensions.x - CANVAS_WIDTH) ? this.level.dimensions.x - CANVAS_WIDTH : this.camera.position.x;

		contextY = 
		(this.camera.position.y < 0) ? 0 : 
		(this.camera.position.y > this.level.dimensions.y - CANVAS_HEIGHT) ? this.level.dimensions.y - CANVAS_HEIGHT : this.camera.position.y;

		context.translate(-contextX, -contextY);

		this.level.render();
		this.player.render();

		context.fillStyle = 'black';
        context.font = "50px Joystix";
        context.fillText(`Game Paused`, contextX + 450, contextY + 150)
	}
}