class Carnivore extends Vehicle{

  constructor(x, y, dna) {
    super(x,y,dna);
    this.prey = new Vehicle();
    this.img = imgCarnivore; //should make it like this. Not global.
    this.maxspeed = 2;
    this.size = 40;
    this.health = 200;

    //Predator DNA:
      if (dna === undefined) {
        this.dna[6] = random(0.5, 1.5);
      } else {
        this.dna[6] = dna[6];
        if (random(1) < mr) {
          this.dna[6] *= random(0.50, 1.50);
        }
    }
    this.maxspeed = (this.maxspeed * this.dna[6]);

    //Image assignment, based on DNA:
    if (this.dna[6] > 1.5) {
      this.img = imgStalker;
      this.size = 45;
    }

    if (this.dna[6] < 0.75) {
      this.img = imgCrawler;
      this.size = 60;
    }
  };


  getTypeCarnivore() {
    if (this.dna[6] > 1.5) {
      return "stalker"

    }

    if(this.dna[6]<0.75 && this.dna[6]>0.50){
      return "crawler"
    }

    if(this.dna[6]<1.5 && this.dna[6]>0.75){
      return "regular"
    }

  };

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


  behaviors(good) {
    var steerG = this.eat(good, 200, 200/this.dna[6]);
    steerG.mult(this.dna[0]);
    this.applyForce(steerG);

  };

  layEgg() {
    if(this.health > 1000) {
      this.health = 200;
      eggs.push(new Egg(this.position.x, this.position.y, this.dna));
    } else {
      return null;
    }
  }

  clone() {
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
  //  steer.mult(-1);// Reverse seeking to fleeing.
    return steer;
  }


  display() {
    // Rotate in the direction of velocity
    var angle = this.velocity.heading() + PI / 2;
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    if (debug.checked()) {
      strokeWeight(3);
      noFill();

      //Green test ring: ellipse(0, 0, x);
      stroke(0, 255, 0);
      ellipse(0, 0, 0);

      //Red test ring:
      stroke(255, 0, 0);
      ellipse(0, 0, 0);

      //Blue test ring:
      stroke(0, 0, 255);
      ellipse(0, 0, 0);

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
