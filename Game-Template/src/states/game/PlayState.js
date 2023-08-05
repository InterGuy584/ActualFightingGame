import State from "../../../lib/State.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, stateMachine, keys, images, timer, sounds } from "../../globals.js";
import { mouse, roundedRectangle } from "../../../lib/DrawingHelpers.js"
import Door from "../../objects/Door.js"
import GameStateName from "../../enums/GameStateName.js"
import ImageName from "../../enums/ImageName.js";
import JumpState from "../../enums/JumpState.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import SoundName from "../../enums/SoundName.js";
import { getRandomPositiveInteger } from "../../../lib/RandomNumberHelpers.js";

export default class PlayState extends State
{
	constructor() { super(); }

	/**
	 * 
	 * @param {Object} parameters 
	 */
	enter(parameters)
	{
		sounds.play(SoundName.Choir);
		this.level = parameters.level;
		this.player = parameters.player;
		this.camera = parameters.camera;
		this.camera.getNewPosition();
		this.chance = 'ready';
		//this.level.addCamera(this.camera);
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

	exit()
	{
        window.removeEventListener('blur', () => 
        {
			if (stateMachine.currentState.name == GameStateName.Play)
			{
				stateMachine.change(GameStateName.Pause,
				{
					level: this.level,
					player: this.player,
					camera: this.camera
				});
			}
        });
	}

	async update(dt)
	{
		if (this.chance == 'ready')
		{
			this.chance = 'waiting';
			timer.wait(15, () => 
			{
				this.chance = 'play'
				//if (oneInXChance(5))
			})
		}
		
		if (this.chance == 'play')
		{
			this.chance = 'ready';
			switch (getRandomPositiveInteger(1, 5))
			{
				case 1:
					sounds.play(SoundName.Mystery);
					break;
				case 2:
					sounds.play(SoundName.Violin);
					break;
				case 3:
					sounds.play(SoundName.Birds);
					break;
				case 4:
					sounds.play(SoundName.ElectricPiano);
					break;
				case 5:
					sounds.play(SoundName.Piano);
			}
		}
		this.player.update(dt);

		// keep the player from wandering offscreen
		if (this.player.position.x < 0)
			this.player.position.x = 0;
		if (this.player.position.y < 0)
			this.player.position.y = 0;
		if (this.player.position.x > this.level.dimensions.x - this.player.dimensions.x)
			this.player.position.x = this.level.dimensions.x - this.player.dimensions.x

		// this is when the player falls in a pit. Replace with death later. For now, it goes back to the top of the level.
		if (this.player.position.y > this.level.dimensions.y)
		{
			sounds.stop(SoundName.Choir);
			stateMachine.change(GameStateName.Transition,
			{
				fromState: this,
				toState: stateMachine.states[GameStateName.GameOver],
				fade: 'black',
				toStateEnterParameters: 
				{
					level: this.level,
					player: this.player,
					camera: this.camera
				}
			});
			this.player.position.y = 0
		}

		if (keys.p)
		{
			keys.p = false;
			stateMachine.change(GameStateName.Pause,
			{
				level: this.level,
				player: this.player,
				camera: this.camera
			});
		}

        window.addEventListener('blur', () => 
        {
			if (stateMachine.currentState.name == GameStateName.Play)
			{
				stateMachine.change(GameStateName.Pause,
				{
					level: this.level,
					player: this.player,
					camera: this.camera
				});
			}
        });
		

		this.level.objects.forEach(object =>
		{
			// see if the player collided with any objects
			if (object.didCollideWithEntity(this.player.hitbox, this.player))
				object.onCollision(this.player);

			// see if the level has been completed (exit has been reached)
			if (object instanceof Door && object.playerReached)
				this.processVictory();
		});

		this.level.tilemap.tiles.forEach(tile =>
		{
			if (tile.didCollideWithEntity(this.player.hitbox) && this.player.stateMachine.currentState.name != 'hurting')
				this.player.stateMachine.change(PlayerStateName.Hurting, this);
		})

		this.level.objects.filter(object => !object.collected);

		this.level.update(dt);
		this.camera.update();
	}

	processVictory()
	{
		stateMachine.change(GameStateName.Transition,
		{
			fromState: this,
			toState: stateMachine.states[GameStateName.Victory],
			fade: 'white',
			toStateEnterParameters: { player: this.player }
		});
	}

	render()
	{
		this.renderViewport();
		this.renderGameParameters();
	}

	renderViewport()
	{
		context.save();
		this.moveContext();
		this.level.render();
		this.player.render();
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
	}

	renderGameParameters()
	{
		let x = 10;
		let y = 10;

		context.save();
		context.font = '35px Cloudy';
		
		if (!this.player.asleep)
		{
			this.moveControls(x, y, this.player.direction);
			y += 60;
			this.duckControls(x, y);
			y += 60;
		}

		this.tripleControls(x, y, this.player.jumpState);
		
		if (this.player.gun)
		{
			y += 60;
			this.mouseControls(x, y);

			let oldY = y;
			y = 410;
			this.renderGun(x, y)
			y = oldY;
		}
		if (this.player.boost)
		{
			y += 80;
			this.chargeControls(x, y);
		}
		if (this.player.hover)
		{
			y += 60;
			this.floatControls(x, y);
		}

		x = CANVAS_WIDTH - 192;
		y = 10;

		this.renderHearts(x, y);

		context.restore();
	}
	
	renderHearts(x, y)
	{
		let hearts = this.player.health;
		let clip = 64 * 3;

		for (let i = x; i < x + clip; i += 64)
		{
			images.render((hearts > 0) ? ImageName.Heart : ImageName.HeartEmpty, i, y, null, null);
			hearts--;
		}
	}
	
	moveControls(x, y, direction)
	{
		let offset = (keys.a || keys.A) ? 4 : 0;
		this.key(x, y, offset, (keys.a || keys.A));
		y += 30;

		this.keyLetter(x, y, offset, 'A')

		y -= 30;
		x += 50;

		offset = (keys.d || keys.D) ? 4 : 0;
		this.key(x, y, offset, (keys.d || keys.D));
		y += 30;
		this.keyLetter(x, y, offset, 'D')
		x -= 50;
		images.render(direction == 'left' ? ImageName.WalkingLeftUI : ImageName.WalkingRightUI, x + 100, y - 30, null, null, { x: 0.6, y: 0.6 });
	}

	duckControls(x, y)
	{
		let offset = (keys.s || keys.S) ? 4 : 0;
		this.key(x, y, offset, (keys.s || keys.S));

		y += 30;

		this.keyLetter(x, y, offset, 'S')

		images.render(ImageName.DuckingUI, x + 40, y - 40, null, null, { x: 0.6, y: 0.6 });
	}

	chargeControls(x, y)
	{
		let offset = this.player.boostUsed ? 0 : (keys.q || keys.Q) ? 4 : 0;
		this.key(x, y, offset, (keys.q || keys.Q) && this.player.boostUsed);
		roundedRectangle(context, x, y + offset, 40, 40, 5, true);
		y += 30;
		this.keyLetter(x, y, offset, 'Q')
		images.render(ImageName.ChargingUI, x + 40, y - 40, null, null, { x: 0.6, y: 0.6 });
	}

	tripleControls(x, y, text)
	{
		let canJump = (this.player.triple) ? this.player.jumpState != JumpState.TripleJump : this.player.jumpState != JumpState.DoubleJump

		let offset = !canJump ? 0 : keys.Space ? 4 : 0;
		this.key(x, y, offset, (keys.Space && canJump));
		roundedRectangle(context, x, y + offset, 200, 40, 5, true);
		y += 30;

		context.fillStyle = 'black';
		context.textAlign = 'center';
		context.fillText(text, x + 100, y + offset)
		context.textAlign = 'left'

		images.render(ImageName.JumpingUI, x + 210, y - 30, null, null, { x: 0.7, y: 0.7 });
	}

	floatControls(x, y)
	{
		let offset = (keys.f || keys.F) ? 4 : 0;
		this.key(x, y, offset, (keys.f || keys.F));
		y += 30;
		this.keyLetter(x, y, offset, 'F');
		images.render(ImageName.FloatingUI, x + 50, y - 40, null, null, { x: 0.6, y: 0.6 });
	}

	renderGun(x, y)
	{
		let bulletHeight = 20;
		images.render(ImageName.Gun, x, y, null, null);

		y += 70;

		let clip = bulletHeight * 6;
		let bullets = this.player.bullets;

		for (let i = y; i < y + clip; i += bulletHeight)
		{
			images.render((bullets > 0) ? ImageName.Bullet : ImageName.BulletEmpty, x, i, null, null, { x: 0.7, y: 0.7 });
			bullets--;
		}
	}

	key(x, y, offset, condition)
	{
		context.fillStyle = condition ? '#282828' : 'gray';
		roundedRectangle(context, x, y + offset, 40, 40, 5, true);
	}

	keyLetter(x, y, offset, letter)
	{
		context.fillStyle = 'black';
		context.fillText(letter, x + 13, y + offset)
	}

	mouseControls(x, y)
	{
		let click = null;
		if (keys.LeftClick && keys.RightClick) click = 'both';
		else if (keys.LeftClick) click = 'left';
		else if (keys.RightClick) click = 'right';
		mouse(context, x, y, 'gray', click)
		images.render(ImageName.AimingUI, x + 50, y, null, null, { x: 0.6, y: 0.6 })
	}
}