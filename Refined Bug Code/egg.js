class Egg {
  constructor(x, y, dna) {
    this.timer = 100;
    this.x = x;
    this.y = y;
    this.dna = dna;
    this.isDead = false;
  //  this.img = EGGIMAGE;
  };

  update() {
    this.timer -= 0.5;
    if (this.timer == 0 && this.isDead == false) {
      // make a new vehicle
      vehicles.push(new Vehicle(this.x, this.y, this.dna));
      //add to vehicles array
      this.isDead = true;
    }
  };
  display() {
    fill(0, 255, 238);
    stroke(0,0,0);
    strokeWeight(3);
    ellipse(this.x, this.y, 10, 15, 25);
  };
}
