// updates an object to move to a position within a spicific speed
// HINT: use nigative value for speed to move away from the position.
export function moveToward(object, posX, posY, speed) {
    let tx = posX - object.posX;
    let ty = posY - object.posY;
    let dist = Math.sqrt(tx * tx + ty * ty);

    let velX = (tx / dist) * speed;
    let velY = (ty / dist) * speed;

    object.posX += velX;
    object.posY += velY;
}
