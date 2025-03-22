const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let startPoints = [];
let extensions = [];
const maxObjects = 300; // 生成制限
const minObjects = 10;  // 常に維持する最低限の外延

canvas.addEventListener("click", (event) => {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    addStartPoint(x, y);
});

function addStartPoint(x, y) {
    if (startPoints.length > maxObjects) return;
    startPoints.push({ x, y });
    extensions.push({ x, y, radius: 1, growthRate: Math.random() * 2 + 0.5, decay: false });
}

function update() {
    for (let ext of extensions) {
        if (!ext.decay) {
            ext.radius += ext.growthRate;

            if (ext.radius > 80 && Math.random() > 0.3) {
                ext.decay = true;
            }

            // 新たな開始点の発生確率を増やす
            if (ext.radius > 40 && Math.random() < 0.04) {
                let newX = ext.x + (Math.random() * 60 - 30);
                let newY = ext.y + (Math.random() * 60 - 30);
                addStartPoint(newX, newY);
            }
        } else {
            ext.radius -= 0.5;

            if (ext.radius <= 0) {
                extensions.splice(extensions.indexOf(ext), 1);
            }
        }
    }

    // 自己組織的な持続: もしオブジェクトが減りすぎたら補充
    while (extensions.length < minObjects) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        addStartPoint(x, y);
    }

    if (startPoints.length > maxObjects) startPoints.shift();
    if (extensions.length > maxObjects) extensions.shift();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let ext of extensions) {
        ctx.beginPath();
        ctx.arc(ext.x, ext.y, ext.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ext.decay ? "gray" : "black";
        ctx.stroke();
    }

    for (let sp of startPoints) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
