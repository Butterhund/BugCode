var mr = 0.1;
var speedBugCounter = 0;

class Vehicle {
  constructor(x, y, dna){
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 4;
    this.maxspeed = 1.5;
    this.maxforce = 0.3;
    this.size =20;
    this.health = 50;
    this.digestion = 1;
    //DNA's the creature will start with:
    this.dna = [];
    if (dna === undefined) {
      // Food weight
      this.dna[0] = random(-2, 2);
      // Super food weight
      this.dna[1] = random(-2, 2);
      // Food perception
      this.dna[2] = random(0, 100);
      // Super food Percepton
      this.dna[3] = random(0, 100);
      // Digestion modifier:
      this.dna[4] = random(0.75, 1.25);
      //   vehicles.push(new Vehicle(x, y));
      // }
      // this.dna[4] = random(1, 10);
      // //health
      // this.dna[5] = random(0.2,0.8);
      // //size
      // this.dna[6] = random(0,100);
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
      //Mutating in the direction of either maxspeed or energyDrain!
      //Lower DNA = less speed, but less digestion!
      this.dna[4] = dna[4];
      if (random(1) < mr) {
        this.dna[4] += random(-0.1, 0.1);
      }
      // MaximumSpeed <----> Digestion
      // if(random(2) < 1) {
      //   this.maxspeed += 0.1;
      //   this.digestion -= 0.1;
      // } else {
      //   this.maxspeed -= 0.1;
      //   this.digestion += 0.1;
      // +}
    }
    //DNA's modifies the values based on DNA inside the constructor.
    this.maxspeed = this.maxspeed * this.dna[4];
    this.digestion = this.digestion * this.dna[4];
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

  behaviors(good, bad) {// This controls towards poison/food
    var steerG = this.eat(good, 20, this.dna[2]); // 20 = energy from food.
    var steerB = this.eat(bad, 100, this.dna[3]); // 100 = energy from super food.

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  };

  clone() { //Reproduction of vehicle. Adopt Pos and DNA
    if (this.health > 99) {
      this.health = 50;
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
      strokeWeight(3);
      stroke(0, 255, 0);
      noFill();
    //  line(0, 0, 0, -this.dna[0] * 25); //dna[4] was dna[0].
      strokeWeight(2);
    //  ellipse(0, 0, this.dna[2] * 2);
      stroke(255, 0, 0);
    //  line(0, 0, 0, -this.dna[1] * 25); //dna[4] was dna[1].
      //ellipse(0, 0, this.dna[3] * 2);
      stroke(0, 0, 255);
      ellipse(0, 0, this.dna[4] * 100);
    }

    var gr = color(0, 255, 0);
    var rd = color(255, 0, 0);
    var col = lerpColor(rd, gr, this.health);
    imageMode(CENTER);
    image(img,0,0);
    img.resize(this.size, this.size);


    // if(this.dna[2] > 90){ //Turn into perceptionbug if perception excedes 90
    //   imageMode(CENTER);
    //   image(img3,0,0);
    //   img3.resize(this.size, this.size);
    // }





  /*  fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);*/

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
    if(this.position.y < 525 || this.position.y > 575) {

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
