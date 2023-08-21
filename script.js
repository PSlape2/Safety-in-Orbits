class Vector {
  constructor(x, y, z, g) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.g = g;
  }
}

let g = 0.05;

let v1;
let v2;
let v3;
let thrustVector;
let targetRotation;
let nextRotation;

let rotationX;
let rotationY;
let rotationZ;

let rocket;
let planet;
let pg;
let bg;
let planetTexture;
let spacestars;
let stars;
let biden;
let earthtxtr;
let boontxtr;

let targetx;
let targety;
let targetz;
let per;
let apo;

let cont = true;
let cam;
let i = 0;
let m = 0;
let def;

function preload() {
  rocket = loadModel('rocket.obj');
  planet = loadModel('planet.obj');
  planetTexture = loadImage('R.png');
  biden = loadImage('BIDEN.png');
  bg = loadImage('space.jpg');
  earthtxtr = loadImage('earthtxtr.png');
  boontxtr = loadImage('boontexture.jpg');
  stars = loadImage('R.jpeg');
}
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  pg = createGraphics(300, 300);
  v1 = createVector(200, 0, 0);
  v2 = createVector(0, 0, 10);
  v3 = createVector(0, 0, 0);
  def = createVector(0, 0, 0);
  
  targetRotation = createVector(0, 0, 0);
  nextRotation = createVector(0, 0, 0);
  thrustVector = createVector(0, 0, 0);
  
  rotationX = 0;
  rotationZ = 0;
  per = v1.x;
  apo = v1.x;
  
  slider = createSlider(1, 240, 5);
  slider.position(10, 10);
  slider.style('width', '300px');
  
  cam = createCamera();
}
function backgrounds() {
  push();
  texture(stars);
  strokeWeight(0);
  sphere(5000);
  pop();
}
function Earth() {
  push();
  translate(0,0,0);
  rotateY(frameCount * 0.01);
  strokeWeight(0);
  texture(biden);
  //texture(earthtxtr);
  model(planet); 
  pop();
}

function draw() {
  fr = slider.value();
  //resizeCanvas(windowWidth, windowHeight);
  frameRate(fr);
  background(205, 102, 94);
  backgrounds();
  orbitControl();
  Earth();
  addThrust();
  ship();
  recordOrbitStats();
  debug();
  lookAtShip();
  Boon();
}
function debug() {
  if(i == 1) {
    pg.background(100);
    pg.textSize(20);
    pg.text(round(v1.x), 0, 20);
    pg.text(round(v1.y), 60, 20);
    pg.text(round(v1.z), 120, 20);
    pg.text(round(v2.x), 0, 60);
    pg.text(round(v2.y), 60, 60);
    pg.text(round(v2.z), 120, 60);
    pg.text(round(v3.x, 2), 0, 100);
    pg.text(round(v3.y, 2), 60, 100);
    pg.text(round(v3.z, 2), 120, 100);
    pg.text(round(targetx, 2), 0, 140);
    pg.text(round(targety, 2), 60, 140);
    pg.text(round(targetz, 2), 120, 140);
    pg.text(round(v1.dist(def), 2), 0, 180);
    pg.text(round(per, 2), 80, 180);
    pg.text(round(apo, 2), 160, 180);
    pg.text(round(thrustVector.x, 2), 0, 220);
    pg.text(round(thrustVector.y, 2), 60, 220);
    pg.text(round(thrustVector.z, 2), 120, 220);
    image(pg, 100, 100);
    if(keyIsPressed) {
      if(keyCode == 81) {
        i = 0;
      }
    }
    
  }
  else if(keyIsPressed && keyCode == 81) {
    i = 1;
  }
}
function ship() {
  if(cont) {
    push();
    updateValues();
    translate(v1.x, v1.y, v1.z);
    rotater();
    //texture(rocketTexture);
    strokeWeight(0.1);
    model(rocket);
    pop();
  }
}
function updateValues() {
  /*
  if(v1.x <= 0) {
    targetx = v3.x + g;
  } else {
    targetx = v3.x - g; 
  }
  if(v1.y <= 0) {
    targety = v3.y + g;
  } else {
    targety = v3.y - g; 
  }
  if(v1.z <= 0) {
    targetz = v3.z + g;
  } else {
    targetz = v3.z - g; 
  }
  */
  targetx = (-v1.x / v1.dist(def));
  targety = (-v1.y / v1.dist(def));
  targetz = (-v1.z / v1.dist(def));
  v3.set(targetx, targety, targetz);
  v2.add(v3.div(2));
  v1.add(v2);
}

function lookAtShip() {
  if(keyCode == 82) {
    m = 1;
  }
  if(keyCode == 69) {
    m = 2;
  }
  if(m == 1) {
    cam.lookAt(v1.x, v1.y, v1.z);
  } 
  else if(m == 2) {
    cam.lookAt(0, 0, 0);
  } 
}

function recordOrbitStats() {
  if(abs(v1.x) < abs(per)) {
    per = v1.x;
  }
  if(abs(v1.y) < abs(per)) {
    per = v1.y;
  }
  if(abs(v1.z) < abs(per)) {
    per = v1.z;
  }
  if(abs(v1.x) > abs(apo)) {
    apo = v1.x;
  }
  if(abs(v1.y) > abs(apo)) {
    apo = v1.y;
  }
  if(abs(v1.z) > abs(apo)) {
    apo = v1.z;
  }
}



function addThrust() {
  thrustVector = p5.Vector.fromAngle(rotationX + 45);
  thrustVector.add(p5.Vector.fromAngle(rotationZ + 45));
  thrustVector.mult(0.6);
  if(keyIsPressed) {
    if(keyCode == 32) {
      v2.add(thrustVector);
    }
  }
}

function rotater() {
  if(keyIsPressed) {
    if(keyCode == 65) {
      rotationX += 0.1;
    }
    if(keyCode == 68) {
      rotationX -= 0.1;
    }
    if(keyCode == 87) {
      rotationZ += 0.1; 
    }
    if(keyCode == 83) {
      rotationZ -= 0.1; 
    }
  }
  rotateY(rotationZ + 45);
  rotateX(rotationX + 45);
}

function Boon() {
  push();
  translate(1000,0,0);
	rotateY(frameCount * 0.03);
  strokeWeight(0);
  texture(boontxtr);
	sphere(25);
  pop();
}
