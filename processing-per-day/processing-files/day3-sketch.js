let habits = [
    { name: "", color: "#E57373" },
    { name: "", color: "#E57373" },
    { name: "", color: "#E57373" },
    { name: "", color: "#A0A0A0" },
    { name: "", color: "#A0A0A0" },
    { name: "", color: "#A0A0A0" },
    { name: "", color: "#64B5F6" },
    { name: "", color: "#64B5F6" },
    { name: "", color: "#64B5F6" },
    { name: "", color: "#E57373" },
    { name: "", color: "#E57373" },
    { name: "", color: "#E57373" },
    { name: "", color: "#A0A0A0" },
    { name: "", color: "#A0A0A0" },
    { name: "", color: "#A0A0A0" },
    { name: "", color: "#64B5F6" },
    { name: "", color: "#64B5F6" },
    { name: "", color: "#64B5F6" }
];

let daysInMonth = 19;
let cellSize = 30;
let startX = 100;
let startY = 20;
let padding = 5;

function setup() {
    createCanvas(680, 680);
    background(240);
    drawTracker();
}

function drawTracker() {
    textAlign(LEFT, CENTER);
    textSize(16);
    fill(0);
    text("", startX, startY - 20);



    // Draw habit rows
    for (let i = 0; i < habits.length; i++) {
        fill(habits[i].color);
        noStroke();
        rect(startX - 100, startY + i * (cellSize + padding), 90, cellSize, 5);
        
        fill(255);
        textSize(14);
        textAlign(LEFT, CENTER);
        text(habits[i].name, startX - 90, startY + i * (cellSize + padding) + cellSize / 2);

        drawHabitCells(i);
        drawHabitCells2(i);
    }
}

function drawHabitCells(habitIndex) {
    for (let j = 0; j < daysInMonth; j++) {
        let mark = random() > 0.7 ? "X" : "";  // Randomly mark the habit
        fill(255);
        stroke(200);
        rect(startX + j * cellSize, startY + habitIndex * (cellSize + padding), cellSize, cellSize);

        fill(0);
        textAlign(CENTER, CENTER);
        textSize(14);
        text(mark, startX + j * cellSize + cellSize / 2, startY + habitIndex * (cellSize + padding) + cellSize / 2);
    }
}

function drawHabitCells2(habitIndex) {
    for (let j = 0; j < daysInMonth; j++) {
        let mark = random() > 0.9 ? "0" : "";  // Randomly mark the habit
        fill(255);
        stroke(200);


        fill(0);
        textAlign(CENTER, CENTER);
        textSize(14);
        text(mark, startX + j * cellSize + cellSize / 2, startY + habitIndex * (cellSize + padding) + cellSize / 2);
    }
}
