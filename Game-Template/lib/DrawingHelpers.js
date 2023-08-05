/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius.
 *
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius.
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
export const roundedRectangle = (context, x, y, width, height, radius = 5, fill = false, stroke = true) =>
{
	context.save();
	context.beginPath();
	context.moveTo(x + radius, y);
	context.lineTo(x + width - radius, y);
	context.quadraticCurveTo(x + width, y, x + width, y + radius);
	context.lineTo(x + width, y + height - radius);
	context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	context.lineTo(x + radius, y + height);
	context.quadraticCurveTo(x, y + height, x, y + height - radius);
	context.lineTo(x, y + radius);
	context.quadraticCurveTo(x, y, x + radius, y);
	context.closePath();

	if (fill) context.fill();

	if (stroke) context.stroke();

	context.restore();
}

export const bottomCurveRectangle = (context, x, y, width, height, radius = 5, fill = false, stroke = true) =>
{
	context.save();
	context.beginPath();
	context.moveTo(x + radius, y);
	context.lineTo(x + width - radius, y);
	context.lineTo(x + width, y, x + width, y + radius);
	context.lineTo(x + width, y + height - radius);
	context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	context.lineTo(x + radius, y + height);
	context.quadraticCurveTo(x, y + height, x, y + height - radius);
	context.lineTo(x, y + radius);
	context.lineTo(x, y, x + radius, y);
	context.closePath();

	if (fill) context.fill();

	if (stroke) context.stroke();

	context.restore();
}

export const topRightCurveRectangle = (context, x, y, width, height, radius = 5, fill = false, stroke = true) =>
{
	context.save();
	context.beginPath();
	context.moveTo(x + radius, y);
	context.lineTo(x + width - radius, y);
	context.quadraticCurveTo(x + width, y, x + width, y + radius);
	context.lineTo(x + width, y + height - radius);
	context.lineTo(x + width, y + height, x + width - radius, y + height);
	context.lineTo(x + radius, y + height);
	context.lineTo(x, y + height, x, y + height - radius);
	context.lineTo(x, y + radius);
	context.lineTo(x, y, x + radius, y);
	context.closePath();

	if (fill) context.fill();

	if (stroke) context.stroke();

	context.restore();
}
export const topLeftCurveRectangle = (context, x, y, width, height, radius = 5, fill = false, stroke = true) =>
{
	context.save();
	context.beginPath();
	context.moveTo(x + radius, y);
	context.lineTo(x + width - radius, y);
	context.lineTo(x + width, y, x + width, y + radius);
	context.lineTo(x + width, y + height - radius);
	context.lineTo(x + width, y + height, x + width - radius, y + height);
	context.lineTo(x + radius, y + height);
	context.lineTo(x, y + height, x, y + height - radius);
	context.lineTo(x, y + radius);
	context.quadraticCurveTo(x, y, x + radius, y);
	context.closePath();

	if (fill) context.fill();

	if (stroke) context.stroke();

	context.restore();
}

export const ellipse = (context, cx, cy, rx, ry, fill = false, stroke = true) =>
{
	context.save(); // save state
	context.beginPath();

	context.translate(cx-rx, cy-ry);
	context.scale(rx, ry);
	context.arc(1, 1, 1, 0, 2 * Math.PI, false);

	context.restore(); // restore to original state

	if (fill) context.fill();

	if (stroke) context.stroke();
}

export const mouse = (context, x, y, color, click) => 
{
	let oldX = x, oldY = y;
	const width = 40;
	const height = 60;
	const radius = 10;
	context.save();
	context.fillStyle = (click == 'left' || click == 'both') ? '#282828' : color;
	topLeftCurveRectangle(context, x, y, width / 2, 25, radius, true)
	context.fillStyle = (click == 'right' || click == 'both') ? '#282828' : color;
	topRightCurveRectangle(context, x + 20, y, width / 2, 25, radius, true)
	context.fillStyle = color;
	bottomCurveRectangle(context, x, y + 25, width, height - 25, radius + 10, true);
	x += 20;
	context.fillStyle = 'green';
	context.beginPath();
	context.moveTo(x, y);

	y += 25;
	context.lineTo(x, y);
	context.stroke();

	x -= 20;
	context.moveTo(x, y);
	context.lineTo(x + 40, y);
	context.stroke();
	
	x = oldX;
	y = oldY;
	context.restore();
}