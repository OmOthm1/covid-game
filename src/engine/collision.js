import { Collider } from "../enums/enums.js";

/**
 * Takes circle and rectangle objects and checks if they are colliding.
 * @param {object} circleObj The circle object.
 * @param {object} rectObj The rectangle object.
 * @return {number} (0) NO colliding, (1) TOP_BOTTOM colliding, (2) SIDE colliding, (3) CORNER colliding.
 */
export function RectCircleColliding(circleObj, rectObj) {
    let circle = {
        x: circleObj.posX,
        y: circleObj.posY,
        r: circleObj.radius
    };

    let rect = {
        x: rectObj.left,
        y: rectObj.top,
        w: rectObj.width,
        h: rectObj.height
    }

    let distX = Math.abs(circle.x - rect.x - rect.w / 2);
    let distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) { return 0; }
    if (distY > (rect.h / 2 + circle.r)) { return 0; }

    if (distX <= (rect.w / 2)) { return 1; }
    if (distY <= (rect.h / 2)) { return 2; }

    let dx = distX - rect.w / 2;
    let dy = distY - rect.h / 2;

    if (dx * dx + dy * dy <= (circle.r * circle.r)) {
        return 3;
    } else {
        return 0;
    }
}

/**
 * Takes two rectangle objects and checks if they are colliding.
 * @param {object} rectObj1 The first rectangle.
 * @param {object} rectObj2 The second rectangle.
 * @return {boolean} Are they colliding?
 */
export function RectRectColliding(rectObj1, rectObj2) {
    return (
        rectObj1.bottom >= rectObj2.top &&
        rectObj1.right >= rectObj2.left &&
        rectObj1.left <= rectObj2.right &&
        rectObj1.top <= rectObj2.bottom
    );
}

export function circleCircleColliding(circleObj1,circleObj2) {
    return circleObj1.radius + circleObj2.radius > distance(circleObj1.posX, circleObj1.posY, circleObj2.posX, circleObj2.posY);
}

export function distance(x1, y1, x2, y2) {
    let a = x1 - x2;
    let b = y1 - y2;

    return Math.sqrt(a * a + b * b);
}

export default function areColliding(obj1, obj2) {
    if (obj1.constructor.collider === Collider.RECTANGLE && obj2.constructor.collider === Collider.RECTANGLE) {
        return RectRectColliding(obj1, obj2);
    } else if (obj1.constructor.collider === Collider.CIRCLE && obj2.constructor.collider === Collider.CIRCLE) {
        return circleCircleColliding(obj1, obj2);
    } else {
        let circle = obj1.constructor.collider === Collider.CIRCLE ? obj1 : obj2;
        let rect = obj1.constructor.collider === Collider.RECTANGLE ? obj1 : obj2;
        return RectCircleColliding(circle, rect);
    }
}
