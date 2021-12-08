
var img;
var img2;
var img3;
var img4;
var img5;
var img6;
var img7;
var img8;

//List of arrays:
var carnivores = [];
var vehicles = [];
var food = [];
var foodSuper = [];
var debug;

//River variables:
var riverWidth = 150;
var riverL = 600;
var riverR = riverL + riverWidth;
var riverM = riverL + (riverWidth/2);
//Mountain variables:
mountWidth = 150;
var mountL = 1600;
var mountR = mountL + mountWidth;
var mountM = mountL + (mountWidth/2)
//Map variables:
var mapWidth = 1200*2;
var mapHeight = 550*2;

function setup() {
  createCanvas(mapWidth, mapHeight);
  frameRate(60);
  img=loadImage("Png til skole/Stem3.png.png");
  img2=loadImage("Png til skole/Carnivore2.png.png");
  img3=loadImage("Png til skole/perceptionbug.png.png");
  img4=loadImage("Png til skole/poisonperceptionbug.png.png");
  img5=loadImage("Png til skole/ultimateperceptionbug.png.png");
  img6=loadImage("Png til skole/Bigboi.png.png");
  img7=loadImage("Png til skole/WaterBug.png.png");
  img8=loadImage("Png til skole/Jungle.png.png")

  //Initial vehicle spawner:
  for (var i = 0; i < 40; i++) {
    var x = random(riverR, mountL);
    var y = random(height);
    vehicles[i] = new Vehicle(x, y);
  }

  //Initial carnivore spawner:
  for (var i = 0; i < 0; i++) {
    var x = random(riverR, mountL);
    var y = random(height);
    carnivores[i] = new Carnivore(x, y);
  }

  // CENTER MAP FOOD - Grasslands - Normal food:
  var foodGrassMax = 40;
  for (var i = 0; i < foodGrassMax; i++) {
    var x = random(riverR+25, mountL-25);
    var y = random(height-25, 25);
    food.push(createVector(x, y));
  }
  // RIGHT MAP FOOD - Mountains - (less) Super food:
  var foodMountMax = 10;
  for (var i = 0; i < foodMountMax; i++) {
    var x = random(mountR+25, width-25);
    var y = random(height-25, 25);
    foodSuper.push(createVector(x, y));
  }
  // LEFT MAP FOOD - Jungles - (High concentration of food) Normal food):
  var foodJungleMax = 50;
  for (var i = 0; i < foodJungleMax; i++) {
    var x = random(25, riverL);
    var y = random(height-25, 25);
    food.push(createVector(x, y));
  }
  debug = createCheckbox(); //
}

function mouseDragged() { //Testing vehicles by clicking mouse
  vehicles.push(new Vehicle(mouseX, mouseY));
}

/*function mouseDragged() {
  //Testing vehicles by clicking mouse
  carnivores.push(new Carnivore(mouseX, mouseY));
}*/

function draw() {
  background(51);
//left higher river:
  fill(3, 78, 252);
  rect(riverL, -25, riverWidth, height/2);

//Left lower river:
  fill(3, 78, 252);
  rect(riverL, 575, riverWidth, height/2);

//Right higher mountain
  fill(156, 104, 26);
  rect(mountL, -25, mountWidth, height/2);

//Right lower mountain:
  fill(156, 104, 26);
  rect(mountL, 575, mountWidth, height/2);

  for (i = 0; i < vehicles.length; i++){
      textSize(32);
      text("Creatures Alive: "+ vehicles.length, 10, 30);
      fill(252, 3, 3);
    }

  for (i = 0; i < carnivores.length; i++){
      textSize(32);
      text("Carnivores Alive: "+ carnivores.length, 10, 60);
      fill(252, 3, 3);
    }

  //Food growth - Jungles! (High spawn rate of normal food):
  if(food.length < 90*10) {
    if (random(1) < 0.4) {
      var x = random(25, riverL-25);
      var y = random(height-25, 25);
      food.push(createVector(x, y));
    }

    //Food growth - Grasslands! (normal):
    if (random(1) < 0.4) {
      var x = random(riverR+25, mountL-25);
      var y = random(height-25, 25);
      food.push(createVector(x, y));
    }
  }
  //Food growth - Mountains! (Low spawn rate of super food):
    if (random(10) < 0.1 && foodSuper.length < 10*3) {
      var x = random(mountR+25, mapWidth-25);
      var y = random(height-25, 25);
      foodSuper.push(createVector(x, y));
    }
  //Food visuals:
  for (var i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 4, 4);
  }
  // Super food visuals:
  for (var i = 0; i < foodSuper.length; i++) {
    fill(0, 255, 195);
    noStroke();
    ellipse(foodSuper[i].x, foodSuper[i].y, 6, 6);
  }

  for (var i = vehicles.length - 1; i >= 0; i--) {
    vehicles[i].boundaries();
    vehicles[i].behaviors(food, foodSuper);
    vehicles[i].update(); //Updates position of Vehicle
    vehicles[i].display(); // Visuals for Vehicle
    //vehicles[i].flee(target);
    var newVehicle = vehicles[i].clone();
    if (newVehicle != null) {
      vehicles.push(newVehicle);
    }

    if (vehicles[i].dead()) {
      var x = vehicles[i].position.x;
      var y = vehicles[i].position.y;
      vehicles.splice(i, 1);
      // if(random(100) < 2) {
      //   carnivores.push(new Carnivore(x, y));
      // }
    }
  }

  for (var i = carnivores.length - 1; i >= 0; i--) {
    carnivores[i].boundaries();
    //carnivores[i].behaviors(food, poison);
    //instead use the list of vehicles
    carnivores[i].behaviors(vehicles);
    carnivores[i].update(); //Updates position of Vehicle
    carnivores[i].display(); // Visuals for Vehicle

    var newCarnivore = carnivores[i].clone();
    if (newCarnivore != null) {
      carnivores.push(newCarnivore);
    }

    if (carnivores[i].dead()) {
      var x = carnivores[i].position.x;
      var y = carnivores[i].position.y;
      carnivores.splice(i, 1);
      // if(random(100) < 50) {
      //   vehicles.push(new Vehicle(x, y));
      // }
    }
  }

}
