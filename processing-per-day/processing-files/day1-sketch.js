function setup() {
    createCanvas(800, 600);  // Creates a canvas of 800x600 pixels
    noLoop();  // Ensures the draw function only runs once
}

function draw() {
    background(240);

    for (let x = 50; x < width; x += 100) {
        for (let y = 50; y < height; y += 100) {
            fill(random(255), random(255), random(255));
            noStroke();
            ellipse(x, y, 80, 80);
        }
    }


}
