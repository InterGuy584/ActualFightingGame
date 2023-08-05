import Fonts from "../lib/Fonts.js";
import Images from "../lib/Images.js";
import Sounds from "../lib/Sounds.js";
import StateMachine from "../lib/StateMachine.js";
import Timer from "../lib/Timer.js";

export const canvas = document.querySelector('canvas');
export const context = canvas.getContext('2d');

export const CANVAS_WIDTH = canvas.width;
export const CANVAS_HEIGHT = canvas.height;

export const keys = {};
export const mouseCoor =
{
    x: 0,
    y: 0
}

canvas.addEventListener("mousemove", event =>
{
    const rect = canvas.getBoundingClientRect();
	mouseCoor.x = Math.round(((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width);
	mouseCoor.y = Math.round(((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height);
});

export const images = new Images(context);
export const fonts = new Fonts();
export const stateMachine = new StateMachine();
export const timer = new Timer();
export const sounds = new Sounds();

export const cX = Math.floor(canvas.width / 2);
export const cY = Math.floor(canvas.height / 2);

export const DEBUG = false;