stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
    draggable: true
});

layer = new Konva.Layer();
stage.add(layer);
colors = Konva.Util.getRandomColor();

function createShape() {
    let group = new Konva.Group({
        x: Math.random() * width,
        y: Math.random() * height,
        draggable: true
    });
    let shape = new Konva.Rect({
        width: 130 + Math.random() * 30,
        height: 130 + Math.random() * 30,
        fill: 'black',
        name: 'fillShape'
    });
    group.add(shape);

    let boundingBox = shape.getClientRect({ relativeTo: group });

    let box = new Konva.Rect({
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
    });
    group.add(box);
    return group;
}

for (let i = 0; i < 10; i++) {
    layer.add(createShape());
}
layer.draw();

layer.on('dragmove', function(e) {
    let target = e.target;
    let targetRect = e.target.getClientRect();
    layer.children.each(function(group) {
        // do not check intersection with itself
        if (group === target) {
            return;
        }
        if (haveIntersection(group.getClientRect(), targetRect)) {
            group.findOne('.fillShape').fill(colors);
        } else {
            group.findOne('.fillShape').fill('black');
        }
        // do not need to call layer.draw() here
        // because it will be called by dragmove action
    });
});

function haveIntersection(r1, r2) {
    return !(
        r2.x > r1.x + r1.width ||
        r2.x + r2.width < r1.x ||
        r2.y > r1.y + r1.height ||
        r2.y + r2.height < r1.y
    );
}