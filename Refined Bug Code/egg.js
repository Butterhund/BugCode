var imgEggStem;
var imgEggSand;
var imgEggGrass;
var imgEggCarnivore;
var imgEggStalker;
var imgEggCrawler;

class Egg {
  constructor(x, y, dna) {
    this.timer = 100;
    this.x = x;
    this.y = y;
    this.dna = dna;
    this.isDead = false;
    this.imgEgg = imgEggStem;
    this.eggSize = 8;

    if (this.dna[6] > 0.75 && this.dna[6] < 1.5) {
      this.imgEgg = imgEggCarnivore;
      this.eggSize = 25;
    }

    if (this.dna[2] <= 0.5) {
      this.imgEgg = imgEggGrass;
      this.eggSize = 15;
      }

    if (this.dna[2] >= 1.5) {
      this.imgEgg = imgEggSand;
      this.eggSize = 15;
      }

    if (this.dna[6] > 1.5) {
      this.imgEgg = imgEggStalker;
      this.eggSize = 30;
    }

    if (this.dna[6] < 0.75) {
      this.imgEgg = imgEggCrawler;
      this.eggSize = 45;
    }

    this.imgEgg.resize(this.eggSize, this.eggSize);
  };

  update() {
    this.timer -= 0.5;
    if (this.timer == 0 && this.isDead == false && this.dna[6] >= 0) {
      // make a new vehicle
      carnivores.push(new Carnivore(this.x, this.y, this.dna));
      //add to vehicles array
      this.isDead = true;

    } else if (this.timer == 0 && this.isDead == false){
      vehicles.push(new Vehicle(this.x, this.y, this.dna));
      this.isDead = true;
    }
  };

  display() {
    push();
    translate(this.x, this.y);
    imageMode(CENTER);
    image(this.imgEgg, 0, 0);
    pop();
  };
}
