var mr = 1;
var imgStem;
var imgCarnivore;
var imgCrawler;
var imgStalker;
var imgDweller;
var imgFly;
var imgMAP;
var imgNomad;
var imgDwellerSand;
var imgNomadSand;
var imgFlySand;
var digestionWeight = 1.5;

class Vehicle {
  constructor(x, y, dna){
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 4;
    this.maxspeed = 1.5;
    this.maxforce = 0.2;
    this.size = 20;
    this.eggSize = 10;
    this.health = 50;
    this.maxhealth;
    this.digestion = 1;
    this.img = imgStem;
    this.dna = [];

    // When no DNA is inherited: Give vehicles DNA:
    if (dna === undefined) {
      // Food weight: Currently same weight is used on all foods.
      this.dna[0] = 1;
      // Super food perception <-> Normal food perception.
      this.dna[2] = 1;
      // Speed <-> Digestion:
      this.dna[4] = random(0.75, 1.25);
      // Health <-> Handling:
      this.dna[5] = random(0.75, 1.25);

    } else {
      // Inherrit and mutate.
      this.dna[0] = dna[0];
      if (random(1) < mr) {
        this.dna[0] += random(-0.1, 0.1);
      }

      this.dna[2] = dna[2];
      if (random(1) < mr) {
        this.dna[2] *= random(0.75, 1.25);
      }
      //Mutating in the direction of either maxspeed or energyDrain!
      this.dna[4] = dna[4];
      if (random(1) < mr) {
        this.dna[4] *= random(0.75, 1.25);
      }
      //Mutating in the direction of either health or handling(maxforce)!
      this.dna[5] = dna[5];
      if (random(1) < mr) {
        this.dna[5] *= random(0.95, 1.05);
      }
    }
  //DNA's modifies the values based on DNA inside the constructor.
    // Speed <-> digestion:
    this.maxspeed = (this.maxspeed * this.dna[4]);
    this.digestion = this.digestion * this.dna[4]*digestionWeight; // digestionWeight = % penalty for DNA[4].

    // Health <-> Handling:
    this.maxhealth = 100 * this.dna[5];
    this.health = (this.maxhealth / 2);
    this.maxforce = this.maxforce / this.dna[5];

    // image assignment:
    if(this.dna[2] <= 0.5) {
      this.img = imgDwellerSand;

      if(this.maxspeed > 3) {
        this.img = imgFlySand;
        this.size = 25;
      }

    if (this.dna[2] <= 0.3 && this.maxspeed < 3) {
        this.img = imgNomadSand;
        this.size = 35;
      }
    }

    if (this.dna[2] >= 1.5) {
      this.img = imgDweller;
      this.size = 25;

      if(this.maxspeed > 3) {
          this.img = imgFly;
          this.size = 25;
      }

    if (this.dna[2] >= 1.7 && this.maxspeed < 3) {
      this.img = imgNomad;
      this.size = 35;
      }
    }

    this.img.resize(this.size, this.size);
  };

  getType(){
    var type;
    if(this.dna[2] <= 0.5 && this.dna[2]>=0.3) {

      return "dwellerSand"
      }

    if(this.maxspeed > 3 && this.dna[2]<=0.5) {
      return "flySand";
      }

    if (this.dna[2] <= 0.3 && this.maxspeed < 3) {
      return "nomadSand";
      }

    if (this.dna[2] >= 1.5 && this.dna[2] <=1.7) {
      return "dweller";
      }

    if(this.maxspeed > 3 && this.dna[2]>=1.5) {
      return "fly";
      }

    if (this.dna[2] >= 1.7 && this.maxspeed < 3) {
      return "nomad"
      }
};
  // Method to update vehicles.
  update() {
    this.health -= 0.25
     * this.digestion;
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  };

  applyForce(force) {
    this.acceleration.add(force);
  };

  behaviors(grasslands, mountains, jungle) {
    var steerG = this.eat(grasslands, 20, 50 * this.dna[2]); // 20 = energy gained from grasslands food.
    var steerB = this.eat(mountains, 100, 50 / this.dna[2]); // 100 = energy gained from super food.
    var steerJ = this.eat(jungle, 20, 50 * this.dna[2]);    // 20 = energy gained from junglefood

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[0]);
    steerJ.mult(this.dna[0]);

    this.applyForce(steerG);
    this.applyForce(steerB);
    this.applyForce(steerJ);
  };

  layEgg() {
    if(this.health > (this.maxhealth)) {
      this.health = this.maxhealth/1.5;
      eggs.push(new Egg(this.position.x, this.position.y, this.dna));
    } else {
      return null;
    }
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
  seek(target) {
    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    desired.setMag(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
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

    imageMode(CENTER);
    image(this.img, 0, 0);
    pop();
  };

  boundaries() {
    var desired = null;
    if (this.position.x < edge) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - edge) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < edge) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - edge) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }
    // Exception of boundaries while creatures are on "the path" to other biomes.
    if(this.position.y < pathUpper || this.position.y > pathLower) {

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
