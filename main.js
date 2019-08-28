let width = window.innerWidth;
let height = window.innerHeight;
let tween;
let stage, layer, dragLayer, targets, connectors;
let quadLine, bezierLine;
let curveLayer, lineLayer, anchorLayer, quad, bezier;
let GUIDELINE_OFFSET = 10;
let lastDist, startScale, activeShape, triangle, circle;
let textNode, tr;
let tooltipLayer, tooltip, data, colors, nodeCount, startLayer;
let createStatus = false;
let snapping = null;

function resizeStagePalate() {
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
    stage.draw();
}

function menuItemClicked(src, index) {
    window.removeEventListener('resize', resizeStagePalate);
    const lastScript = document.getElementById('script-artist');
    if (lastScript) lastScript.remove();
    let starsScript = document.createElement('script');
    starsScript.src = src;
    starsScript.id = 'script-artist';
    starsScript.onload = function () {
        resizeStagePalate();
        window.addEventListener('resize', resizeStagePalate);
    };
    document.head.appendChild(starsScript);
}

menuItemClicked('./scripts/snapping.js', 1);

// document.getElementById("menu-1").addEventListener('click', function (e) {
//     menuItemClicked('./scripts/stars.js', 0);
// });

document.getElementById("menu-2").addEventListener('click', function (e) {
    menuItemClicked('./scripts/snapping.js', 1);
});

document.getElementById("menu-3").addEventListener('click', function (e) {
    menuItemClicked('./scripts/connected.js', 2);
});

document.getElementById("menu-4").addEventListener('click', function (e) {
    menuItemClicked('./scripts/curves-anchor.js', 3);
});

document.getElementById("menu-5").addEventListener('click', function (e) {
    menuItemClicked('./scripts/collision-detection.js', 4);
});

document.getElementById("menu-6").addEventListener('click', function (e) {
    menuItemClicked('./scripts/multi-touch-scale.js', 5);
});

document.getElementById("menu-7").addEventListener('click', function (e) {
    menuItemClicked('./scripts/text.js', 6);
});

document.getElementById("menu-8").addEventListener('click', function (e) {
    menuItemClicked('./scripts/20000nodes.js', 7);
});