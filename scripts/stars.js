tween = null;

function addStar(layer, stage) {
    let scale = Math.random();

    let star = new Konva.Star({
        x: Math.random() * stage.width(),
        y: Math.random() * stage.height(),
        numPoints: 5,
        innerRadius: 30,
        outerRadius: 50,
        fill: '#89b712',
        opacity: 0.8,
        draggable: true,
        scale: {
            x: scale,
            y: scale
        },
        rotation: Math.random() * 180,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: {
            x: 5,
            y: 5
        },
        shadowOpacity: 0.6,
        startScale: scale
    });

    layer.add(star);
}
stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
    draggable: true
});

layer = new Konva.Layer();
dragLayer = new Konva.Layer();

for (let n = 0; n < 10; n++) {
    addStar(layer, stage);
}

stage.add(layer);
stage.add(dragLayer);

// bind stage handlers
stage.on('mousedown', function(evt) {
    let shape = evt.target;
    shape.moveTo(dragLayer);
    stage.draw();
    // restart drag and drop in the new layer
    shape.startDrag();
});

stage.on('mouseup', function(evt) {
    let shape = evt.target;
    shape.moveTo(layer);
    stage.draw();
});

stage.on('dragstart', function(evt) {
    let shape = evt.target;
    if (tween) {
        tween.pause();
    }
    shape.setAttrs({
        shadowOffset: {
            x: 15,
            y: 15
        },
        scale: {
            x: shape.getAttr('startScale') * 1.2,
            y: shape.getAttr('startScale') * 1.2
        }
    });
});

stage.on('dragend', function(evt) {
    let shape = evt.target;

    tween = new Konva.Tween({
        node: shape,
        duration: 0.5,
        easing: Konva.Easings.ElasticEaseOut,
        scaleX: shape.getAttr('startScale'),
        scaleY: shape.getAttr('startScale'),
        shadowOffsetX: 5,
        shadowOffsetY: 5
    });

    tween.play();
});