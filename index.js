const canvas = document.getElementById('canvas');

const width = 300;
const height = 500;
canvas.setAttribute('width', width);
canvas.setAttribute('height', height);
const ctx = canvas.getContext('2d');

const memory = ctx.getImageData(0, 0, width, height);

function drawPoint(memory, x, y, color) {
    const pitch = 4;
    memory.data.set(color, (x + y * memory.width) * pitch);
}

function circleInitialPoint(memory, {x: cx, y: cy}, r, color) {
    drawPoint(memory, cx, cy + r, color);
    drawPoint(memory, cx, cy - r, color);
    drawPoint(memory, cx - r, cy, color);
    drawPoint(memory, cx + r, cy, color);
}

function circlePoint4(memory, {x: cx, y: cy}, {x, y}, color) {
    drawPoint(memory, cx + x, cy + y, color);
    drawPoint(memory, cx + x, cy - y, color);
    drawPoint(memory, cx - x, cy + y, color);
    drawPoint(memory, cx - x, cy - y, color);
}


function circlePoint8(memory, center, {x, y}, color) {
    circlePoint4(memory, center, {x, y}, color);
    circlePoint4(memory, center, {x: y, y: x}, color);
}

function circle(memory, center, r, color) {

    /*
        f(x, y) = (x - cx)^2 + (y - cy)^2 - r ^ 2
     */
    
   
    let x = 0,
        y = r;
        r2 = r * r;
    let f = 1 - r;

    circleInitialPoint(memory, center, r, color);
    while (x < y) {
        if (f > 0) {
            y--;
            f += 2 * (x - y) + 5;
        } else {
            f += 2 * x + 3;
        }
        x++;
        circlePoint8(memory, center, {x, y}, color);
    }
    circlePoint4(memory, center, {x, y}, color)
}



const RED_COLOR = [255, 0, 0, 255];

circle(memory, {x: width / 2, y: height / 2}, 40, RED_COLOR)

ctx.putImageData(memory, 0, 0);

