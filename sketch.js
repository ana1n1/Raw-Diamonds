let numVertex = 66; // SEED NUMBER
let vertexMin = 15; // Seed Min limit
let vertexMax = 99; // Seed Max limit
let interactStep = 1; // Step increase/decrease Seed
let size;
let density;
let slider;
let pauseChange = 50;
let gemsVertex = [];
let vertexXY = [];
let centerVect;
let saveNum = 0;
let demoIncr = true;
let demoClick = false;
let interval = 0;
let intervalSpeed = 167;

function setup() {
  checkSize();
  createCanvas(size, size);
  frameRate(15);
  colorMode(HSB, 360);
  strokeJoin(ROUND);
  strokeCap(ROUND);

  slider = createSlider(vertexMin, vertexMax, (vertexMin + vertexMax) / 2);
  slider.input(updateNumVertex);
  sliderPosition();

  buttonDemo = createButton("DEMO ►");
  buttonDemo.addClass("demo");
  buttonDemo.mousePressed(startDemo);
  buttonSave = createButton("SAVE");
  buttonSave.addClass("save");
  buttonSave.mousePressed(saveSouvenir);
  buttonsPosition();
}

function checkSize() {
  width = windowWidth;
  height = windowHeight;

  if (width > height) size = height;
  else size = width;

  density = size / 4;
  strokeWeight(size / 500);
  centerVect = createVector(size / 2, size / 2);
}

function sliderPosition() {
  slider.position(size * 0.1, size * 1.05);
  slider.style("width", size * 0.8 + "px");
}

function buttonsPosition() {
  buttonDemo.position(size * 0.1, size * 1.2);
  buttonSave.position(size * 0.52, size * 1.2);
}

function windowResized() {
  checkSize();
  resizeCanvas(size, size);

  sliderPosition();
  buttonsPosition();
  gemsVertex = [];
}

function draw() {
  background(360);

  for (let i = 0; i < numVertex; i++) {
    gemsVertex.push(generateGem());
  }
  for (let i = 0; i < numVertex; i++) {
    gemsVertex[i].update();
  }

  for (let i = 0; i < vertexXY.length; i++) {
    let colorSeed = round((map(i, 0, vertexXY.length, 0, 42) * numVertex) / 10);
    if (colorSeed > 360) colorSeed = 360;
    if (i + 2 < vertexXY.length) {
      stroke(30, 30);
      fill(colorSeed, 360, 360, 24); //   color
      beginShape();
      vertex(vertexXY[i][0].x, vertexXY[i][0].y);
      vertex(vertexXY[i][1].x, vertexXY[i][1].y);
      vertex(vertexXY[i + 1][0].x, vertexXY[i + 1][0].y);
      vertex(vertexXY[i + 1][1].x, vertexXY[i + 1][1].y);
      vertex(vertexXY[i + 2][0].x, vertexXY[i + 2][0].y);
      vertex(vertexXY[i + 2][1].x, vertexXY[i + 2][1].y);
      endShape(CLOSE);
    }
  }
  changeDirection();
}

function generateGem() {
  let gemsVertex = {};
  gemsVertex.position = createVector(
    width / 2 + random(size / -3, size / 3),
    height / 2 + random(size / -3, size / 3)
  );
  gemsVertex.direction = createVector(
    round(random()) * 2 - 1,
    round(random()) * 2 - 1
  );
  gemsVertex.update = function () {
    this.position.add(this.direction);

    if (round(centerVect.dist(this.position)) >= size / 2) {
      this.direction.rotate(PI);
      this.counter = pauseChange;
    }
    if (this.counter > 0) this.counter -= 1;
  };
  gemsVertex.counter = 0;
  return gemsVertex;
}

function changeDirection() {
  vertexXY = [];
  for (let i = 0; i < numVertex; i++) {
    for (let j = 0; j < numVertex; j++) {
      if (i != j) {
        let distance = p5.Vector.dist(
          gemsVertex[i].position,
          gemsVertex[j].position
        );
        if (distance < density) {
          if (gemsVertex[i].counter == 0) {
            gemsVertex[i].direction.rotate(random());
            gemsVertex[i].counter = pauseChange;
          }
          if (gemsVertex[j].counter == 0) {
            gemsVertex[j].direction.rotate(random());
            gemsVertex[j].counter = pauseChange;
          }
          vertexXY.push([gemsVertex[i].position, gemsVertex[j].position]);
        }
      }
    }
  }
}

// INTERACTION FUNCTIONS:

function startDemo() {
  demoClick = !demoClick;
  if (demoClick) {
    buttonDemo.html("DEMO ❚❚");
    if (demoIncr) interval = setInterval(increaseSeed, intervalSpeed);
    else interval = setInterval(decreaseSeed, intervalSpeed);
  } else {
    buttonDemo.html("DEMO ►");
    clearInterval(interval);
    interval = 0;
  }
  slider.input(updateNumVertex);
}

function updateNumVertex() {
  numVertex = slider.value();
  demoClick = false;
  buttonDemo.html("DEMO ►");
  clearInterval(interval);
  interval = 0;
}

function increaseSeed() {
  slider.value(numVertex);
  numVertex += interactStep;
  if (numVertex >= vertexMax) {
    numVertex = vertexMax;
    demoIncr = false;
    clearInterval(interval);
    interval = setInterval(decreaseSeed, intervalSpeed);
  }
}

function decreaseSeed() {
  slider.value(numVertex);
  numVertex -= interactStep;
  if (numVertex <= vertexMin) {
    numVertex = vertexMin;
    demoIncr = true;
    clearInterval(interval);
    interval = setInterval(increaseSeed, intervalSpeed);
  }
}

function saveSouvenir() {
  saveNum++;
  const zeroNum = (num, places) => String(saveNum).padStart(3, "0");
  saveCanvas(
    "Raw Diamond by Ana Gasharova (SEED" +
      numVertex +
      ") - " +
      zeroNum(3, saveNum),
    "png"
  );
}
