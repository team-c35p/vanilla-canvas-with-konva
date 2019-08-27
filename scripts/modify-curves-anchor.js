function updateDottedLines() {
    let q = quad;
    let b = bezier;

    let quadLine = lineLayer.findOne('#quadLine');
    let bezierLine = lineLayer.findOne('#bezierLine');

    quadLine.points([
        q.start.attrs.x,
        q.start.attrs.y,
        q.control.attrs.x,
        q.control.attrs.y,
        q.end.attrs.x,
        q.end.attrs.y
    ]);

    bezierLine.points([
        b.start.attrs.x,
        b.start.attrs.y,
        b.control1.attrs.x,
        b.control1.attrs.y,
        b.control2.attrs.x,
        b.control2.attrs.y,
        b.end.attrs.x,
        b.end.attrs.y
    ]);
    lineLayer.draw();
}
function buildAnchor(x, y) {
    let anchor = new Konva.Circle({
        x: x,
        y: y,
        radius: 20,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        draggable: true
    });

    // add hover styling
    anchor.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
        this.strokeWidth(4);
        anchorLayer.draw();
    });
    anchor.on('mouseout', function() {
        document.body.style.cursor = 'default';
        this.strokeWidth(2);
        anchorLayer.draw();
    });

    anchor.on('dragend', function() {
        drawCurves();
        updateDottedLines();
    });

    anchorLayer.add(anchor);
    return anchor;
}
function drawCurves() {
    let context = curveLayer.getContext();

    context.clear();

    // draw quad
    context.beginPath();
    context.moveTo(quad.start.attrs.x, quad.start.attrs.y);
    context.quadraticCurveTo(
        quad.control.attrs.x,
        quad.control.attrs.y,
        quad.end.attrs.x,
        quad.end.attrs.y
    );
    context.setAttr('strokeStyle', 'red');
    context.setAttr('lineWidth', 4);
    context.stroke();

    // draw bezier
    context.beginPath();
    context.moveTo(bezier.start.attrs.x, bezier.start.attrs.y);
    context.bezierCurveTo(
        bezier.control1.attrs.x,
        bezier.control1.attrs.y,
        bezier.control2.attrs.x,
        bezier.control2.attrs.y,
        bezier.end.attrs.x,
        bezier.end.attrs.y
    );
    context.setAttr('strokeStyle', 'blue');
    context.setAttr('lineWidth', 4);
    context.stroke();
}

stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

anchorLayer = new Konva.Layer();
lineLayer = new Konva.Layer();

// curveLayer just contains a canvas which is drawn
// onto with the existing canvas API
curveLayer = new Konva.Layer();

quadLine = new Konva.Line({
    dash: [10, 10, 0, 10],
    strokeWidth: 3,
    stroke: 'black',
    lineCap: 'round',
    id: 'quadLine',
    opacity: 0.3,
    points: [0, 0]
});

bezierLine = new Konva.Line({
    dash: [10, 10, 0, 10],
    strokeWidth: 3,
    stroke: 'black',
    lineCap: 'round',
    id: 'bezierLine',
    opacity: 0.3,
    points: [0, 0]
});

// add dotted line connectors
lineLayer.add(quadLine);
lineLayer.add(bezierLine);

quad = {
    start: buildAnchor(160, 130),
    control: buildAnchor(340, 210),
    end: buildAnchor(180, 260)
};

bezier = {
    start: buildAnchor(380, 120),
    control1: buildAnchor(630, 140),
    control2: buildAnchor(580, 250),
    end: buildAnchor(400, 250)
};

// keep curves insync with the lines
anchorLayer.on('beforeDraw', function() {
    drawCurves();
    updateDottedLines();
});

stage.add(curveLayer);
stage.add(lineLayer);
stage.add(anchorLayer);

drawCurves();
updateDottedLines();