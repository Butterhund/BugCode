var mr = 1;
var speedBugCounter = 0;
var img;
var img2;
var img3;
var img4;
var img5;
var img6;
var img7;
var img8;

class Vehicle {
  constructor(x, y, dna){
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 4;
    this.maxspeed = 1.5;
    this.maxforce = 0.2;
    this.size = 20;
    this.health = 50;
    this.maxhealth;
    this.digestion = 1;
    this.img;
    //DNA's the creature will start with:
    this.dna = [];

    if (dna === undefined) {
      // Food weight
      this.dna[0] = random(0, 2);
      // // Second food weight
      // this.dna[1] = random(-2, 2);
      // Food perception <-> reproduction cost
      this.dna[2] = 1;
      // // Second food Percepton
      // this.dna[3] = random(0, 100);
      // Speed <-> Digestion:
      this.dna[4] = random(0.75, 1.25);
      // Health <-> handling:
      this.dna[5] = random(0.75, 1.25);
      // Carnivores HUNT DNA: Speed <-> Vision
      this.dna[6] = random(0.5, 1.5);
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
        this.dna[2] *= random(0.75, 1.25);
      }
      this.dna[3] = dna[3];
      if (random(1) < mr) {
        this.dna[3] += random(-10, 10);
      }
      //Mutating in the direction of either maxspeed or energyDrain!
      //Lower DNA = less speed, but less health-loss.!
      this.dna[4] = dna[4];
      if (random(1) < mr) {
        this.dna[4] *= random(0.75, 1.25);
      }
      //Mutating in the direction of either health or handling(maxforce)!
      this.dna[5] = dna[5];
      if (random(1) < mr) {
        this.dna[5] *= random(0.95, 1.05);
      }
      //Carnivore Hunt mutation:
      this.dna[6] = dna[6];
      if (random(1) < mr) {
        this.dna[6] *= random(0.50, 1.50);
      }
    }
  //DNA's modifies the values based on DNA inside the constructor.
    // Speed <-> digestion:
    this.maxspeed = (this.maxspeed * this.dna[4]);
    this.digestion = (this.digestion * this.dna[4])*1,5;
    // Health <-> Handling:
    this.maxhealth = 100 * this.dna[5];
    this.health = (this.maxhealth / 2);
    this.maxforce = this.maxforce / this.dna[5];
    // image assignment:
    this.img = img;
    this.img.resize(this.size, this.size);
  }

  // Method to update location
  update() {
    this.health -= 0.25 * this.digestion;
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  };

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  };

  behaviors(good, bad, jungle) {// This controls towards poison/food
    var steerG = this.eat(good, 20, 50 * this.dna[2]); // 20 = energy from food. This dna[2]=(0-100);
    var steerB = this.eat(bad, 100, 50 / this.dna[2]); // 100 = energy from super food. // this.dna[2] changed from this.dna[3].
    var steerJ = this.eat(jungle, 20, 50 * (this.dna[2]*2));

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[0]); // this dna[0] changed from this dna[1].
    steerJ.mult(this.dna[0]);

    this.applyForce(steerG);
    this.applyForce(steerB);
    this.applyForce(steerJ);
  };

  clone() { //Reproduction of vehicle. Adopt Pos and DNA
    if (this.health > (this.maxhealth)) {
      this.health = this.maxhealth/1.5;
      return new Vehicle(this.position.x-25, this.position.y,   this.dna);

    } else {
      return null;
    }
  };

  eat(list, nutrition, perception) { //Vehicle Collison with food
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

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY

  seek(target) {
    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    desired.setMag(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
    //this.applyForce(steer);
  };

  dead() {
    return this.health < 0;
  };

  display() {
    // Draw a triangle rotated in the direction of velocity
    var angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    if (debug.checked()) {
    //   strokeWeight(3);
    //   stroke(0, 255, 0);
    //   noFill();
    // //  line(0, 0, 0, -this.dna[0] * 25); //dna[4] was dna[0].
    //   strokeWeight(2);
    //   //Green test ring:
    //   //ellipse(0, 0, this.health * 2);
    //   stroke(255, 0, 0);
    //   line(0, 0, 0, - this.dna[4] * 25); //dna[4] was dna[1].
    //   //Red test ring:
    //   ellipse(0, 0, 100/this.dna[2]);
    //   stroke(0, 0, 255);
    //   //Blue test ring:
    //   ellipse(0, 0, this.dna[2] * 100);
      // textSize(4*5);
    //  text(this.size, 5, 5);
      // fill(252, 3, 3);
    }
    imageMode(CENTER);
    image(this.img, 0, 0);
    pop();
  };
  // biomes() {
  //   // Jungle biome:
  //   if(jungle=true)
  //}
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
    if(this.position.y < 450 || this.position.y > 700) {

    // River boundaries START:
    if (this.position.x < riverR && this.position.x > riverM) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > riverL && this.position.x < riverM) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    // Mountain boundaries Start:
    if (this.position.x < mountR && this.position.x > mountM) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > mountL && this.position.x < mountM) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }
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
