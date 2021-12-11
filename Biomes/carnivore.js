
class Carnivore extends Vehicle{

  constructor(x, y, dna){
    super(x,y,dna);
    this.prey = new Vehicle();
    this.img = img2; //should make it like this. Not global.
    this.maxspeed = 2;
    this.size = 40;
    this.health = 200;

    //Predator DNA:
    this.maxspeed = (this.maxspeed * this.dna[6]);


  }
  //Method to update Carnivore location
  update() {
    this.health -= this.maxhealth * 0.005;
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
    var steerG = this.eat(good, 200, 200/this.dna[6]);
    //var steerB = this.eat(bad, -1, this.dna[3]);

    steerG.mult(this.dna[0]);
    //steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    //this.applyForce(steerB);
  };

  clone() { //Reproduction of vehicle. Adopt Pos and DNA
    if (this.health > 1000) {
      this.health = 200;
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
      //line(0, 0, 0, -this.dna[0] * 25);
      strokeWeight(2);
      ellipse(0, 0, this.health * 0.5);
      stroke(255, 0, 0);
      line(0, 0, 0, -this.dna[1] * 25);
      ellipse(0, 0, 400/this.dna[6]);
    }

    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);
    imageMode(CENTER);
    image(this.img,0,0);
    this.img.resize(this.size, this.size);
    pop();
  }

  boundaries() {
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
    // Exception of boundaries while creatures are on "the path" to other biomes.

    // River boundaries START:
  if(this.position.y < 450 || this.position.y > 700) {
    if (this.position.x < riverR && this.position.x > riverM) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > riverL && this.position.x < riverM) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }
  }
    // Mountain boundaries Start:
    if (this.position.x > mountL) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    // Steering???? Idle maybe?
    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  };



}
