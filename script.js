/* =========================================================
   ENGINEERING CANVAS
========================================================= */

const canvas = document.getElementById("engineeringCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

let mouseX = 0;
let mouseY = 0;

let targetMouseX = 0;
let targetMouseY = 0;

let nodes = [];
let particles = [];
let chips = [];
let signals = [];
let binaryBits = [];


/* =========================================================
   CANVAS SETUP
========================================================= */

function resizeCanvas() {

    width = window.innerWidth;
    height = window.innerHeight;

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createScene();
}


/* =========================================================
   RANDOM HELPERS
========================================================= */

function random(min, max) {
    return Math.random() * (max - min) + min;
}


function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
}


/* =========================================================
   CREATE SCENE
========================================================= */

function createScene() {

    nodes = [];
    particles = [];
    chips = [];
    signals = [];
    binaryBits = [];


    /* PCB NODES */

    const nodeCount = Math.min(
        100,
        Math.floor((width * height) / 16000)
    );

    for (let i = 0; i < nodeCount; i++) {

        nodes.push({
            x: random(0, width),
            y: random(0, height),

            radius: random(1, 2.5),

            pulse: random(0, Math.PI * 2),

            speed: random(0.01, 0.025)
        });

    }


    /* FLOATING PARTICLES */

    const particleCount = Math.min(
        55,
        Math.floor((width * height) / 30000)
    );

    for (let i = 0; i < particleCount; i++) {

        particles.push({

            x: random(0, width),
            y: random(0, height),

            vx: random(-0.12, 0.12),
            vy: random(-0.08, 0.08),

            size: random(0.5, 1.5),

            alpha: random(0.15, 0.6)

        });

    }


    /* CHIP OUTLINES */

    const chipCount = Math.min(
        14,
        Math.floor(width / 100)
    );

    for (let i = 0; i < chipCount; i++) {

        chips.push({

            x: random(0, width),
            y: random(100, height),

            w: random(35, 80),
            h: random(20, 50),

            rotation: random(0, Math.PI * 2)

        });

    }


    /* MOVING SIGNALS */

    const signalCount = Math.min(
        18,
        Math.floor(width / 80)
    );

    for (let i = 0; i < signalCount; i++) {

        signals.push({

            x: random(0, width),
            y: random(0, height),

            speed: random(0.3, 1.2),

            length: random(15, 45),

            direction: Math.random() > 0.5 ? 1 : 0

        });

    }


    /* BINARY */

    for (let i = 0; i < 25; i++) {

        binaryBits.push({

            x: random(0, width),

            y: random(0, height),

            value: Math.random() > 0.5 ? "1" : "0",

            speed: random(0.05, 0.2),

            alpha: random(0.04, 0.12)

        });

    }

}


/* =========================================================
   GRID
========================================================= */

function drawGrid() {

    const gridSize = 45;

    ctx.save();

    ctx.translate(
        (mouseX - width / 2) * 0.01,
        (mouseY - height / 2) * 0.01
    );

    ctx.strokeStyle = "rgba(80,190,220,0.055)";
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += gridSize) {

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

    }


    for (let y = 0; y < height; y += gridSize) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

    }

    ctx.restore();

}


/* =========================================================
   PCB NODES
========================================================= */

function drawNodes(time) {

    ctx.save();

    const offsetX = (mouseX - width / 2) * 0.015;
    const offsetY = (mouseY - height / 2) * 0.015;

    for (const node of nodes) {

        node.pulse += node.speed;

        const glow =
            0.35 +
            Math.sin(node.pulse) * 0.25;

        ctx.beginPath();

        ctx.arc(
            node.x + offsetX,
            node.y + offsetY,
            node.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(99,230,255,${glow})`;

        ctx.fill();


        if (node.radius > 1.5) {

            ctx.beginPath();

            ctx.arc(
                node.x + offsetX,
                node.y + offsetY,
                node.radius * 4,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(99,230,255,${glow * 0.04})`;

            ctx.fill();

        }

    }

    ctx.restore();

}


/* =========================================================
   CHIP OUTLINES
========================================================= */

function drawChips() {

    ctx.save();

    const offsetX = (mouseX - width / 2) * 0.008;
    const offsetY = (mouseY - height / 2) * 0.008;

    for (const chip of chips) {

        ctx.save();

        ctx.translate(
            chip.x + offsetX,
            chip.y + offsetY
        );

        ctx.rotate(chip.rotation);

        ctx.strokeStyle =
            "rgba(99,230,255,0.09)";

        ctx.lineWidth = 1;

        ctx.strokeRect(
            -chip.w / 2,
            -chip.h / 2,
            chip.w,
            chip.h
        );


        /* CHIP PINS */

        const pinCount = Math.max(
            3,
            Math.floor(chip.w / 12)
        );


        for (let i = 0; i < pinCount; i++) {

            const px =
                -chip.w / 2 +
                ((i + 0.5) / pinCount) * chip.w;


            ctx.beginPath();

            ctx.moveTo(
                px,
                -chip.h / 2
            );

            ctx.lineTo(
                px,
                -chip.h / 2 - 5
            );

            ctx.stroke();


            ctx.beginPath();

            ctx.moveTo(
                px,
                chip.h / 2
            );

            ctx.lineTo(
                px,
                chip.h / 2 + 5
            );

            ctx.stroke();

        }

        ctx.restore();

    }

    ctx.restore();

}


