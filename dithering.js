const canvas = document.getElementById('canvas');
let ctx,
    memory,
    width,
    heigth;
canvas.addEventListener('dragover', e => e.preventDefault());
canvas.addEventListener('drop', e => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];

        const img = new Image();
        img.onload = () => {
            width = img.width;
            height = img.height;
            canvas.setAttribute('width', img.width);
            canvas.setAttribute('height', img.height);
            ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            memory = ctx.getImageData(0, 0, width, height)
            URL.revokeObjectURL(this.src);
        }
        img.src = URL.createObjectURL(file);
    }
    
});


function grayScale(memory) {
    for (let i = 0; i < memory.data.length; i+=4) {
        const [r, g, b] = memory.data.slice(i, i + 3);
        const v = (0.30 * r + 0.59 * g + 0.11 *b) | 0;
        memory.data.set([v, v, v], i);
    }
}

const M = [
    [64, 128],
    [192, 0]
];

const BLACK_COLOR = [0, 0, 0, 255];
const WHITE_COLOR = [255, 255, 255, 255];

function dither(memory) {
    // console.log({width: memory.width})
    for (let i = 0; i < memory.data.length / 4; i++) {
        const x = i % 2;
        const y = ((i / memory.width) | 0) % 2;
        // console.log({i, x, y});
        const grayValue = memory.data[i * 4]
        if (grayValue > M[y][x]) {
            memory.data.set(WHITE_COLOR, i * 4);
        } else {
            memory.data.set(BLACK_COLOR, i * 4);
        }
    }
}


document.getElementById('grayscale-btn').addEventListener('click', () => {
    grayScale(memory);
    ctx.putImageData(memory, 0, 0)
});

document.getElementById('dither-btn').addEventListener('click', () => {
    dither(memory);
    ctx.putImageData(memory, 0, 0)
});