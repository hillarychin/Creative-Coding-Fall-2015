// SPIROGRAPH
// http://en.wikipedia.org/wiki/Spirograph
// also (for inspiration):
// http://ensign.editme.com/t43dances
//
// this p5 sketch uses simple transformations to create a
// Spirograph-like effect with interlocking circles (called sines).  
// press the spacebar to switch between tracing and
// showing the underlying geometry.
//
// your tasks:
// (1) tweak the code to change the simulation so that it draws something you like.
// hint: you can change the underlying system, the way it gets traced when you hit the space bar,
// or both.  try to change *both*.  :)
// (2) use p5.sound or tone.js to make the simulation MAKE SOUND.
// hint: the websites for p5.sound and tone.js have lots of examples.
// try and adapt them.
// another hint: javascript isn't super efficient with a large number of audio playing at once.
// see if there's a simple way to get an effective sound, or limit the number of shapes
// you're working with.

var NUMSINES = 20; // how many of these things can we do at once?
var sines = new Array(NUMSINES); // an array to hold all the current angles
var rad; // an initial radius value for the central sine
var i; // a counter variable

// play with these to get a sense of what's going on:
var fund = 2; // the speed of the central sine
var ratio = 7; // what multiplier for speed is each additional sine?
var alpha = 30; // how opaque is the tracing system

var trace = false; // are we tracing?

var box, drum, myPart;
var boxPat = [1,0,0,2,0,2,0,0];
var drumPat = [0,1,1,0,2,0,1,0];

var osc;

function preload(){
  box = loadSound('assets/synth.mp3');
  drum = loadSound('assets/snare.wav');
}

function setup()
{
  createCanvas(800, 600); // OpenGL mode
  
  osc = new p5.Oscillator(); // set it up
  osc.setType('triangle'); // what kind of sound?
  osc.start(); // start it going
  
  masterVolume(0.1);

  var boxPhrase = new p5.Phrase('box', playBox, boxPat);
  var drumPhrase = new p5.Phrase('drum', playDrum, drumPat);
  myPart = new p5.Part();
  myPart.addPhrase(boxPhrase);
  myPart.addPhrase(drumPhrase);
  myPart.setBPM(60);
  masterVolume(0.1);

  rad = height/4; // compute radius for central circle
  background(0); // clear the screen

  for (i = 0; i<sines.length; i++)
  {
    sines[i] = PI; // start EVERYBODY facing NORTH
  }
}

function draw()
{
  var thefreq = map(mouseX, 0, width, 100, 1000);
  osc.freq(thefreq);
  var theamp = map(mouseY, 0, height, 1, 0);
  osc.amp(theamp, 0.1); // the 0.1 is how long to fade
  
  if (!trace) {
    background(0); // clear screen if showing geometry
    stroke(0, 6, 255); // black pen
    strokeWeight(5);
    noFill(); // don't fill
  } 

  // MAIN ACTION
  push(); // start a transformation matrix
  translate(width/2, height/2); // move to middle of screen

  for (i = 0; i<sines.length; i++) // go through all the sines
  {
    var erad = 0; // radius for small "point" within circle... this is the 'pen' when tracing
    // setup for tracing
    if (trace) {
      stroke(0, 0, 255*(float(i)/sines.length), alpha); // blue
      fill(0, 0, 255, alpha/2); // also, um, blue
      erad = 3.0*(1.0-float(i)/sines.length); // pen width will be related to which sine
    }
    var radius = rad/(i+0.8); // radius for circle itself
    rotate(sines[i]); // rotate circle
    if (!trace) ellipse(0, 0, radius/2, radius/8); // if we're simulating, draw the sine
    push(); // go up one level
    translate(0, radius); // move to sine edge
    if (!trace) ellipse(5, 7, 2, 1); // draw a little circle
    if (trace) ellipse(255, 255, erad, erad); // draw with erad if tracing
    pop(); // go down one level
    translate(0, radius); // move into position for next sine
    sines[i] = (sines[i]+(fund+(fund*i*ratio)))%TWO_PI; // update angle based on fundamental
  }
  
  pop(); // pop down final transformation
  
}

function keyReleased()
{
  if (key==' ') {
    trace = !trace; 
    background(0);
    myPart.start();
  }
}

function playBox(time, playbackRate) {
  box.rate(playbackRate);
  box.play(time);
}

function playDrum(time, playbackRate) {
  drum.rate(playbackRate);
  drum.play(time);
}