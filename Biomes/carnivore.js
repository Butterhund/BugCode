
class Carnivore extends Vehicle{

  constructor(x, y, dna){
    super(x,y,dna);
    this.prey = new Vehicle();
    this.img = img2; //should make it like this. Not global.
    this.maxspeed=2;
    this.health = 2;
  }
  //Method to update Carnivore location
  update() {
    this.health -= 0.004;
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  };

  dead() {
    return this.health < 0;
  };

  //not handlling poison for now
  behaviors(good) {// This controls towards poison/food
    var steerG = this.eat(good, 2, this.dna[2]);
    //var steerB = this.eat(bad, -1, this.dna[3]);

    steerG.mult(this.dna[0]);
    //steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    //this.applyForce(steerB);
  };

  clone() { //Reproduction of vehicle. Adopt Pos and DNA
    if (this.health > 10) {
      this.health = 2;
      return new Carnivore(this.position.x-25, this.position.y,   this.dna);

    } else {
      return null;
    }
  };

  eat(preyList, nutrition, perception){
    var record = Infinity;
    var closest = null;
    for (var i = preyList.length - 1; i >= 0; i--) {
      var d = this.position.dist(preyList[i].position);
      if (d < this.maxspeed) {
        //eat!
        preyList.splice(i, 1);
        this.health += nutrition;
      } else {
        if (d < record && d < perception) {
          record = d;
          closest = preyList[i];
        }
      }
    }

    // This is the moment of eating!

    if (closest != null) {
      return this.seek(closest);
    }
    return createVector(0, 0);
  }

  seek(preyVehicle){
    var desired = p5.Vector.sub(preyVehicle.position, this.position); // A vector pointing from the location to the target
    // Scale to maximum speed
    desired.setMag(this.maxspeed);
    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
  //  steer.mult(-1);// REVERSE THE HUNT! AKA: FLEE!
    return steer;
    //this.applyForce(steer);
  }
  // avoid(preyVehicle) { ASDASDASDASDASDASDASDASDASD
  //   var desired = p5.Vector.sub
  // }

  display() {
    // Draw a triangle rotated in the direction of velocity
    var angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    if (debug.checked()) {
      strokeWeight(3);
      stroke(0, 255, 0);
      noFill();
      line(0, 0, 0, -this.dna[0] * 25);
      strokeWeight(2);
      ellipse(0, 0, this.dna[2] * 2);
      stroke(255, 0, 0);
      line(0, 0, 0, -this.dna[1] * 25);
      ellipse(0, 0, this.dna[3] * 2);
    }

    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);
    imageMode(CENTER);
    image(this.img,0,0);
    this.img.resize(this.size, this.size);
    pop();
  }




}



/*function Carnivore(x, y, dna) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 4;
  this.maxspeed = 16;
  this.maxforce = 0.2;
  this.target = createVector(x, y);

  this.health = 1;
  this.dna = [];
  if (dna === undefined) {
    // Food weight
    this.dna[0] = random(-2, 2);
    // Poison weight
    this.dna[1] = random(-2, 2);
    // Food perception
    this.dna[2] = random(0, 100);
    // Poision Percepton
    this.dna[3] = random(0, 100);
  } else {
    // Mutation
    this.dna[0] = dna[0];
    if (random(1) < mr) {
      this.dna[0] += random(-0.1, 0.1);
    }
    this.dna[1] = dna[1];
    if (random(1) < mr) {
      this.dna[1] += random(-0.1, 0.1);
    }
    this.dna[2] = dna[2];
    if (random(1) < mr) {
      this.dna[2] += random(-10, 10);
    }
    this.dna[3] = dna[3];
    if (random(1) < mr) {
      this.dna[3] += random(-10, 10);
    }
  }

  //Method to update Carnivore location
  this.update = function () {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  };
  this.applyForce = function (force) {
    //We could add mass here if we want
    this.acceleration.add(force);
  };

  // A method that calculates a steering force
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function (target) {
    var desired = p5.Vector.sub(target, this.position); //

    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    this.applyForce(steer);
  };
  this.behaviors = function (good) {
    // This controls towards poison/food
    var steerG = this.eat(good, 0.2, this.dna[2]);
    //var steerB = this.eat(bad, -1, this.dna[3]);

    // steerG.mult(this.dna[0]);
    //steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    //  this.applyForce(steerB);
  };

  this.eat = function (list, nutrition, perception) {
    //Vehicle Collison with food
    var record = Infinity;
    var closest = null;
    for (var i = list.length - 1; i >= 0; i--) {
      var d = this.position.dist(list[i]);

      if (d < this.maxspeed) {
        list.splice(i, 1);
        this.health += nutrition;
      } else {
        if (d < record && d < perception) {
          record = d;
          closest = list[i];
        }
      }
    }

    // This is the moment of eating!

    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  };

  this.display = function () {
    // Draw a triangle rotated in the direction of velocity
    var angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    if (debug.checked()) {
      strokeWeight(3);
      stroke(0, 255, 0);
      noFill();
      line(0, 0, 0, -this.dna[0] * 25);
      strokeWeight(2);
      ellipse(0, 0, this.dna[2] * 2);
      stroke(255, 0, 0);
      line(0, 0, 0, -this.dna[1] * 25);
      ellipse(0, 0, this.dna[3] * 2);
    }

    var gr = color(255, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);

    imageMode(CENTER);
    image(img2,0,0);
    img2.resize(20, 20);
*/
/*
    fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
*/
/*
    pop();
  };
  this.boundaries = function () {
    var d = 25;

    var desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  };
}
*/
