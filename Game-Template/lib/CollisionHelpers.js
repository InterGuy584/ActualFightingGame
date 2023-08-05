/**
 * Axis-Aligned Bounding Box
 *
 * One of the simpler forms of collision detection is between two rectangles that are
 * axis aligned — meaning no rotation. The algorithm works by ensuring there is no gap
 * between any of the 4 sides of the rectangles. Any gap means a collision does not exist.
 *
 * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#axis-aligned_bounding_box
 *
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns Whether the two rectangles defined by the parameters are intersecting.
 */
 export const isAABBCollision = (obj1, obj2) =>
	obj1.x + obj1.width >= obj2.x && 
 	obj1.x <= obj2.x + obj2.width &&
 	obj1.y + obj1.height >= obj2.y &&
 	obj1.y <= obj2.y + obj2.height;
	

/**
* https://gamedev.stackexchange.com/questions/13774/how-do-i-detect-the-direction-of-2d-rectangular-object-collisions
*
* @returns The direction that the first rectangle collided with the second. 0: Up; 1: Down; 2: Left; 3: Right;
*/
export const getCollisionDirection = (obj1, obj2) =>
{
	const entityBottom = obj2.y + obj2.height;
	const thisBottom   = obj1.y + obj1.height;
	const entityRight  = obj2.x + obj2.width;
	const thisRight    = obj1.x + obj1.width;

	const bottomCollision = thisBottom   - obj2.y;
	const topCollision    = entityBottom - obj1.y;
	const leftCollision   = entityRight  - obj1.x;
	const rightCollision  = thisRight    - obj2.x;

	if
	(
		topCollision < bottomCollision &&
		topCollision < leftCollision &&
		topCollision < rightCollision
	)
		return 0;

	if
	(
		bottomCollision < topCollision &&
		bottomCollision < leftCollision &&
		bottomCollision < rightCollision
	)
		return 1;

	if
	(
		leftCollision < rightCollision &&
		leftCollision < topCollision &&
		leftCollision < bottomCollision
	)
		return 2;

	if
	(
		rightCollision < leftCollision &&
		rightCollision < topCollision &&
		rightCollision < bottomCollision
	)
		return 3;
}

export const getObjects = (obj1, obj2) =>
{
 	let newObj1 = 
 	{
		x: obj1.position.x,
		y: obj1.position.y,
		width: obj1.dimensions.x,
		height: obj1.dimensions.y
 	}
 	let newObj2 =
 	{
		x: obj2.position.x,
		y: obj2.position.y,
		width: obj2.dimensions.x,
		height: obj2.dimensions.y
 	}
 	return { obj1: newObj1, obj2: newObj2 }
}