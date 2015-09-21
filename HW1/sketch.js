// All the paths
var paths = [];
// Are we painting?
var painting = false;
// How long until the next circle
var next = 0;
// Where are we now and where were we?
var current;
var previous;

var h_num;
var Y_AXIS = 1;
var X_AXIS = 2;

var dim;

function setup() {
  createCanvas(720, 600);
  current = createVector(0,0);
  previous = createVector(0,0);
  
  h_num = random(0, 255);
  
  dim = width/2;
  background(0);
  colorMode(HSB, 360, 100, 100);
  noStroke();
};

function draw() {
  // If it's time for a new point
  if (millis() > next && painting) {

    // Grab mouse position      
    current.x = mouseX;
    current.y = mouseY;

    // New particle's force is based on mouse movement
    var force = p5.Vector.sub(current, previous);
    force.mult(0.05);

    // Add new particle
    paths[paths.length - 1].add(current, force);

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;
  }

  // Draw all paths
  for( var i = 0; i < paths.length; i++) {
    //paths[i].update();
    paths[i].display();
  }

}

// Start it up
function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  paths.push(new Path());
  
  var random_num, random_num2;
  random_num = random(0, 720);
  random_num2 = random(0, 600);
  ellipse(random_num, random_num2, 25, 25);
}

// Stop
function mouseReleased() {
  painting = false;
  h_num = random(0, 255);
  shuffle(paths);
}

// A Path is a list of particles
function Path() {
  this.particles = [];
  this.hue = random(100);
}

Path.prototype.add = function(position, force) {
  // Add a new particle with a position, force, and hue
  this.particles.push(new Particle(position, force, this.hue));
}

// Display path
Path.prototype.update = function() {  
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].update();
  }
}  

// Display path
Path.prototype.display = function() {
  
  // Loop through backwards
  for (var i = this.particles.length - 1; i >= 0; i--) {
    // If we shold remove it
    if (this.particles[i].lifespan <= 0) {
      this.particles.splice(i, 1);
    // Otherwise, display it
    } else {
      this.particles[i].display(this.particles[i+1]);
    }
  }

}  

// Particles along the path
function Particle(position, force, hue) {
  this.position = createVector(position.x, position.y);
  this.velocity = createVector(force.x, force.y);
  this.drag = 0;
  this.lifespan = 300;
}

Particle.prototype.update = function() {
  // Move it
  this.position.add(this.velocity);
  // Slow it down
  this.velocity.mult(this.drag);
  // Fade it out
  this.lifespan--;
}

Particle.prototype.display = function(other) {
  drawGradient(this.position.x, this.position.y);
}

function drawGradient(x, y) {
  var radius = 50;
  var h = h_num;
  for (var r = radius; r > 0; --r) {
    fill(h, 90, 90);
    ellipse(x, y, r, r);
    h = (h + 1) % 360;
  }
}

function keyReleased()
{
  background(0);
  for( var i = 0; i < paths.length; i++) {
    shorten(paths);
  }
}