/* =========================================================
   SIGNALS
========================================================= */

function drawSignals() {

    ctx.save();

    for (const signal of signals) {

        if (signal.direction === 1) {

            signal.x += signal.speed;

            if (signal.x > width + 60) {
                signal.x = -60;
            }

            ctx.beginPath();

            ctx.moveTo(
                signal.x,
                signal.y
            );

            ctx.lineTo(
                signal.x - signal.length,
                signal.y
            );

        } else {

            signal.y += signal.speed;

            if (signal.y > height + 60) {
                signal.y = -60;
            }

            ctx.beginPath();

            ctx.moveTo(
                signal.x,
                signal.y
            );

            ctx.lineTo(
                signal.x,
                signal.y - signal.length
            );

        }

        ctx.strokeStyle =
            "rgba(99,230,255,0.22)";

        ctx.lineWidth = 1;

        ctx.stroke();

    }

    ctx.restore();

}


/* =========================================================
   BINARY
========================================================= */

function drawBinary() {

    ctx.save();

    ctx.font = '9px "DM Mono", monospace';

    for (const bit of binaryBits) {

        bit.y += bit.speed;

        if (bit.y > height + 20) {
            bit.y = -20;
        }

        if (Math.random() < 0.005) {

            bit.value =
                bit.value === "1"
                    ? "0"
                    : "1";

        }

        ctx.fillStyle =
            `rgba(99,230,255,${bit.alpha})`;

        ctx.fillText(
            bit.value,
            bit.x,
            bit.y
        );

    }

    ctx.restore();

}


/* =========================================================
   OSCILLOSCOPE
========================================================= */

function drawOscilloscope(time) {

    const baseY =
        height * 0.82;

    const amplitude = 12;

    ctx.save();

    ctx.beginPath();

    for (let x = 0; x <= width; x += 4) {

        const y =
            baseY +
            Math.sin(
                x * 0.018 +
                time * 0.002
            ) *
            amplitude *
            0.45 +

            Math.sin(
                x * 0.047 +
                time * 0.003
            ) *
            amplitude *
            0.25;

        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

    }

    ctx.strokeStyle =
        "rgba(99,230,255,0.10)";

    ctx.lineWidth = 1;

    ctx.stroke();

    ctx.restore();

}


/* =========================================================
   PARTICLES
========================================================= */

function drawParticles() {

    ctx.save();

    for (const particle of particles) {

        particle.x += particle.vx;
        particle.y += particle.vy;


        if (particle.x < -10) {
            particle.x = width + 10;
        }

        if (particle.x > width + 10) {
            particle.x = -10;
        }

        if (particle.y < -10) {
            particle.y = height + 10;
        }

        if (particle.y > height + 10) {
            particle.y = -10;
        }


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(99,230,255,${particle.alpha})`;

        ctx.fill();

    }

    ctx.restore();

}


/* =========================================================
   BACKGROUND GLOW
========================================================= */

function drawGlow() {

    const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.65
    );


    gradient.addColorStop(
        0,
        "rgba(30,150,180,0.045)"
    );


    gradient.addColorStop(
        0.45,
        "rgba(20,100,130,0.018)"
    );


    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

}


/* =========================================================
   MOUSE PARALLAX
========================================================= */

window.addEventListener(
    "mousemove",
    (event) => {

        targetMouseX = event.clientX;
        targetMouseY = event.clientY;

    }
);


window.addEventListener(
    "touchmove",
    (event) => {

        if (!event.touches.length) return;

        targetMouseX =
            event.touches[0].clientX;

        targetMouseY =
            event.touches[0].clientY;

    },
    { passive: true }
);


/* =========================================================
   ANIMATION
========================================================= */

function animate(time) {

    mouseX +=
        (targetMouseX - mouseX) * 0.04;

    mouseY +=
        (targetMouseY - mouseY) * 0.04;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    drawGlow();

    drawGrid();

    drawNodes(time);

    drawChips();

    drawSignals();

    drawBinary();

    drawParticles();

    drawOscilloscope(time);


    requestAnimationFrame(animate);

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================================
   START
========================================================= */

resizeCanvas();

targetMouseX = width / 2;
targetMouseY = height / 2;

mouseX = targetMouseX;
mouseY = targetMouseY;

requestAnimationFrame(animate);
