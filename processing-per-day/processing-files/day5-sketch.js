function setup() {
    createCanvas(800, 800);
    noLoop();
}
function draw() {
    background(255);
    let colors = ['#F3753C', '#F04A00', '#00A6F0','#00A6F0'];
    let colors2 = ['#F04A00', '#F3753C', '#00A6F0'];
    let numBuildings = 10; // Number of buildings on each side
    let streetWidth = 200;
    let hillHeight = 150;
    let offsetdistance = 100 * random(-1,1.5);
    // Draw buildings on the left side
    for (let i = 0; i < numBuildings; i++) {
        let x = map(i, 0, numBuildings - 1, 100, width / 2 - streetWidth / 2 - offsetdistance);
        let heightVariation = random(180, 400);
        let buildingHeight = map(i, 0, numBuildings - 1, 300, 50) + heightVariation;
        let colorIndex = i % colors.length;
        fill(colors[colorIndex]);
        rect(x, height - buildingHeight, 70, buildingHeight);
    }
    // Draw buildings on the right side
    for (let i = 0; i < numBuildings; i++) {
        let x = map(i, 0, numBuildings - 1, width - 100, width / 2 + streetWidth / 2 - offsetdistance * 2);
        let heightVariation = random(50, 420);
        let buildingHeight = map(i, 0, numBuildings - 1, 300, 50) + heightVariation;
        let colorIndex2 = i % colors2.length;
        fill(colors2[colorIndex2]);
        rect(x - 50, height - buildingHeight, 70, buildingHeight);
    }
}