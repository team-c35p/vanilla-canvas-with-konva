function addNode(obj, layer) {
    let node = new Konva.Circle({
        x: obj.x,
        y: obj.y,
        radius: 8,
        fill: obj.color,
        id: obj.id
    });

    layer.add(node);
}
stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

tooltipLayer = new Konva.Layer();
dragLayer = new Konva.Layer();

tooltip = new Konva.Label({
    opacity: 0.75,
    visible: false,
    listening: false
});

tooltip.add(
    new Konva.Tag({
        fill: 'black',
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: 10,
        shadowOpacity: 0.2
    })
);

tooltip.add(
    new Konva.Text({
        text: '',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white'
    })
);

tooltipLayer.add(tooltip);

// build data
data = [];
colors = ['lightcoral', '#b98eff', 'palevioletred', '#ffb680', '#a1ccff', '#9fcd00'];
for (let n = 0; n < 15000; n++) {
    let x = Math.random() * width;
    let y = Math.random() * 300 + height/2 - 150;
    data.push({
        x: x,
        y: y,
        id: n,
        color: colors[Math.round(Math.random() * 5)]
    });
}

// render data
nodeCount = 0;
layer = new Konva.Layer();
for (let n = 0; n < data.length; n++) {
    addNode(data[n], layer);
    nodeCount++;
    if (nodeCount >= 1000) {
        nodeCount = 0;
        stage.add(layer);
        layer = new Konva.Layer();
    }
}

stage.add(dragLayer);
stage.add(tooltipLayer);

stage.on('mouseover mousemove dragmove', function(evt) {
    let node = evt.target;
    if (node && node.parent) {
        // update tooltip
        let mousePos = node.getStage().getPointerPosition();
        tooltip.position({
            x: mousePos.x,
            y: mousePos.y - 5
        });
        tooltip
            .getText()
            .text('node: ' + node.id() + ', color: ' + node.fill());
        tooltip.show();
        tooltipLayer.batchDraw();
    }
});

stage.on('mouseout', function(evt) {
    tooltip.hide();
    tooltipLayer.draw();
});

stage.on('mousedown', function(evt) {
    let shape = evt.target;
    if (shape) {
        startLayer = shape.getLayer();
        shape.moveTo(dragLayer);
        startLayer.draw();
        // manually trigger drag and drop
        shape.startDrag();
    }
});

stage.on('mouseup', function(evt) {
    let shape = evt.target;
    if (shape) {
        shape.moveTo(startLayer);
        dragLayer.draw();
        startLayer.draw();
    }
});